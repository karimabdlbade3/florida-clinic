/**
 * Central business + integration settings.
 *
 * RULE: never put guessed data here. Unknown values stay `null` and the site
 * renders a clearly marked placeholder for them. Run `npm run check:data`
 * to list everything that is still missing.
 */

const env = import.meta.env;

/** Normalise an Egyptian number to international digits (20XXXXXXXXXX) or null. */
export function toIntlEgypt(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = String(raw).replace(/\D/g, '');
  if (/^20(1[0125]\d{8})$/.test(digits)) return digits;
  if (/^0(1[0125]\d{8})$/.test(digits)) return '2' + digits;
  if (/^(1[0125]\d{8})$/.test(digits)) return '20' + digits;
  return null; // landlines or invalid values are not valid WhatsApp targets
}

/** Env value "none" switches WhatsApp off entirely (used by the QA suite). */
const envWa = (env.PUBLIC_WHATSAPP_NUMBER || '').trim();
/** Official booking WhatsApp: https://wa.me/201554368176 */
const OFFICIAL_BOOKING_WHATSAPP = '201554368176';

export const site = {
  brand: {
    en: 'Florida Dental Clinics',
    ar: 'عيادات فلوريدا لطب وتقويم الأسنان',
    shortEn: 'Florida Dental',
    shortAr: 'فلوريدا',
  },
  /** Official tagline (Arabic is the verified original; English is its translation). */
  tagline: {
    ar: 'عيادات فلوريدا لطب وتقويم الأسنان جنبك في كل مكان',
    en: 'Florida Dental Clinics, by your side wherever you are',
    shortAr: 'جنبك في كل مكان',
    shortEn: 'By your side, wherever you are',
  },
  foundedYear: 2020,

  /** Official working hours, identical for all branches. */
  hours: {
    lines: {
      ar: ['السبت إلى الخميس: من 2 ظهرًا حتى 10 مساءً', 'الجمعة: مغلق'],
      en: ['Saturday to Thursday: 2:00 PM to 10:00 PM', 'Friday: Closed'],
    },
    /** Official wording supplied by the clinic. */
    sentence: {
      ar: 'يوميًا من الساعة 2 ظهرًا حتى 10 مساءً، ما عدا الجمعة، بمواعيد حجز مسبقة حرصًا على راحتكم.',
      en: 'Open daily from 2:00 PM to 10:00 PM, except Fridays. Visits are by prior appointment, for your comfort.',
    },
    note: { ar: 'بمواعيد حجز مسبقة', en: 'By prior appointment' },
    /** schema.org openingHoursSpecification */
    schema: { days: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '14:00', closes: '22:00' },
  },

  contact: {
    /** Central booking WhatsApp for all branches. Env var overrides; "none" disables. */
    whatsapp: envWa.toLowerCase() === 'none' ? null : toIntlEgypt(envWa) ?? OFFICIAL_BOOKING_WHATSAPP,
    /** General hotline (not supplied). Branch phones live in data/branches.ts. */
    phone: null as string | null,
    email: null as string | null,
  },

  /** Official social profiles (tracking parameters removed from the shared links). */
  social: [
    { key: 'facebook', label: { ar: 'فيسبوك', en: 'Facebook' }, url: 'https://www.facebook.com/share/1FwUJnTprm/' },
    { key: 'facebook-2', label: { ar: 'فيسبوك (صفحة إضافية)', en: 'Facebook (additional page)' }, url: 'https://www.facebook.com/share/1A7BnaVqwj/' },
    { key: 'instagram', label: { ar: 'انستجرام العيادات', en: 'Instagram (clinics)' }, url: 'https://www.instagram.com/floridadentalclinics' },
    { key: 'instagram-ortho', label: { ar: 'انستجرام تقويم الأسنان', en: 'Instagram (orthodontics)' }, url: 'https://www.instagram.com/dr.mahmoudabdelbadea' },
    { key: 'tiktok', label: { ar: 'تيك توك', en: 'TikTok' }, url: 'https://www.tiktok.com/@floridadentalclinics' },
  ] as { key: string; label: { ar: string; en: string }; url: string }[],
  /** Google Business Profile review link (used for "Leave a review"). Not supplied yet. */
  googleReviews: null as string | null,

  integrations: {
    gaId: (env.PUBLIC_GA_ID || '').trim() || null,
    metaPixelId: (env.PUBLIC_META_PIXEL_ID || '').trim() || null,
    gscVerification: (env.PUBLIC_GSC_VERIFICATION || '').trim() || null,
    bookingEndpoint: (env.PUBLIC_BOOKING_ENDPOINT || '').trim() || null,
  },
} as const;

/** Validate analytics IDs so a typo can never inject markup. */
export const safeGaId = site.integrations.gaId && /^G-[A-Z0-9]{4,20}$/.test(site.integrations.gaId) ? site.integrations.gaId : null;
export const safePixelId = site.integrations.metaPixelId && /^\d{6,20}$/.test(site.integrations.metaPixelId) ? site.integrations.metaPixelId : null;
export const safeBookingEndpoint =
  site.integrations.bookingEndpoint && /^https:\/\/[^\s"'<>]+$/.test(site.integrations.bookingEndpoint)
    ? site.integrations.bookingEndpoint
    : null;
