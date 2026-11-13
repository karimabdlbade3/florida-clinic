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

export const site = {
  brand: {
    en: 'Florida Dental Clinics',
    ar: 'عيادات فلوريدا لطب الأسنان',
    shortEn: 'Florida Dental',
    shortAr: 'فلوريدا',
  },
  foundedYear: 2020,

  contact: {
    /** Main WhatsApp Business number. Env var overrides this value. */
    whatsapp: toIntlEgypt(env.PUBLIC_WHATSAPP_NUMBER) ?? toIntlEgypt(null /* or put the number here, e.g. '01XXXXXXXXX' */),
    /** Main hotline, Egyptian format as it should be displayed, e.g. "0100 000 0000". */
    phone: null as string | null,
    email: null as string | null,
  },

  social: {
    facebook: null as string | null,
    instagram: null as string | null,
    tiktok: null as string | null,
    /** Google Business Profile review link (used for "Leave a review"). */
    googleReviews: null as string | null,
  },

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
