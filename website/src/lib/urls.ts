import type { Lang } from '../data/branches';
import { site, toIntlEgypt } from '../config/site';

/** Route paths are language-neutral; Arabic lives at the root, English under /en. */
export const routes = {
  home: '/',
  about: '/about/',
  services: '/services/',
  service: (slug: string) => `/services/${slug}/`,
  branches: '/branches/',
  branch: (slug: string) => `/branches/${slug}/`,
  contact: '/contact/',
  privacy: '/privacy/',
};

export function localize(path: string, lang: Lang): string {
  if (lang === 'ar') return path;
  return path === '/' ? '/en/' : `/en${path}`;
}

/** Strip a language prefix to get the neutral path of the current page. */
export function neutralPath(pathname: string): string {
  const p = pathname.endsWith('/') ? pathname : pathname + '/';
  if (p === '/en/') return '/';
  return p.startsWith('/en/') ? p.slice(3) : p;
}

/** WhatsApp click-to-chat link, or null when no valid number is configured. */
export function whatsappLink(message?: string, number?: string | null): string | null {
  const n = toIntlEgypt(number ?? null) ?? site.contact.whatsapp;
  if (!n) return null;
  const q = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${n}${q}`;
}

/** tel: link from a displayed Egyptian number, or null. */
export function telLink(display: string | null | undefined): string | null {
  if (!display) return null;
  const d = display.replace(/[^\d+]/g, '');
  if (d.length < 5) return null;
  return `tel:${d.startsWith('0') ? '+2' + d : d}`;
}
