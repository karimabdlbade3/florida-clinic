/**
 * Booking request form behaviour: validation, delivery, analytics events.
 * Personal data is only sent where the visitor chooses (WhatsApp) or to the
 * configured HTTPS endpoint. Nothing is stored in the browser.
 */
import { track } from './track';

type Mode = 'endpoint' | 'whatsapp' | 'none';
interface Config {
  lang: 'ar' | 'en';
  mode: Mode;
  endpoint: string | null;
  targets: Record<string, string | null>;
  labels: { branches: Record<string, string>; services: Record<string, string>; times: Record<string, string>; fields: Record<string, string>; intro: string };
  messages: { errors: Record<string, string>; sending: string; successEndpoint: string; successWhatsapp: string; popupBlocked: string; openWhatsapp: string; errorEndpoint: string; notConfigured: string };
}

const EG_MOBILE = /^(?:\+?20|0020)?0?(1[0125]\d{8})$/;

/** Convert Arabic-Indic / Persian digits to Latin and strip separators. */
export function normalizePhone(raw: string): string {
  const latin = raw.replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 0x0660)).replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 0x06f0));
  return latin.replace(/[\s\-().]/g, '');
}
export function toLocalMobile(raw: string): string | null {
  const m = normalizePhone(raw).match(EG_MOBILE);
  return m ? '0' + m[1] : null;
}

function todayISO(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function setStatus(el: HTMLElement, state: 'success' | 'error' | 'info' | '', html: string) {
  el.dataset.state = state || '';
  el.textContent = '';
  if (html) el.append(html);
}

export function initBookingForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-booking-form]').forEach((form) => {
    if (form.dataset.ready) return;
    form.dataset.ready = '1';
    const cfgEl = form.querySelector('[data-booking-config]');
    if (!cfgEl) return;
    let cfg: Config;
    try {
      cfg = JSON.parse(cfgEl.textContent || '{}');
    } catch {
      return;
    }
    const status = form.querySelector<HTMLElement>('[data-form-status]')!;
    const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
    const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]')!;
    const dateInput = form.querySelector<HTMLInputElement>('input[name="date"]');
    if (dateInput) dateInput.min = todayISO();

    // Preselect from query string (?branch=zagazig&service=orthodontics)
    const params = new URLSearchParams(location.search);
    (['branch', 'service'] as const).forEach((k) => {
      const v = params.get(k);
      const sel = form.querySelector<HTMLSelectElement>(`select[name="${k}"]`);
      if (v && sel && [...sel.options].some((o) => o.value === v)) sel.value = v;
    });

    const fieldEl = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;
    const showError = (name: string, msg: string) => {
      const el = fieldEl(name);
      const err = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
      if (el) el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) err.textContent = msg;
    };

    const validate = () => {
      const e = cfg.messages.errors;
      const data = new FormData(form);
      const errors: Record<string, string> = {};
      const name = String(data.get('name') || '').trim();
      if (name.length < 2) errors.name = e.name;
      if (!toLocalMobile(String(data.get('phone') || ''))) errors.phone = e.phone;
      if (!data.get('branch')) errors.branch = e.branch;
      if (!data.get('service')) errors.service = e.service;
      const date = String(data.get('date') || '');
      if (date && date < todayISO()) errors.date = e.date;
      if (!data.get('consent')) errors.consent = e.consent;
      ['name', 'phone', 'branch', 'service', 'date', 'consent'].forEach((k) => showError(k, errors[k] || ''));
      return errors;
    };

    // Re-check a flagged field while the user corrects it (on every keystroke,
    // not on blur): clearing an error on blur shifts the layout under the
    // pointer and can swallow the click on the submit button.
    const recheck = (ev: Event) => {
      const target = ev.target as HTMLInputElement;
      if (target?.name && target.getAttribute('aria-invalid') === 'true') validate();
    };
    form.addEventListener('input', recheck);
    form.addEventListener('change', (ev) => { if ((ev.target as HTMLElement).tagName !== 'INPUT' || (ev.target as HTMLInputElement).type === 'checkbox') recheck(ev); });

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (cfg.mode === 'none') {
        setStatus(status, 'info', cfg.messages.notConfigured);
        return;
      }
      if (String(new FormData(form).get('website') || '')) return; // honeypot: silently drop bots

      const errors = validate();
      const keys = Object.keys(errors);
      if (keys.length) {
        setStatus(status, 'error', cfg.messages.errors.summary);
        fieldEl(keys[0])?.focus();
        return;
      }

      const data = new FormData(form);
      const payload = {
        name: String(data.get('name')).trim().slice(0, 80),
        phone: toLocalMobile(String(data.get('phone')))!,
        branch: String(data.get('branch')),
        service: String(data.get('service')),
        date: String(data.get('date') || ''),
        time: String(data.get('time') || 'any'),
        notes: String(data.get('notes') || '').trim().slice(0, 400),
        lang: cfg.lang,
        source: location.pathname,
      };

      if (cfg.mode === 'endpoint' && cfg.endpoint) {
        const original = submitLabel.textContent;
        submit.disabled = true;
        submitLabel.textContent = cfg.messages.sending;
        try {
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 15000);
          const res = await fetch(cfg.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(payload),
            signal: ctrl.signal,
            credentials: 'omit',
          });
          clearTimeout(timer);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          setStatus(status, 'success', cfg.messages.successEndpoint);
          track('generate_lead', { method: 'form', branch: payload.branch, service: payload.service });
          form.reset();
        } catch {
          setStatus(status, 'error', cfg.messages.errorEndpoint);
          const target = cfg.targets[payload.branch];
          if (target) appendWhatsappFallback(status, buildWaUrl(cfg, target, payload), cfg.messages.openWhatsapp);
        } finally {
          submit.disabled = false;
          submitLabel.textContent = original;
        }
        return;
      }

      // WhatsApp hand-off
      const target = cfg.targets[payload.branch];
      if (!target) {
        setStatus(status, 'info', cfg.messages.notConfigured);
        return;
      }
      const url = buildWaUrl(cfg, target, payload);
      track('generate_lead', { method: 'whatsapp', branch: payload.branch, service: payload.service });
      const win = window.open(url, '_blank', 'noopener');
      setStatus(status, 'success', cfg.messages.successWhatsapp);
      // window.open returns null with noopener in most browsers, so always offer a manual link.
      appendWhatsappFallback(status, url, cfg.messages.openWhatsapp, !win);
    });
  });
}

function buildWaUrl(cfg: Config, target: string, p: Record<string, string>): string {
  const L = cfg.labels;
  const lines = [
    L.intro,
    `${L.fields.name}: ${p.name}`,
    `${L.fields.phone}: ${p.phone}`,
    `${L.fields.branch}: ${L.branches[p.branch] ?? p.branch}`,
    `${L.fields.service}: ${L.services[p.service] ?? p.service}`,
  ];
  if (p.date) lines.push(`${L.fields.date}: ${p.date}`);
  lines.push(`${L.fields.time}: ${L.times[p.time] ?? p.time}`);
  if (p.notes) lines.push(`${L.fields.notes}: ${p.notes}`);
  return `https://wa.me/${encodeURIComponent(target)}?text=${encodeURIComponent(lines.join('\n'))}`;
}

function appendWhatsappFallback(status: HTMLElement, url: string, label: string, _blocked = false) {
  const p = document.createElement('p');
  p.style.margin = '10px 0 0';
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener';
  a.textContent = label;
  a.dataset.track = 'whatsapp_click';
  p.append(a);
  status.append(p);
}
