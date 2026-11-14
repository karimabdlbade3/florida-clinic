/**
 * Patient reviews.
 *
 * INTENTIONALLY EMPTY until real reviews are supplied.
 * RULES
 * - Genuine reviews only, in the patient's own words. Never write or "improve" one.
 * - `consent: true` only when the patient agreed to publication. Reviews with
 *   `consent: false` are never rendered.
 * - `name`: the display name the patient approved (e.g. "منى أ."), or leave it
 *   out to show an anonymous label.
 * - `rating`: only if the patient actually gave one. Never invent it.
 *
 * HOW TO ADD A REVIEW: add an entry to `allTestimonials`, for example
 *   { lang: 'ar', quote: '...', name: 'منى أ.', rating: 5, service: 'orthodontics', date: '2026-10', consent: true },
 * then run `npm run build`. The home page section, the /reviews/ page and the
 * navigation link appear automatically while at least one review exists.
 */
import type { Lang } from './branches';

export interface Testimonial {
  /** Language the review was written in; it is shown on that language's pages. */
  lang: Lang;
  quote: string;
  name?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  /** Service slug from data/services.ts (optional). */
  service?: string;
  /** Branch slug (optional). */
  branch?: string;
  /** YYYY-MM or YYYY-MM-DD (optional). */
  date?: string;
  source?: 'google' | 'facebook' | 'direct';
  consent: boolean;
}

const allTestimonials: Testimonial[] = [];

/** Only consented reviews are ever shown. */
export const testimonials = allTestimonials.filter((t) => t.consent === true);
export const hasTestimonials = (lang: Lang) => testimonials.some((t) => t.lang === lang);
