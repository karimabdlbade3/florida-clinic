/**
 * Before & after cases.
 *
 * RULES
 * - Real cases treated at Florida Dental Clinics only. Never stock photos.
 * - `consent: true` only when the patient's written consent to publish is on
 *   file (keep the consent record outside this repository). Cases with
 *   `consent: false` are never rendered.
 * - Do not write durations, outcomes or categories that are not verified.
 *   Leave optional fields out instead of guessing.
 *
 * HOW TO ADD A CASE
 * 1. Save two photos of the same framing and size in src/assets/cases/
 *    as case-NN-before.jpg and case-NN-after.jpg (no patient faces or names).
 * 2. Import both below and add an entry to `allCases`.
 * 3. Optional: category (a service slug, 'veneers' or 'other'), description,
 *    duration. Then run `npm run build`.
 * The home page section, the /cases/ page and the navigation link appear
 * automatically while at least one consented case exists.
 */
import type { ImageMetadata } from 'astro';
import type { Lang } from './branches';
import { services } from './services';

import c01b from '../assets/cases/case-01-before.jpg';
import c01a from '../assets/cases/case-01-after.jpg';
import c02b from '../assets/cases/case-02-before.jpg';
import c02a from '../assets/cases/case-02-after.jpg';
import c03b from '../assets/cases/case-03-before.jpg';
import c03a from '../assets/cases/case-03-after.jpg';
import c04b from '../assets/cases/case-04-before.jpg';
import c04a from '../assets/cases/case-04-after.jpg';
import c05b from '../assets/cases/case-05-before.jpg';
import c05a from '../assets/cases/case-05-after.jpg';

type L = Record<Lang, string>;

export interface Case {
  id: string;
  before: ImageMetadata;
  after: ImageMetadata;
  /** Written patient consent to publish is on file. */
  consent: boolean;
  /** Service slug from data/services.ts, or 'veneers' / 'other'. Only when verified. */
  category?: string;
  description?: L;
  /** Treatment duration, only when verified, e.g. { ar: '8 أشهر', en: '8 months' }. */
  duration?: L;
}

const allCases: Case[] = [
  // Consent confirmed by clinic management. Categories intentionally left out until confirmed.
  { id: 'case-01', before: c01b, after: c01a, consent: true },
  { id: 'case-02', before: c02b, after: c02a, consent: true },
  { id: 'case-03', before: c03b, after: c03a, consent: true },
  { id: 'case-04', before: c04b, after: c04a, consent: true },
  { id: 'case-05', before: c05b, after: c05a, consent: true },
];

/** Only consented cases are ever shown. */
export const cases = allCases.filter((c) => c.consent === true);

const extraCategories: Record<string, L> = {
  veneers: { ar: 'الفينير', en: 'Veneers' },
  other: { ar: 'علاجات أخرى', en: 'Other treatments' },
};
export function categoryLabel(slug: string | undefined, lang: Lang): string | null {
  if (!slug) return null;
  return services.find((s) => s.slug === slug)?.name[lang] ?? extraCategories[slug]?.[lang] ?? null;
}
/** Categories that actually have cases, in service order. */
export const caseCategories = [...services.map((s) => s.slug), ...Object.keys(extraCategories)].filter((slug) => cases.some((c) => c.category === slug));
