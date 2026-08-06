// Loads email HTML templates from disk and substitutes {{tokens}}.
const DIR = new URL("./templates/", import.meta.url);

async function load(name: string): Promise<string> {
  return await Deno.readTextFile(new URL(name, DIR));
}

function fill(html: string, vars: Record<string, string>): string {
  return html.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? "");
}

export async function contactAutoreply(name: string, subject: string): Promise<string> {
  return fill(await load("contact-autoreply.html"), { name, subject });
}

export async function contactNotification(name: string, email: string, subject: string, message: string): Promise<string> {
  return fill(await load("contact-notification.html"), { name, email, subject, message });
}

export async function newsletterConfirmation(): Promise<string> {
  const unsub = Deno.env.get("UNSUBSCRIBE_URL") ?? "https://www.ruisilvastudio.com/privacy-policy";
  return fill(await load("newsletter-confirmation.html"), { unsubscribe_url: unsub });
}
