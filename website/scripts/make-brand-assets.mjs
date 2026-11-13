/**
 * Generates /public/og-image.png, icons and logo-mark.png from HTML.
 * Re-run after the official logo is added:  node scripts/make-brand-assets.mjs
 * Requires Playwright + Chromium (npx playwright install chromium).
 */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = await import('playwright').catch(() => createRequire(import.meta.url)('playwright'));
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const font = (p) => `data:font/woff2;base64,${readFileSync(resolve(root, 'node_modules', p)).toString('base64')}`;
const plex = font('@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-500-normal.woff2');
const corm = font('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2');
const tooth = 'M7.5 3.5c-2.5 0-4 2-4 4.6 0 2.2.9 3.7 1.4 5.6.6 2.4.7 7.3 2.6 7.3 1.7 0 1.6-4.6 3-5.6.4-.3.6-.4 1.5-.4s1.1.1 1.5.4c1.4 1 1.3 5.6 3 5.6 1.9 0 2-4.9 2.6-7.3.5-1.9 1.4-3.4 1.4-5.6 0-2.6-1.5-4.6-4-4.6-1.9 0-2.7 1.1-4.5 1.1S9.4 3.5 7.5 3.5z';
const base = `<style>@font-face{font-family:P;src:url(${plex})}@font-face{font-family:C;src:url(${corm})}*{margin:0;box-sizing:border-box}body{width:100%;height:100%}</style>`;

const og = `${base}<div style="width:1200px;height:630px;background:#faf7f2;position:relative;overflow:hidden;font-family:P">
  <div style="position:absolute;right:-140px;top:-180px;width:620px;height:620px;border-radius:50%;border:1.5px solid #e2cc9f"></div>
  <div style="position:absolute;right:-40px;top:-80px;width:620px;height:620px;border-radius:50%;border:1.5px solid #efe3c9"></div>
  <div style="position:absolute;left:80px;top:96px">
    <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="#b8955a" stroke-width="1.1" stroke-linejoin="round"><path d="${tooth}"/></svg>
    <div style="margin-top:36px;font-family:C;font-size:104px;letter-spacing:.2em;color:#1d1a15;line-height:1">FLORIDA</div>
    <div style="margin-top:14px;font-family:C;font-size:34px;letter-spacing:.32em;color:#7f5f2b">DENTAL CLINICS</div>
    <div style="margin-top:44px;font-size:40px;color:#1d1a15;direction:rtl;text-align:left">عيادات فلوريدا لطب الأسنان</div>
    <div style="margin-top:14px;font-size:26px;color:#6b6356;direction:rtl;text-align:left">الإبراهيمية · الزقازيق · كفورنجم</div>
  </div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:14px;background:linear-gradient(90deg,#b8955a,#e2cc9f,#b8955a)"></div>
</div>`;
const mark = (size, pad) => `${base}<div style="width:${size}px;height:${size}px;background:#1d1a15;display:grid;place-items:center;border-radius:${size > 64 ? 0 : size * .22}px">
  <svg width="${size - pad * 2}" height="${size - pad * 2}" viewBox="0 0 24 24" fill="none" stroke="#cdae76" stroke-width="1.1" stroke-linejoin="round"><path d="${tooth}"/></svg></div>`;

const browser = await chromium.launch();
const shots = [
  ['public/og-image.png', og, 1200, 630],
  ['public/apple-touch-icon.png', mark(180, 34), 180, 180],
  ['public/favicon-32.png', mark(32, 4), 32, 32],
  ['public/brand/logo-mark.png', mark(512, 96), 512, 512],
];
for (const [out, html, w, h] of shots) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve(root, out), omitBackground: out.includes('favicon') });
  await page.close();
  console.log('wrote', out);
}
await browser.close();
