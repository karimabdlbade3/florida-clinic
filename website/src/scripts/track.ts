/**
 * Thin analytics wrapper. Sends to GA4 (gtag) and Meta Pixel (fbq) only if
 * they were loaded (i.e. their IDs are configured). Safe no-op otherwise.
 */
declare global {
  interface Window { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void; dataLayer?: unknown[] }
}

const META_EVENTS: Record<string, string> = {
  generate_lead: 'Lead',
  whatsapp_click: 'Contact',
  call_click: 'Contact',
  book_click: 'Schedule',
};

export function track(event: string, params: Record<string, unknown> = {}) {
  try {
    window.gtag?.('event', event, params);
    const meta = META_EVENTS[event];
    if (meta) window.fbq?.('track', meta, params);
  } catch {
    /* analytics must never break the page */
  }
}

/** Delegated click tracking for any element with data-track="event_name". */
export function initClickTracking() {
  document.addEventListener('click', (e) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]');
    if (!el) return;
    track(el.dataset.track!, { link_url: (el as HTMLAnchorElement).href || undefined, page: location.pathname });
  }, { capture: true });
}
