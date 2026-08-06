// Shared form handling: validation, fetch submission, honeypot, states.
// Used by the contact form and newsletter form. Endpoint is a Supabase edge
// function that writes to Postgres and sends transactional email via Brevo.

type FormState = 'idle' | 'sending' | 'success' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function setState(form: HTMLFormElement, state: FormState, msg = '') {
  form.classList.toggle('is-sending', state === 'sending');
  const status = form.querySelector<HTMLElement>('.form-status');
  if (status) {
    status.textContent = msg;
    status.classList.toggle('is-error', state === 'error');
  }
}

function clearErrors(form: HTMLFormElement) {
  form.querySelectorAll('.field-group.has-error').forEach((g) => g.classList.remove('has-error'));
}

function fieldError(form: HTMLFormElement, name: string, msg: string) {
  const group = form.querySelector(`[name="${name}"]`)?.closest('.field-group');
  if (!group) return;
  group.classList.add('has-error');
  const err = group.querySelector<HTMLElement>('.field-error');
  if (err) err.textContent = msg;
}

function validate(form: HTMLFormElement, fields: Record<string, (v: string) => string | null>): boolean {
  clearErrors(form);
  let ok = true;
  for (const [name, rule] of Object.entries(fields)) {
    const input = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`);
    const val = input?.value.trim() ?? '';
    const err = rule(val);
    if (err) {
      fieldError(form, name, err);
      ok = false;
    }
  }
  return ok;
}

async function submitJSON(endpoint: string, data: Record<string, string>) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json().catch(() => ({}));
}

export function initContactForm(selector: string) {
  const form = document.querySelector<HTMLFormElement>(selector);
  if (!form) return;
  const endpoint = form.dataset.endpoint || '/api/contact';
  const successPanel = form.parentElement?.querySelector<HTMLElement>('.form-success');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot — bots fill it, humans don't. Silently "succeed".
    const honey = form.querySelector<HTMLInputElement>('[name="company"]');
    if (honey && honey.value) {
      form.style.display = 'none';
      successPanel?.classList.remove('hidden');
      return;
    }

    const valid = validate(form, {
      name: (v) => (v.length < 2 ? 'Please tell me your name.' : null),
      email: (v) => (!EMAIL_RE.test(v) ? 'That email doesn\'t look right.' : null),
      message: (v) => (v.length < 10 ? 'A few more words, please — at least 10 characters.' : null),
    });
    if (!valid) {
      setState(form, 'error', 'Please review the highlighted fields.');
      return;
    }

    setState(form, 'sending', '');
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    try {
      await submitJSON(endpoint, { ...data, _type: 'contact' });
      form.style.display = 'none';
      if (successPanel) {
        successPanel.classList.remove('hidden');
        successPanel.focus();
      }
    } catch {
      setState(form, 'error', 'Something went wrong sending your message. Please try again, or email me directly.');
    }
  });
}

export function initNewsletterForm(selector: string) {
  document.querySelectorAll<HTMLFormElement>(selector).forEach((form) => {
    const endpoint = form.dataset.endpoint || '/api/newsletter';
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const honey = form.querySelector<HTMLInputElement>('[name="company"]');
      if (honey && honey.value) {
        setState(form, 'success', 'Thank you — please check your inbox to confirm.');
        form.reset();
        return;
      }
      const valid = validate(form, {
        email: (v) => (!EMAIL_RE.test(v) ? 'That email doesn\'t look right.' : null),
      });
      if (!valid) {
        setState(form, 'error', 'Please check your email address.');
        return;
      }
      setState(form, 'sending', '');
      const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
      try {
        await submitJSON(endpoint, { ...data, _type: 'newsletter' });
        setState(form, 'success', 'Thank you — please check your inbox to confirm your subscription.');
        form.reset();
      } catch {
        setState(form, 'error', 'Could not subscribe right now. Please try again.');
      }
    });
  });
}
