/**
 * Photo slots. Every slot is `null` until a REAL clinic photo is supplied;
 * a neutral designed placeholder is shown meanwhile (never a broken image).
 *
 * To add a photo:
 *   1. Put the file in the matching folder under src/assets/photos/
 *   2. Import it here and assign it to its slot, for example:
 *        import hero from '../assets/photos/home/hero.jpg';
 *        export const media = { hero, ... }
 * Astro then generates optimised AVIF/WebP in several sizes automatically.
 * Only use real photos of the clinics and staff, with consent for any person shown.
 */
import type { ImageMetadata } from 'astro';
type Slot = ImageMetadata | null;

export const media: {
  hero: Slot;                         // home hero (portrait 4:5)
  homeAbout: Slot;                    // home "about" block (5:4)
  aboutStory: Slot;                   // about page story (portrait 4:5)
  aboutCare: Slot;                    // about page patient-experience block (5:4)
  services: Record<string, Slot>;     // one per service slug (4:3)
  branches: Record<string, Slot>;     // one per branch slug (4:3): exterior or reception
} = {
  hero: null,
  homeAbout: null,
  aboutStory: null,
  aboutCare: null,
  services: {
    orthodontics: null,
    'cosmetic-dentistry': null,
    'dental-implants': null,
    'oral-surgery': null,
    'pediatric-dentistry': null,
    'general-dentistry': null,
  },
  branches: { ibrahimia: null, zagazig: null, 'kafr-negm': null },
};
