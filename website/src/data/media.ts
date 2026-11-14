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
import stockOrtho from '../assets/stock/orthodontics.jpg';
import stockImplants from '../assets/stock/dental-implants.jpg';
import stockCosmetic from '../assets/stock/cosmetic-dentistry.jpg';
import stockFillings from '../assets/stock/dental-fillings.jpg';
import stockRoot from '../assets/stock/root-canal-treatment.jpg';
import stockPediatric from '../assets/stock/pediatric-dentistry.jpg';
import stockExtraction from '../assets/stock/tooth-extraction.jpg';
import stockGeneral from '../assets/stock/general-dentistry.jpg';
type Slot = ImageMetadata | null;

export const media: {
  hero: Slot;                         // home hero (portrait 4:5)
  homeAbout: Slot;                    // home "about" block (5:4)
  aboutStory: Slot;                   // about page story (portrait 4:5)
  aboutCare: Slot;                    // about page patient-experience block (5:4)
  services: Record<string, Slot>;     // one per service slug (4:3)
  branches: Record<string, Slot>;     // one per branch slug (4:3): exterior or reception
  /** Gallery photos (real, approved). The gallery section appears once this has entries. */
  gallery: { src: ImageMetadata; alt: { ar: string; en: string } }[];
} = {
  hero: null,
  homeAbout: null,
  aboutStory: null,
  aboutCare: null,
  services: {
    // TEMPORARY stock photos (see src/assets/stock/README.md). Replace with real clinic photos.
    orthodontics: stockOrtho,
    'dental-implants': stockImplants,
    'cosmetic-dentistry': stockCosmetic,
    'dental-fillings': stockFillings,
    'root-canal-treatment': stockRoot,
    'pediatric-dentistry': stockPediatric,
    'tooth-extraction': stockExtraction,
    'general-dentistry': stockGeneral,
  },

  branches: { ibrahimia: null, zagazig: null, 'kafr-negm': null },
  gallery: [],
};
