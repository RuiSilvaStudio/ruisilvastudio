// Minimal SMTP send via Brevo relay (Deno). Reads creds from env.
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

let client: SMTPClient | null = null;

function getClient(): SMTPClient {
  if (client) return client;
  client = new SMTPClient({
    connection: {
      hostname: Deno.env.get("SMTP_HOST") ?? "smtp-relay.brevo.com",
      port: Number(Deno.env.get("SMTP_PORT") ?? "465"),
      tls: true, // implicit TLS on 465
      auth: {
        username: Deno.env.get("SMTP_USER") ?? "",
        password: Deno.env.get("SMTP_PASS") ?? "",
      },
    },
  });
  return client;
}

const FROM = `${Deno.env.get("MAIL_FROM_NAME") ?? "Rui Silva Studio"} <${Deno.env.get("MAIL_FROM") ?? "rui.silva@ruisilvastudio.com"}>`;

export async function sendMail(opts: { to: string; subject: string; html: string }) {
  const c = getClient();
  await c.send({
    from: FROM,
    to: opts.to,
    subject: opts.subject,
    content: "auto",
    html: opts.html,
  });
}
