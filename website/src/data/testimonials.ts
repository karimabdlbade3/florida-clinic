/**
 * Patient testimonials.
 *
 * INTENTIONALLY EMPTY. Only add real reviews from real patients who gave
 * written consent to publish them (keep the consent record outside this repo).
 * Do not add medical details or full names without permission; first name +
 * initial is enough. When this list is empty the site shows an honest
 * "reviews coming soon / leave a review" block instead of fake quotes.
 */
import type { Lang } from './branches';

export interface Testimonial {
  lang: Lang;            // language the patient wrote in
  quote: string;
  author: string;        // e.g. "Mona A."
  branch?: string;       // branch slug
  service?: string;      // service slug
  source?: 'google' | 'facebook' | 'direct';
  rating?: 1 | 2 | 3 | 4 | 5;
}

export const testimonials: Testimonial[] = [];
