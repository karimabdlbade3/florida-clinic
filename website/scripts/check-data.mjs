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
  for (const f of ['address', 'phone', 'whatsapp', 'hours', 'mapEmbedUrl', 'mapLink']) {
    if (new RegExp(`\\n    ${f}: null,`).test(block)) missing.push(`Branch "${slug}": ${f}`);
  }
}
// Site contact / social
const site = read('src/config/site.ts');
if (!env.PUBLIC_WHATSAPP_NUMBER && /toIntlEgypt\(null/.test(site)) missing.push('Main WhatsApp number (PUBLIC_WHATSAPP_NUMBER or site.ts)');
for (const f of ['phone', 'email', 'facebook', 'instagram', 'tiktok', 'googleReviews']) if (new RegExp(`\\b${f}: null`).test(site)) missing.push(`site.ts: ${f}`);
if (!env.SITE_URL && !process.env.SITE_URL) missing.push('SITE_URL (final domain)');
for (const k of ['PUBLIC_GA_ID', 'PUBLIC_META_PIXEL_ID', 'PUBLIC_GSC_VERIFICATION']) if (!env[k] && !process.env[k]) missing.push(`${k} (optional)`);
// Content
if (/testimonials: Testimonial\[\] = \[\];/.test(read('src/data/testimonials.ts'))) missing.push('Testimonials (real, with written consent)');
const photos = existsSync(resolve(root, 'src/assets/photos')) ? readdirSync(resolve(root, 'src/assets/photos')).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f)) : [];
if (!photos.length) missing.push('Real clinic photography (src/assets/photos)');
missing.push('Official logo files (currently a temporary wordmark)');
missing.push('Doctors: names, titles, qualifications (About page "team" placeholder)');
missing.push('Privacy policy: data retention period + legal review');

console.log(missing.length ? `Missing data (${missing.length}):\n- ` + missing.join('\n- ') : 'All business data present.');
process.exit(missing.some((m) => !m.includes('optional')) ? 1 : 0);
