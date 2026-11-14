/**
 * Patient reviews.
 *
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

const allTestimonials: Testimonial[] = [
  // Source: the clinic's patient feedback system. Text and ratings are verbatim.
  // Display names are first name + family initial only, as approved by clinic management.
  {
    lang: 'ar',
    name: 'غاده و.',
    rating: 5,
    branch: 'kafr-negm',
    date: '2026-10',
    consent: true,
    quote: `في دكاترة شاطرة في شغلها، وفي دكاترة بتجمع بين الشطارة والإنسانية وطيبة ❤️🩺🥹
حضرتك مش مجرد دكتور بتأدي شغلك، حضرتك إنسان محترم بتعاملك وذوقك واهتمامك بتسيب أثر حلو في قلوب الناس. ربنا يبارك في حضرتك، ويجعل كل تعب بتتعبه في ميزان حسناتك، ويرزقك ويكرمك على قد نيتك الطيبة، ويجعل إيدك دايمًا سبب في شفاء كل مريض. كل الشكر والتقدير لحضرتك، وربنا يديم عليك النجاح والتوفيق يا رب ❤️🌹`,
  },
  {
    lang: 'ar',
    name: 'نادين ق.',
    rating: 5,
    branch: 'zagazig',
    date: '2026-10',
    consent: true,
    quote: `عياده اكتر من رائعه والدكاتره هناك قمه في الأخلاق والذوق والاحترام وطريقه تعاملهم وشرحهم وضع الحاله والنتيجه اكتر من رائعه حقيقي كل مره اخرج من العياده مبسوطه من النتيجه من نجاح لنجاح يارب ان شاء الله وشكرا عيادات فلوريدا 🤍🤍🤍`,
  },
  {
    lang: 'ar',
    name: 'محمد م.',
    rating: 4,
    branch: 'ibrahimia',
    date: '2026-06',
    consent: true,
    quote: `لو في جائزة لأخف إيد دكتور أسنان فأنا أرشح دكتور محمود من غير منافس 😂🦷
شكرًا لعيادة فلوريدا على الاحترافية والذوق وخفة إيد الدكاترة أول مرة أطلع من عند دكتور أسنان وأنا بفكر أرجع تاني بمزاجي! 🦷👏
استقبال محترم المكان نضيف جدًا والدكاترة شاطرين وبيشرحوا كل حاجة بهدوء ويخلوك تحس بالراحة بصراحة تجربة ممتازة وأنصح أي حد خايف من دكتور الأسنان يروح هناك... يمكن يكتشف إن خوفه كان من غير سبب. ❤️`,
  },
  {
    lang: 'ar',
    name: 'محمد م.',
    rating: 5,
    branch: 'kafr-negm',
    date: '2026-06',
    consent: true,
    quote: `من احسن العيادات الي اتعملت معاها وأفضل دكتور أسنان الدكتور محمود وأنا مكنتش اتعملت معاه قبل كدا بس بصراحه دكتور محترم جدا وكويس جدا وعياد نضيفه وفريق كويس وتعامل كويس وربنا يبارك فيك يادكتور ومن تجاح لنجاح دايما يارب`,
  },
  {
    lang: 'ar',
    name: 'منه الله ع.',
    rating: 5,
    branch: 'zagazig',
    date: '2026-06',
    consent: true,
    quote: `احلي واحسن واجمل عياده ودكاترة في الزقازيق كلها والله مشاء الله دكتور محمود مفيش زيه بجد كانت رحله تقويم ممتعه دكتور شاطر وباله طويل ❤️❤️
ودكتور عمر كمان مشاء الله عليه ❤️❤️`,
  },
];

/** Only consented reviews are ever shown. */
export const testimonials = allTestimonials.filter((t) => t.consent === true);
export const hasTestimonials = (lang: Lang) => testimonials.some((t) => t.lang === lang);
