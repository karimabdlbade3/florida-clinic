/**
 * Branch data. Every field marked `null` is UNKNOWN and shows as a placeholder.
 * Fill in real values only (from the clinic), never estimates.
 *
 * hours: list of lines per language, e.g. { ar: ['السبت - الخميس: 12 ظهرًا - 10 مساءً'], en: [...] }
 * mapEmbedUrl: the "Embed a map" iframe src from Google Maps (Share > Embed a map).
 * mapLink: the normal Google Maps share link for the branch pin.
 */

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
  hours: L<string[]> | null;
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
    address: null,
    landmark: null,
    phone: null,
    whatsapp: null,
    hours: null,
    mapEmbedUrl: null,
    mapLink: null,
    intro: {
      ar: 'الفرع الرئيسي لعيادات فلوريدا، ومنه بدأت رحلتنا عام 2020. يقدم الفرع خدمات طب الأسنان بتخصصاتها المختلفة في مكان واحد، مع فريق يهتم بتفاصيل راحتك من أول زيارة.',
      en: 'Our main branch, where Florida Dental Clinics began in 2020. It brings our dental specialties together under one roof, with a team that pays attention to your comfort from the very first visit.',
    },
    seo: {
      title: { ar: 'عيادة أسنان في الإبراهيمية | عيادات فلوريدا - الفرع الرئيسي', en: 'Dental Clinic in Ibrahimia | Florida Dental Clinics - Main Branch' },
      description: {
        ar: 'فرع الإبراهيمية الرئيسي لعيادات فلوريدا لطب الأسنان: تقويم، تجميل، زراعة، جراحة الفم، وأسنان الأطفال. اطلب موعدك أو تواصل معنا عبر واتساب.',
        en: 'Florida Dental Clinics main branch in Ibrahimia: orthodontics, cosmetic dentistry, implants, oral surgery and pediatric dentistry. Request an appointment or message us on WhatsApp.',
      },
    },
  },
  {
    slug: 'zagazig',
    isMain: false,
    name: { ar: 'فرع الزقازيق', en: 'Zagazig Branch' },
    locality: { ar: 'الزقازيق', en: 'Zagazig' },
    region: { ar: 'الشرقية', en: 'Sharqia' },
    address: null,
    landmark: null,
    phone: null,
    whatsapp: null,
    hours: null,
    mapEmbedUrl: null,
    mapLink: null,
    intro: {
      ar: 'فرع الزقازيق يقدم نفس معايير الرعاية التي تعرفها عن فلوريدا، لنكون أقرب إليك ولأسرتك داخل الزقازيق.',
      en: 'Our Zagazig branch offers the same standard of care Florida is known for, bringing us closer to you and your family in Zagazig.',
    },
    seo: {
      title: { ar: 'عيادة أسنان في الزقازيق | عيادات فلوريدا لطب الأسنان', en: 'Dental Clinic in Zagazig | Florida Dental Clinics' },
      description: {
        ar: 'فرع الزقازيق من عيادات فلوريدا لطب الأسنان: علاج وتجميل وتقويم وزراعة الأسنان وأسنان الأطفال. احجز طلب موعد أو تواصل عبر واتساب.',
        en: 'Florida Dental Clinics in Zagazig: general, cosmetic and pediatric dentistry, orthodontics and implants. Send an appointment request or contact us on WhatsApp.',
      },
    },
  },
  {
    slug: 'kafr-negm',
    isMain: false,
    name: { ar: 'فرع كفورنجم', en: 'Kafr Negm Branch' },
    locality: { ar: 'كفورنجم', en: 'Kafr Negm' },
    region: { ar: 'الشرقية', en: 'Sharqia' },
    address: null,
    landmark: null,
    phone: null,
    whatsapp: null,
    hours: null,
    mapEmbedUrl: null,
    mapLink: null,
    intro: {
      ar: 'فرع كفورنجم يوفر لأهالي كفورنجم والمناطق المجاورة رعاية أسنان متكاملة قريبة منهم، دون الحاجة إلى السفر لمسافات طويلة.',
      en: 'Our Kafr Negm branch brings complete dental care close to home for Kafr Negm and nearby villages, so there is no need to travel far.',
    },
    seo: {
      title: { ar: 'عيادة أسنان في كفورنجم | عيادات فلوريدا لطب الأسنان', en: 'Dental Clinic in Kafr Negm | Florida Dental Clinics' },
      description: {
        ar: 'فرع كفورنجم من عيادات فلوريدا لطب الأسنان: رعاية أسنان متكاملة للكبار والأطفال بالقرب منك. اطلب موعدك أو تواصل معنا عبر واتساب.',
        en: 'Florida Dental Clinics in Kafr Negm: complete dental care for adults and children close to home. Request an appointment or contact us on WhatsApp.',
      },
    },
  },
];

export const getBranch = (slug: string) => branches.find((b) => b.slug === slug);
