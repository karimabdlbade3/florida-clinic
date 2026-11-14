/**
 * Doctors / team. INTENTIONALLY EMPTY: add only names, titles and
 * qualifications approved by clinic management. The "Our dental team" section
 * on the About page appears automatically once this list has entries.
 *
 *   import photo from '../assets/photos/doctors/dr-name.jpg';
 *   { name: { ar: '...', en: '...' }, title: { ar: '...', en: '...' }, photo }
 */
import type { ImageMetadata } from 'astro';
import type { Lang } from './branches';

export interface TeamMember {
  name: Record<Lang, string>;
  title: Record<Lang, string>;      // e.g. specialty, exactly as approved
  branches?: string[];              // branch slugs
  photo?: ImageMetadata;
}

export const team: TeamMember[] = [];
