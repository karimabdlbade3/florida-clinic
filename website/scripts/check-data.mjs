/**
 * Lists every piece of business data still missing (placeholders).
 * Run before launch: npm run check:data   (exit code 1 if anything is missing)
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(resolve(root, p), 'utf8');
const env = Object.fromEntries((existsSync(resolve(root, '.env')) ? read('.env') : '').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*([^#\s]*)/)).filter(Boolean).map((m) => [m[1], m[2]]));
const missing = [];

// Branch data
const branches = read('src/data/branches.ts');
for (const block of branches.split(/\n  \{\n    slug: /).slice(1)) {
  const slug = block.match(/^'([^']+)'/)[1];
  for (const f of ['address', 'phone', 'hours', 'mapLink']) {
    if (new RegExp(`\\n    ${f}: null,`).test(block)) missing.push(`Branch "${slug}": ${f}`);
  }
  if (/\n    mapEmbedUrl: null,/.test(block)) missing.push(`Branch "${slug}": mapEmbedUrl (Google Maps > Share > Embed a map; the page shows an "Open in Google Maps" button until then)`);
  if (/\n    whatsapp: null,/.test(block)) missing.push(`Branch "${slug}": own WhatsApp number (optional: central booking WhatsApp is used)`);
}
// Site contact / social
const site = read('src/config/site.ts');
if (!/OFFICIAL_BOOKING_WHATSAPP = '20\d{10}'/.test(site) && !env.PUBLIC_WHATSAPP_NUMBER) missing.push('Booking WhatsApp number');
if (/\bphone: null/.test(site)) missing.push('General hotline number (optional: branch phones are shown)');
if (/\bemail: null/.test(site)) missing.push('Official email address (optional)');
if (/googleReviews: null/.test(site)) missing.push('Google Business Profile review link (for the "Share your experience" button)');
if (!env.SITE_URL && !process.env.SITE_URL) missing.push('SITE_URL (final domain)');
for (const k of ['PUBLIC_GA_ID', 'PUBLIC_META_PIXEL_ID', 'PUBLIC_GSC_VERIFICATION']) if (!env[k] && !process.env[k]) missing.push(`${k} (optional)`);
missing.push('Confirm English transliteration of street/shop names in branch addresses');
// Content
if (/testimonials: Testimonial\[\] = \[\];/.test(read('src/data/testimonials.ts'))) missing.push('Testimonials (real, with written consent)');
const photos = existsSync(resolve(root, 'src/assets/photos')) ? readdirSync(resolve(root, 'src/assets/photos'), { recursive: true }).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(String(f))) : [];
if (!photos.length) missing.push('Real clinic photography (src/assets/photos)');
if (!existsSync(resolve(root, 'src/assets/brand/florida-logo-original.png'))) missing.push('Official logo file');
missing.push('Vector logo (SVG/AI) from the designer (optional: sharper at very large sizes)');
if (/team: TeamMember\[\] = \[\];/.test(read('src/data/team.ts'))) missing.push('Doctors: approved names, titles, photos (src/data/team.ts; section stays hidden until then)');
missing.push('Privacy policy: management/legal approval (retention period, rights wording)');

console.log(missing.length ? `Missing data (${missing.length}):\n- ` + missing.join('\n- ') : 'All business data present.');
process.exit(missing.some((m) => !m.includes('optional')) ? 1 : 0);
