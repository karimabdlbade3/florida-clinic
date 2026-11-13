/**
 * Branch data. Every field marked `null` is UNKNOWN and shows as a placeholder.
 * Fill in real values only (from the clinic), never estimates.
 *
 * address: `ar` is the official wording supplied by the clinic; `en` is its translation
 *   (shop and street names are transliterated: confirm spellings with the clinic).
 * phone: branch landline/mobile for calls. Do NOT assume it has WhatsApp.
 * whatsapp: only set if the branch has its own WhatsApp; otherwise the central
 *   booking WhatsApp from config/site.ts is used.
 * hours: all branches share the official hours in config/site.ts.
 * mapEmbedUrl: the "Embed a map" iframe src from Google Maps (Share > Embed a map).
 * mapLink: the normal Google Maps share link for the branch pin.
 */

import { site } from '../config/site';

export type Lang = 'ar' | 'en';
type L<T = string> = Record<Lang, T>;

export interface Branch {
  slug: string;
  isMain: boolean;
  name: L;
  /** Town / city name used for local SEO. */
  locality: L;
  /** Governorate. Please confirm. */
  region: L;
  address: L | null;
  landmark: L | null;
  phone: string | null;
  whatsapp: string | null;
  hours: Readonly<L<readonly string[]>> | null;
  mapEmbedUrl: string | null;
  mapLink: string | null;
  intro: L;
  seo: { title: L; description: L };
}

export const branches: Branch[] = [
  {
    slug: 'ibrahimia',
    isMain: true,
    name: { ar: 'فرع الإبراهيمية', en: 'Ibrahimia Branch' },
    locality: { ar: 'الإبراهيمية', en: 'Ibrahimia' },
    region: { ar: 'الشرقية', en: 'Sharqia' },
    address: {
      ar: 'الإبراهيمية، شارع حلواني أبو حازم، أمام السبيلي للأحذية، فوق محل هيلثي للألبان.',
      en: "Ibrahimia, Halawani Abu Hazem Street, opposite El-Sebaily Shoes, above Healthy Dairy shop.",
    },
    landmark: null,
    phone: '01148770555',
    whatsapp: null,
    hours: site.hours.lines,
    mapEmbedUrl: null,
    mapLink: 'https://maps.app.goo.gl/KSvaNMm32L6x8fGfA',
    intro: {
      ar: 'الفرع الرئيسي لعيادات فلوريدا، ومنه بدأت رحلتنا عام 2020. يقدم الفرع خدمات طب الأسنان بتخصصاتها المختلفة في مكان واحد، مع فريق يهتم بتفاصيل راحتك من أول زيارة.',
      en: 'Our main branch, where Florida Dental Clinics began in 2020. It brings our dental specialties together under one roof, with a team that pays attention to your comfort from the very first visit.',
    },
    seo: {
      title: { ar: 'عيادة أسنان في الإبراهيمية | عيادات فلوريدا - الفرع الرئيسي', en: 'Dental Clinic in Ibrahimia | Florida Dental Clinics - Main Branch' },
      description: {
        ar: 'فرع الإبراهيمية الرئيسي لعيادات فلوريدا لطب وتقويم الأسنان: شارع حلواني أبو حازم، أمام السبيلي للأحذية. من السبت إلى الخميس 2 ظهرًا حتى 10 مساءً. للاتصال: 01148770555.',
        en: "Florida Dental Clinics main branch in Ibrahimia: Halawani Abu Hazem St., opposite El-Sebaily Shoes. Saturday to Thursday, 2 PM to 10 PM. Call 01148770555 or book on WhatsApp.",
      },
    },
  },
  {
    slug: 'zagazig',
    isMain: false,
    name: { ar: 'فرع الزقازيق', en: 'Zagazig Branch' },
    locality: { ar: 'الزقازيق', en: 'Zagazig' },
    region: { ar: 'الشرقية', en: 'Sharqia' },
    address: {
      ar: 'الزقازيق، المحطة، أعلى الطاهر للبصريات، الدور الثامن.',
      en: "Zagazig, El-Mahatta (station area), above El-Taher Optics, 8th floor.",
    },
    landmark: null,
    phone: '01060229766',
    whatsapp: null,
    hours: site.hours.lines,
    mapEmbedUrl: null,
    mapLink: 'https://maps.app.goo.gl/aPj8CDZfkXg4ccoh9',
    intro: {
      ar: 'فرع الزقازيق يقدم نفس معايير الرعاية التي تعرفها عن فلوريدا، لنكون أقرب إليك ولأسرتك داخل الزقازيق.',
      en: 'Our Zagazig branch offers the same standard of care Florida is known for, bringing us closer to you and your family in Zagazig.',
    },
    seo: {
      title: { ar: 'عيادة أسنان في الزقازيق | عيادات فلوريدا لطب وتقويم الأسنان', en: 'Dental Clinic in Zagazig | Florida Dental Clinics' },
      description: {
        ar: 'فرع الزقازيق من عيادات فلوريدا لطب وتقويم الأسنان: المحطة، أعلى الطاهر للبصريات، الدور الثامن. من السبت إلى الخميس 2 ظهرًا حتى 10 مساءً. للاتصال: 01060229766.',
        en: "Florida Dental Clinics in Zagazig: El-Mahatta, above El-Taher Optics, 8th floor. Saturday to Thursday, 2 PM to 10 PM. Call 01060229766 or book on WhatsApp.",
      },
    },
  },
  {
    slug: 'kafr-negm',
    isMain: false,
    name: { ar: 'فرع كفورنجم', en: 'Kafr Negm Branch' },
    locality: { ar: 'كفورنجم', en: 'Kafr Negm' },
    region: { ar: 'الشرقية', en: 'Sharqia' },
    address: {
      ar: 'كفورنجم، بجوار الموقف، أمام صيدلية دكتور عبدالحميد دسوقي، فوق كافيه صافي.',
      en: "Kafr Negm, next to the bus station (El-Mawqaf), opposite Dr. Abdelhamid Desouky Pharmacy, above Safi Café.",
    },
    landmark: null,
    phone: '01554368176',
    whatsapp: null,
    hours: site.hours.lines,
    mapEmbedUrl: null,
    mapLink: 'https://maps.app.goo.gl/Yc9nDgCHDhaYWL8F8',
    intro: {
      ar: 'فرع كفورنجم يوفر لأهالي كفورنجم والمناطق المجاورة رعاية أسنان متكاملة قريبة منهم، دون الحاجة إلى السفر لمسافات طويلة.',
      en: 'Our Kafr Negm branch brings complete dental care close to home for Kafr Negm and nearby villages, so there is no need to travel far.',
    },
    seo: {
      title: { ar: 'عيادة أسنان في كفورنجم | عيادات فلوريدا لطب وتقويم الأسنان', en: 'Dental Clinic in Kafr Negm | Florida Dental Clinics' },
      description: {
        ar: 'فرع كفورنجم من عيادات فلوريدا لطب وتقويم الأسنان: بجوار الموقف، أمام صيدلية دكتور عبدالحميد دسوقي. من السبت إلى الخميس 2 ظهرًا حتى 10 مساءً. للاتصال: 01554368176.',
        en: "Florida Dental Clinics in Kafr Negm: next to the bus station, opposite Dr. Abdelhamid Desouky Pharmacy. Saturday to Thursday, 2 PM to 10 PM. Call 01554368176 or book on WhatsApp.",
      },
    },
  },
];

export const getBranch = (slug: string) => branches.find((b) => b.slug === slug);
