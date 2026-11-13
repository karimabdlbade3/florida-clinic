/**
 * Generates every logo-derived file from the official logo:
 *   src/assets/brand/florida-logo-original.png   (official artwork, transparent PNG)
 *
 * Outputs (public/brand + icons + Open Graph image). The artwork itself is never
 * redrawn: files are only cropped and resized from the original.
 * Re-run after replacing the original:  node scripts/make-brand-assets.mjs
 * Requires Playwright + Chromium for the Open Graph image only.
 */
import sharp from 'sharp';
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(root, 'src/assets/brand/florida-logo-original.png');
const out = (p) => resolve(root, 'public', p);
mkdirSync(out('brand'), { recursive: true });

// Find the horizontal bands of artwork (mark / FLORIDA / Dental Clinics / tagline).
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const rowHasInk = (y) => { for (let x = 0; x < info.width; x += 3) if (data[(y * info.width + x) * 4 + 3] > 40) return true; return false; };
const bands = []; let start = -1;
for (let y = 0; y < info.height; y++) { const ink = rowHasInk(y); if (ink && start < 0) start = y; if (!ink && start >= 0) { bands.push([start, y - 1]); start = -1; } }
if (bands.length < 3) throw new Error('Unexpected logo layout: expected mark, wordmark and descriptor bands, found ' + bands.length);
const crop = async (from, to) => sharp(await sharp(SRC).extract({ left: 0, top: bands[from][0], width: info.width, height: bands[to][1] - bands[from][0] + 1 }).png().toBuffer()).trim();

const mark = await (await crop(0, 0)).png().toBuffer();           // circular tooth mark
const wordmark = await (await crop(1, 2)).png().toBuffer();       // FLORIDA + Dental Clinics
const full = await sharp(SRC).trim().png().toBuffer();    // complete lockup incl. tagline

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };
const pad = (buf, size, inner, bg) => sharp(buf).resize(inner, inner, { fit: 'contain', background: CLEAR }).extend({ top: (size - inner) / 2, bottom: (size - inner) / 2, left: (size - inner) / 2, right: (size - inner) / 2, background: bg }).flatten(bg.alpha ? { background: bg } : false);

await sharp(mark).resize(192, 192).webp({ quality: 90 }).toFile(out('brand/logo-mark.webp'));
await sharp(mark).resize(512, 512).png().toFile(out('brand/logo-mark.png'));
await sharp(wordmark).resize({ height: 132 }).webp({ quality: 92 }).toFile(out('brand/logo-wordmark.webp'));
await sharp(full).resize({ width: 900 }).png().toFile(out('brand/logo-full.png'));
await sharp(mark).resize(32, 32).png().toFile(out('favicon-32.png'));
await sharp(mark).resize(192, 192).png().toFile(out('favicon-192.png'));
await (await pad(mark, 180, 148, WHITE)).png().toFile(out('apple-touch-icon.png'));
if (existsSync(out('favicon.svg'))) rmSync(out('favicon.svg')); // old temporary icon
const wm = await sharp(wordmark).metadata();
console.log('wordmark aspect', (wm.width / wm.height).toFixed(4));

// ---- Open Graph image (1200x630) ----
const { chromium } = await import('playwright').catch(() => createRequire(import.meta.url)('playwright'));
const b64 = (buf, type = 'image/png') => `data:${type};base64,${buf.toString('base64')}`;
const plex = b64(readFileSync(resolve(root, 'node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-500-normal.woff2')), 'font/woff2');
const logoPng = await sharp(full).resize({ height: 470 }).png().toBuffer();
const html = `<style>@font-face{font-family:P;src:url(${plex})}*{margin:0;box-sizing:border-box}</style>
<div style="width:1200px;height:630px;background:#faf7f2;position:relative;overflow:hidden;font-family:P;display:flex;align-items:center;justify-content:space-between;padding:0 90px">
  <div style="position:absolute;right:-160px;top:-200px;width:640px;height:640px;border-radius:50%;border:1.5px solid #e2cc9f"></div>
  <div style="position:absolute;left:-200px;bottom:-320px;width:640px;height:640px;border-radius:50%;border:1.5px solid #efe3c9"></div>
  <img src="${b64(logoPng)}" style="height:470px;position:relative">
  <div style="direction:rtl;text-align:right;position:relative;max-width:520px">
    <div style="font-size:46px;line-height:1.45;color:#1d1a15">عيادات فلوريدا<br>لطب وتقويم الأسنان</div>
    <div style="margin-top:14px;font-size:34px;color:#7f5f2b">جنبك في كل مكان</div>
    <div style="margin-top:26px;font-size:25px;color:#6b6356">كفورنجم · الإبراهيمية · الزقازيق</div>
  </div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:12px;background:#c59841"></div>
</div>`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out('og-image.png') });
await browser.close();
console.log('brand assets written');
