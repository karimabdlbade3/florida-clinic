/**
 * Loads GA4 and/or Meta Pixel only when their IDs are configured
 * (passed as data attributes on <html>, validated at build time).
 * Kept as an external module so the CSP needs no 'unsafe-inline' for scripts.
 */
const root = document.documentElement;
const ga = root.dataset.ga;
const pixel = root.dataset.pixel;

function load(src: string) {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

if (ga) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer!.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', ga, { anonymize_ip: true });
  load(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga)}`);
}

if (pixel) {
  type Fbq = ((...a: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue: unknown[]; push?: unknown; loaded?: boolean; version?: string };
  const fbq = function (...args: unknown[]) {
    fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args);
  } as Fbq;
  fbq.queue = [];
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  window.fbq = fbq;
  (window as unknown as { _fbq: Fbq })._fbq = fbq;
  load('https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', pixel);
  fbq('track', 'PageView');
}

export {};
