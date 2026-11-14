# Florida Dental Clinics: Website

Bilingual (Arabic first, English second) marketing and appointment-request website
for Florida Dental Clinics: Kafr Negm, Ibrahimia (main) and Zagazig.

- **Stack:** [Astro 7](https://astro.build) static site, no UI framework, about 2 KB of JavaScript on most pages (about 6 KB on the booking page).
- **Output:** plain HTML/CSS/JS in `dist/`. It runs on any static host, with no server or database.
- **Pages (34):** Home, About, Services + 8 service pages (the seven official categories plus general care), Branches + 3 branch pages, Contact & Booking, Privacy, in Arabic (`/`) and English (`/en/`), plus a 404 page.

## Run locally

Requires Node.js 18.20.8+ (tested on Node 22).

```bash
cd website
npm install
cp .env.example .env      # optional: fill in what you have
npm run dev               # http://localhost:4321
npm run build             # production build into dist/
npm run preview           # serve the production build
npm run check:data        # list business data still missing
npm run test:e2e          # full QA suite (needs Playwright + Chromium)
```

## Where to edit content

| What | File |
|---|---|
| Branch address, phone, WhatsApp, hours, maps | `src/data/branches.ts` |
| Service texts (AR/EN), FAQs, SEO titles | `src/data/services.ts` |
| All interface text, page copy, SEO for main pages | `src/i18n/ui.ts` |
| Brand name, tagline, working hours, booking WhatsApp, social links | `src/config/site.ts` |
| Patient reviews (real, with consent only) | `src/data/testimonials.ts` |
| Service card photos (temporary stock) | `src/assets/stock/` (see README there), registered in `src/data/media.ts` |
| Photos | `src/assets/photos/` folders, registered in `src/data/media.ts` (see README there) |
| Doctors / team | `src/data/team.ts` (section appears once filled) |
| Logo | Official artwork in `src/assets/brand/florida-logo-original.png`. After replacing it run `node scripts/make-brand-assets.mjs` (regenerates header/footer logo, icons, Open Graph image) |
| Colors, fonts, spacing | `src/styles/global.css` (`:root` tokens) |

Verified business data (addresses, branch phones, hours, Google Maps links, social profiles, booking WhatsApp)
is in place. Anything still unknown is kept as `null` and shows as a clearly marked placeholder
("بانتظار التأكيد"). Nothing about doctors or reviews is invented.

Branch phone numbers are used for `tel:` calls only. All WhatsApp buttons and the booking form use the single
official booking WhatsApp unless a branch gets its own `whatsapp` value.

## How booking works (honest by design)

The form sends an appointment **request**, never a confirmed booking. Delivery depends on what is configured:

1. **`PUBLIC_BOOKING_ENDPOINT` set:** the form POSTs JSON to your appointment system:
   `{ name, phone, branch, service, date, time, notes, lang, source }`.
   If the request fails, the visitor sees an error and a WhatsApp fallback.
2. **WhatsApp number set:** the form opens WhatsApp with a ready-made message to the
   selected branch's number (falling back to the main number). Nothing is sent until the visitor taps Send.
3. **Neither set:** the form is disabled with a notice that online requests are not active yet.

The floating WhatsApp button and all WhatsApp/call buttons only appear once a real number exists.
Phone validation accepts Egyptian mobiles (010/011/012/015) in Latin or Arabic-Indic digits, with or without +20.

Links can preselect the form: `/contact/?branch=zagazig&service=orthodontics#booking`.

## Integrations (all optional, off until configured)

Set these as environment variables on the host (or in `.env`), then rebuild:

| Variable | Purpose |
|---|---|
| `SITE_URL` | Final domain, e.g. `https://www.example.com` (canonical URLs, sitemap, Open Graph). **Required before launch.** |
| `PUBLIC_WHATSAPP_NUMBER` | Optional override of the booking WhatsApp set in `src/config/site.ts`. `none` switches WhatsApp off. |
| `PUBLIC_GA_ID` | Google Analytics 4 (`G-XXXXXXX`) |
| `PUBLIC_META_PIXEL_ID` | Meta Pixel ID |
| `PUBLIC_GSC_VERIFICATION` | Google Search Console HTML-tag code |
| `PUBLIC_BOOKING_ENDPOINT` | HTTPS endpoint of an appointment system |

Tracked events (GA4 / Meta): `book_click` (Schedule), `whatsapp_click` (Contact), `call_click` (Contact),
`generate_lead` (Lead) on a successful request.

Under Egypt's Personal Data Protection Law (151/2020), turning on analytics or the Pixel may require a
cookie-consent notice. Have this confirmed legally before enabling them.

## Deploy to a real domain

Any static host works. Two recommended options:

**Cloudflare Pages or Netlify**
1. Push this repo to GitHub and create a new project from it.
2. Root directory `website`, build command `npm run build`, output directory `dist`.
3. Add the environment variables above (at minimum `SITE_URL`).
4. Add your custom domain in the dashboard and point DNS as instructed (CNAME or nameservers).
   HTTPS is issued automatically.
5. Security headers in `public/_headers` are applied automatically.

**Vercel:** same steps (root `website`, framework Astro). Headers come from `vercel.json`.

**Shared hosting / cPanel:** run `npm run build` locally and upload the *contents* of `dist/` to `public_html`.
Configure the headers from `public/_headers` in `.htaccess` and set `404.html` as the error page.

**After going live**
1. Google Search Console: verify the domain, then submit `https://YOUR-DOMAIN/sitemap-index.xml`.
2. Create or claim a **Google Business Profile for each branch** with the same name, address and phone as the site.
   This matters more for local search ("دكتور أسنان في الزقازيق") than anything on the website.
3. Paste each branch's Google Maps embed URL (Share > Embed a map) into `mapEmbedUrl` in `src/data/branches.ts`
   to show the map inside the page. The share links are already in place.
4. If you add a booking endpoint on another domain, add its origin to `connect-src` in `public/_headers` / `vercel.json`.

## Project structure

```
website/
  src/
    config/site.ts        business + integration settings
    data/                 branches, services, testimonials (AR/EN)
    i18n/ui.ts            all UI strings (AR/EN)
    layouts/BaseLayout    <head>: SEO, Open Graph, hreflang, JSON-LD, analytics
    components/           Header, Footer, BookingForm, PhotoSlot, cards, CTA...
    views/                page templates shared by both languages
    pages/                routes: Arabic at root, English under /en/
    scripts/              client JS: nav, reveal, booking, tracking, analytics
  public/                 favicon, OG image, _headers, manifest
  scripts/                check-data, QA suite, brand-asset generator
```

## SEO included

Per-page titles and descriptions targeting each service and town, canonical URLs, `hreflang` (ar-EG / en / x-default),
Open Graph and Twitter cards, `sitemap-index.xml` with language alternates, `robots.txt`, and JSON-LD:
Organization, Dentist per branch (only verified fields), MedicalWebPage, FAQPage and BreadcrumbList.

## Production environment variables

| Variable | Required | Value |
|---|---|---|
| `SITE_URL` | **Yes** | Final domain with https, e.g. `https://www.your-domain.com` |
| `PUBLIC_GSC_VERIFICATION` | No | Google Search Console HTML-tag code |
| `PUBLIC_GA_ID` | No | GA4 ID. Enable only with a cookie/consent decision in place |
| `PUBLIC_META_PIXEL_ID` | No | Meta Pixel ID. Same condition |
| `PUBLIC_BOOKING_ENDPOINT` | No | Only when an appointment system exists |
| `PUBLIC_WHATSAPP_NUMBER` | No | Leave unset: the official booking WhatsApp is built in |

## Launch checklist

**Mandatory before launch**
1. Official production domain, set as `SITE_URL` (canonical URLs, sitemap and social previews depend on it).
2. Management/legal approval of the privacy policy text.
3. Clinical team sign-off on the service page texts.

**Recommended**
- Real clinic photography for the three branches.
- Approved doctor names, titles and photos (`src/data/team.ts`).
- Google Maps embed code per branch (`mapEmbedUrl`), Google Business Profile per branch and its review link.
- Genuine patient testimonials with written consent (`src/data/testimonials.ts`; the section stays hidden until then).
- Confirmation of the English spelling of street/shop names in branch addresses.

**Optional / future**
- Google Analytics, Meta Pixel, Search Console verification.
- Appointment system integration, blog, branch-specific WhatsApp numbers, vector logo file.

## QA status (at handover)

- `npm run test:e2e`: 1017/1017 checks pass: official business data (phones, maps, hours, WhatsApp, social links,
  branch schema) in both languages, all 30 pages, no visible placeholders, no broken images, form validation and
  WhatsApp hand-off with every field preserved, endpoint success/failure, 404, sitemap, and no horizontal overflow
  at 320 / 375 / 390 / 768 / 1024 / 1440 px, the seven service categories in official order, navigation menus,
  and the home page appointment form.
- Lighthouse (mobile): Performance 99-100, Accessibility 100, Best Practices 100, SEO 100 on the five pages tested.
- `npm audit`: 0 vulnerabilities.
