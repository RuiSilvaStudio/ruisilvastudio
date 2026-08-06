// Rui Silva Studio — standalone form/email API.
// Isolated service: connects only to the `studio` Postgres database.
// Runs in its own container; fronted by Cloudflare Tunnel at forms.ruisilvastudio.com.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { sendMail } from "./mail.ts";
import { contactAutoreply, contactNotification, newsletterConfirmation } from "./templates.ts";

const DB_URL = Deno.env.get("DATABASE_URL") ?? "";
const STUDIO_EMAIL = Deno.env.get("STUDIO_EMAIL") ?? "rui.silva@ruisilvastudio.com";
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ??
  "https://www.ruisilvastudio.com,https://ruisilvastudio.com,http://localhost:5176,http://localhost:4321"
).split(",");

const db = new Client(DB_URL);

function corsHeaders(origin: string | null, extra: Record<string, string> = {}) {
  const o = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": o,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
    ...extra,
  };
}

function json(origin: string | null, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders(origin, { "Content-Type": "application/json" }),
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function handle(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders(origin) });
  if (req.method === "GET" && url.pathname === "/health") return json(origin, { ok: true });
  if (req.method !== "POST") return json(origin, { error: "Method not allowed" }, 405);

  let data: Record<string, string>;
  try {
    data = await req.json();
  } catch {
    return json(origin, { error: "Invalid JSON" }, 400);
  }

  // Honeypot — bots fill it, humans don't.
  if (data.company) return json(origin, { ok: true });

  const meta = {
    ip: req.headers.get("x-forwarded-for") ?? "",
    ua: req.headers.get("user-agent") ?? "",
    page: data.page ?? "",
  };

  if (url.pathname === "/api/contact") {
    const name = (data.name ?? "").trim();
    const email = (data.email ?? "").trim();
    const subject = (data.subject ?? "General enquiry").trim();
    const message = (data.message ?? "").trim();
    if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 10) {
      return json(origin, { error: "Validation failed" }, 422);
    }
    await db.queryObject(
      "insert into public.contacts (name, email, subject, message, meta) values ($1,$2,$3,$4,$5)",
      [name, email, subject, message, JSON.stringify(meta)]
    );
    // Fire-and-forget emails; failures shouldn't fail the request
    (async () => {
      try {
        sendMail({ to: email, subject: "Thank you — message received", html: await contactAutoreply(esc(name), esc(subject)) }).catch(() => {});
        sendMail({ to: STUDIO_EMAIL, subject: `New enquiry — ${subject}`, html: await contactNotification(esc(name), esc(email), esc(subject), esc(message).replace(/\n/g, "<br>")) }).catch(() => {});
      } catch { /* template load failed */ }
    })();
    return json(origin, { ok: true });
  }

  if (url.pathname === "/api/newsletter") {
    const email = (data.email ?? "").trim();
    if (!EMAIL_RE.test(email)) return json(origin, { error: "Validation failed" }, 422);

    // Listmonk owns subscribers. Forward to its public subscription API.
    const LISTMONK_URL = Deno.env.get("LISTMONK_URL") ?? "http://studio-listmonk:9000";
    const LIST_UUID = Deno.env.get("LISTMONK_LIST_UUID") ?? "";
    try {
      const res = await fetch(`${LISTMONK_URL}/api/public/subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: "", list_uuids: [LIST_UUID], status: "enabled" }),
      });
      if (!res.ok) {
        console.error("listmonk subscribe failed", res.status);
        return json(origin, { error: "Subscription failed" }, 502);
      }
    } catch (e) {
      console.error("listmonk unreachable", e);
      return json(origin, { error: "Subscription failed" }, 502);
    }
    // Listmonk sends the double opt-in confirmation email itself.
    return json(origin, { ok: true });
  }

  return json(origin, { error: "Not found" }, 404);
}

await db.connect();
console.log("studio-api: connected to DB, listening on :3700");
serve(handle, { port: 3700 });
