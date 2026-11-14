/**
 * End-to-end QA. Builds three variants and tests them in Chromium:
 *   A) WhatsApp switched off (PUBLIC_WHATSAPP_NUMBER=none): form disabled, no wa.me links
 *   B) WhatsApp configured (float button, validation, WhatsApp hand-off)
 *   C) booking endpoint configured (POST success + failure handling, mocked)
 *   D) the real production configuration: official phones, WhatsApp, maps, hours, social links
 * Plus, on every page: HTTP 200, console errors, one <h1>, title/description,
 * canonical + hreflang, lang/dir, internal links resolve, images have alt.
 *
 * Usage: npm run test:e2e        (needs Playwright + Chromium)
 * The test phone/WhatsApp numbers below are dummies used only inside this test.
 */
import { execSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, extname, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const { chromium, devices } = await import('playwright').catch(() => createRequire(import.meta.url)('playwright'));
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TEST_WA = '01000000000';
const results = [];
const ok = (name, cond, detail = '') => { results.push({ name, pass: !!cond, detail }); if (!cond) console.log('  FAIL', name, detail); };

function build(outDir, env) {
  execSync(`npx astro build --outDir ${outDir}`, { cwd: root, stdio: 'pipe', env: { ...process.env, PUBLIC_WHATSAPP_NUMBER: 'none', PUBLIC_BOOKING_ENDPOINT: '', ...env } });
}
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };
function serve(dir, port) {
  return new Promise((res) => {
    const srv = createServer((req, r) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let f = join(dir, p);
      if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
      if (!existsSync(f)) { r.writeHead(404, { 'content-type': types['.html'] }); return r.end(readFileSync(join(dir, '404.html'))); }
      r.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream' });
      r.end(readFileSync(f));
    }).listen(port, () => res(srv));
  });
}
function pagesOf(dir, base = '') {
  const out = [];
  for (const e of readdirSync(join(dir, base), { withFileTypes: true })) {
    if (e.isDirectory() && e.name !== '_astro') out.push(...pagesOf(dir, join(base, e.name)));
    else if (e.name === 'index.html') out.push('/' + (base ? base.replace(/\\/g, '/') + '/' : ''));
  }
  return out;
}

console.log('Building variants...');
build('qa-output/dist-a', {});
build('qa-output/dist-b', { PUBLIC_WHATSAPP_NUMBER: TEST_WA });
build('qa-output/dist-c', { PUBLIC_WHATSAPP_NUMBER: TEST_WA, PUBLIC_BOOKING_ENDPOINT: 'https://booking.example.test/api/requests' });

const browser = await chromium.launch();

// ---------- A: every page, no data configured ----------
{
  const dir = join(root, 'qa-output/dist-a');
  const srv = await serve(dir, 4401);
  const base = 'http://localhost:4401';
  const pages = pagesOf(dir);
  console.log(`A) ${pages.length} pages, WhatsApp switched off`);
  ok('page count (2 langs x 19)', pages.length === 38, String(pages.length));
  const ctx = await browser.newContext();
  const linkSet = new Set();
  for (const path of pages) {
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(String(e)));
    const res = await page.goto(base + path, { waitUntil: 'networkidle' });
    ok(`${path} status 200`, res.status() === 200, String(res.status()));
    ok(`${path} no console errors`, errors.length === 0, errors.join(' | '));
    const info = await page.evaluate(() => ({
      lang: document.documentElement.lang, dir: document.documentElement.dir,
      h1: document.querySelectorAll('h1').length, title: document.title,
      desc: document.querySelector('meta[name=description]')?.content || '',
      canonical: document.querySelector('link[rel=canonical]')?.href || '',
      hreflang: [...document.querySelectorAll('link[rel=alternate][hreflang]')].map((l) => l.hreflang),
      og: !!document.querySelector('meta[property="og:image"]'),
      ld: [...document.querySelectorAll('script[type="application/ld+json"]')].every((s) => { try { JSON.parse(s.textContent); return true; } catch { return false; } }),
      imgsNoAlt: [...document.querySelectorAll('img:not([alt])')].length,
      links: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
      wa: document.querySelectorAll('a[href*="wa.me"]').length,
      dummy: [...document.querySelectorAll('a[href]')].filter((a) => ['#', '', 'javascript:void(0)'].includes(a.getAttribute('href'))).length,
      formMode: document.querySelector('[data-booking-form]')?.dataset.mode,
      submitDisabled: document.querySelector('[data-submit]')?.disabled,
    }));
    const isEn = path.startsWith('/en/');
    ok(`${path} lang/dir`, isEn ? info.lang === 'en' && info.dir === 'ltr' : info.lang === 'ar' && info.dir === 'rtl', `${info.lang}/${info.dir}`);
    ok(`${path} exactly one h1`, info.h1 === 1, String(info.h1));
    ok(`${path} title length 20-75`, info.title.length >= 20 && info.title.length <= 75, `${info.title.length}: ${info.title}`);
    ok(`${path} description 70-200`, info.desc.length >= 70 && info.desc.length <= 200, String(info.desc.length));
    ok(`${path} canonical`, info.canonical.endsWith(path), info.canonical);
    ok(`${path} hreflang ar/en/x-default`, ['ar-EG', 'en', 'x-default'].every((h) => info.hreflang.includes(h)));
    ok(`${path} og:image`, info.og);
    ok(`${path} JSON-LD valid`, info.ld);
    ok(`${path} images have alt`, info.imgsNoAlt === 0);
    ok(`${path} no wa.me links when unconfigured`, info.wa === 0, String(info.wa));
    ok(`${path} no dummy links`, info.dummy === 0, String(info.dummy));
    if (info.formMode) {
      ok(`${path} form honest when unconfigured`, info.formMode === 'none' && info.submitDisabled === true);
    }
    info.links.forEach((l) => linkSet.add(l));
    await page.close();
  }
  // internal link integrity
  for (const l of linkSet) {
    if (!l.startsWith('/')) continue;
    const u = new URL(l, base);
    const r = await fetch(base + u.pathname);
    ok(`link ${u.pathname} resolves`, r.status === 200, String(r.status));
  }
  const nf = await fetch(base + '/does-not-exist/');
  ok('unknown URL returns 404 page', nf.status === 404);
  for (const f of ['/robots.txt', '/sitemap-index.xml', '/sitemap-0.xml', '/og-image.png', '/favicon-32.png', '/apple-touch-icon.png', '/brand/logo-mark.webp', '/brand/logo-wordmark.webp', '/site.webmanifest']) {
    ok(`${f} exists`, (await fetch(base + f)).status === 200);
  }
  const sm = await (await fetch(base + '/sitemap-0.xml')).text();
  ok('sitemap has 38 URLs', (sm.match(/<loc>/g) || []).length === 38, String((sm.match(/<loc>/g) || []).length));
  ok('sitemap excludes 404', !sm.includes('404'));
  // language switch
  const p = await ctx.newPage();
  await p.goto(base + '/services/orthodontics/');
  const sw = await p.getAttribute('.lang-switch', 'href');
  ok('lang switch keeps page', sw === '/en/services/orthodontics/', sw);
  await ctx.close();
  srv.close();
}

// ---------- B: WhatsApp configured ----------
{
  const srv = await serve(join(root, 'qa-output/dist-b'), 4402);
  const base = 'http://localhost:4402';
  console.log('B) WhatsApp configured');
  for (const [dev, label] of [[devices['iPhone 13'], 'mobile'], [{ viewport: { width: 1366, height: 860 } }, 'desktop']]) {
    const ctx = await browser.newContext(dev);
    const page = await ctx.newPage();
    await page.goto(base + '/');
    const fl = await page.getAttribute('.wa-float', 'href');
    ok(`${label}: floating WhatsApp button`, fl?.startsWith('https://wa.me/201000000000?text='), fl);
    ok(`${label}: WhatsApp opens in new tab safely`, (await page.getAttribute('.wa-float', 'rel'))?.includes('noopener'));

    // Mobile nav
    if (label === 'mobile') {
      await page.click('[data-nav-toggle]');
      await page.waitForTimeout(400); // menu fade-in transition
      ok('mobile: menu opens', await page.isVisible('#site-nav a[href="/about/"]'));
      ok('mobile: aria-expanded true', (await page.getAttribute('[data-nav-toggle]', 'aria-expanded')) === 'true');
      await page.keyboard.press('Escape');
      ok('mobile: Escape closes menu', (await page.getAttribute('[data-nav-toggle]', 'aria-expanded')) === 'false');
    }

    // Booking: preselect via query, validation, WhatsApp hand-off
    await page.goto(base + '/contact/?branch=zagazig&service=orthodontics#booking');
    ok(`${label}: branch preselected from URL`, (await page.inputValue('#bk-branch')) === 'zagazig');
    ok(`${label}: service preselected from URL`, (await page.inputValue('#bk-service')) === 'orthodontics');
    await page.evaluate(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return null; }; });
    await page.click('[data-submit]');
    ok(`${label}: empty submit shows errors`, (await page.textContent('#bk-name-err'))?.length > 0 && (await page.getAttribute('#bk-name', 'aria-invalid')) === 'true');
    ok(`${label}: focus moves to first invalid field`, await page.evaluate(() => document.activeElement?.id === 'bk-name'));
    ok(`${label}: nothing sent when invalid`, (await page.evaluate(() => window.__opened.length)) === 0);
    await page.fill('#bk-name', 'Test User');
    await page.fill('#bk-phone', '12345');
    await page.check('#bk-consent');
    await page.click('[data-submit]');
    ok(`${label}: invalid phone rejected`, (await page.textContent('#bk-phone-err'))?.length > 0);
    await page.fill('#bk-phone', '٠١٠٠٠٠٠٠٠٠٠'); // Arabic-Indic digits must be accepted
    await page.click('[data-submit]');
    const opened = await page.evaluate(() => window.__opened);
    const errs = await page.evaluate(() => [...document.querySelectorAll('.error')].filter((e) => e.textContent).map((e) => e.id + ':' + e.textContent));
    ok(`${label}: WhatsApp hand-off opened`, opened.length === 1, JSON.stringify(opened) + JSON.stringify(errs) + (await page.inputValue('#bk-phone')));
    const msg = opened[0] ? decodeURIComponent(opened[0].split('text=')[1]) : '';
    ok(`${label}: message has normalised phone + branch + service`, msg.includes('01000000000') && msg.includes('فرع الزقازيق') && msg.includes('تقويم الأسنان'), msg);
    const st = await page.textContent('[data-form-status]');
    ok(`${label}: status says not confirmed`, st.includes('غير مؤكد'), st);
    // past date rejected
    await page.fill('#bk-date', '2020-01-01');
    await page.click('[data-submit]');
    ok(`${label}: past date rejected`, (await page.textContent('#bk-date-err'))?.length > 0);
    await ctx.close();
  }
  // English form message
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(base + '/en/contact/');
  await page.evaluate(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return null; }; });
  await page.fill('#bk-name', 'Test User');
  await page.fill('#bk-phone', '+20 100 000 0000');
  await page.selectOption('#bk-branch', 'kafr-negm');
  await page.selectOption('#bk-service', 'unsure');
  await page.check('#bk-consent');
  await page.click('[data-submit]');
  const u = (await page.evaluate(() => window.__opened))[0] || '';
  ok('en: WhatsApp message in English', decodeURIComponent(u).includes('Kafr Negm Branch') && decodeURIComponent(u).includes('Not sure'), u);
  // honeypot
  await page.goto(base + '/en/contact/');
  await page.evaluate(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return null; }; document.querySelector('#bk-website').value = 'spam'; });
  await page.fill('#bk-name', 'Bot'); await page.fill('#bk-phone', '01000000000');
  await page.selectOption('#bk-branch', 'ibrahimia'); await page.selectOption('#bk-service', 'unsure'); await page.check('#bk-consent');
  await page.click('[data-submit]');
  ok('honeypot drops bot submissions', (await page.evaluate(() => window.__opened.length)) === 0);
  await ctx.close();
  srv.close();
}

// ---------- C: booking endpoint configured (mocked) ----------
{
  const srv = await serve(join(root, 'qa-output/dist-c'), 4403);
  const base = 'http://localhost:4403';
  console.log('C) booking endpoint configured');
  for (const status of [200, 500]) {
    const ctx = await browser.newContext();
    let body = null;
    await ctx.route('https://booking.example.test/**', async (route) => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type', 'access-control-allow-methods': 'POST' } });
      body = route.request().postDataJSON();
      return route.fulfill({ status, headers: { 'access-control-allow-origin': '*', 'content-type': 'application/json' }, body: '{}' });
    });
    const page = await ctx.newPage();
    await page.goto(base + '/contact/');
    await page.fill('#bk-name', 'Test User'); await page.fill('#bk-phone', '01000000000');
    await page.selectOption('#bk-branch', 'ibrahimia'); await page.selectOption('#bk-service', 'dental-implants'); await page.check('#bk-consent');
    await page.click('[data-submit]');
    await page.waitForFunction(() => document.querySelector('[data-form-status]').dataset.state);
    const state = await page.getAttribute('[data-form-status]', 'data-state');
    if (status === 200) {
      ok('endpoint: success state', state === 'success');
      ok('endpoint: JSON payload correct', body?.phone === '01000000000' && body?.branch === 'ibrahimia' && body?.service === 'dental-implants', JSON.stringify(body));
    } else {
      ok('endpoint: failure shows error', state === 'error');
      ok('endpoint: failure offers WhatsApp fallback', !!(await page.$('[data-form-status] a[href*="wa.me"]')));
    }
    await ctx.close();
  }
  srv.close();
}

// ---------- D: official business data (default production build) ----------
{
  build('qa-output/dist-d', { PUBLIC_WHATSAPP_NUMBER: '' });
  const dir = join(root, 'qa-output/dist-d');
  const srv = await serve(dir, 4404);
  const base = 'http://localhost:4404';
  console.log('D) official business data');
  const WA = 'https://wa.me/201554368176';
  const official = {
    ibrahimia: { phone: '01148770555', map: 'https://maps.app.goo.gl/KSvaNMm32L6x8fGfA', ar: 'شارع حلواني أبو حازم', en: 'Halawani Abu Hazem' },
    zagazig: { phone: '01060229766', map: 'https://maps.app.goo.gl/aPj8CDZfkXg4ccoh9', ar: 'أعلى الطاهر للبصريات', en: 'El-Taher Optics' },
    'kafr-negm': { phone: '01554368176', map: 'https://maps.app.goo.gl/Yc9nDgCHDhaYWL8F8', ar: 'أمام صيدلية دكتور عبدالحميد دسوقي', en: 'Abdelhamid Desouky Pharmacy' },
  };
  const socials = ['https://www.facebook.com/share/1FwUJnTprm/', 'https://www.facebook.com/share/1A7BnaVqwj/', 'https://www.instagram.com/floridadentalclinics', 'https://www.instagram.com/dr.mahmoudabdelbadea', 'https://www.tiktok.com/@floridadentalclinics'];
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  const hrefs = () => page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')));
  const ld = () => page.evaluate(() => [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent)));

  for (const lang of ['ar', 'en']) {
    const pre = lang === 'ar' ? '' : '/en';
    const hoursText = lang === 'ar' ? 'من 2 ظهرًا حتى 10 مساءً' : '2:00 PM to 10:00 PM';
    const closedText = lang === 'ar' ? 'الجمعة: مغلق' : 'Friday: Closed';

    // Home
    await page.goto(base + pre + '/', { waitUntil: 'networkidle' });
    let body = await page.textContent('body');
    let links = await hrefs();
    ok(`${lang} home: floating WhatsApp = official booking link`, (await page.getAttribute('.wa-float', 'href'))?.startsWith(WA + '?text='));
    ok(`${lang} home: hero WhatsApp CTA = official booking link`, (await page.getAttribute('.hero__cta a[href*="wa.me"]', 'href'))?.startsWith(WA));
    ok(`${lang} home: tagline in hero`, (await page.textContent('.hero__tagline'))?.trim() === (lang === 'ar' ? 'عيادات فلوريدا لطب وتقويم الأسنان جنبك في كل مكان' : 'Better Call Florida'));
    ok(`${lang} home: working hours shown`, body.includes(hoursText));
    ok(`${lang} home: footer copyright holder`, (await page.textContent('.site-footer__bottom')).replace(/\s+/g, ' ').includes(`© ${new Date().getFullYear()} Karim AbdeLbadea.`));
    ok(`${lang} home: all 5 social links in footer`, socials.every((u) => links.includes(u)), JSON.stringify(socials.filter((u) => !links.includes(u))));
    ok(`${lang} home: social links open safely in new tab`, await page.evaluate(() => [...document.querySelectorAll('a[href*="facebook.com"],a[href*="instagram.com"],a[href*="tiktok.com"]')].every((a) => a.target === '_blank' && a.rel.includes('noopener'))));
    ok(`${lang} home: additional Facebook link labelled as instructed`, await page.evaluate((l) => [...document.querySelectorAll('.site-footer a[href*="1A7BnaVqwj"]')].some((a) => a.textContent.trim() === l), lang === 'ar' ? 'صفحتنا على فيسبوك – رابط إضافي' : 'Our Facebook page – additional link'));
    ok(`${lang} home: two Instagram accounts labelled differently`, await page.evaluate(() => { const l = [...document.querySelectorAll('.site-footer a[href*="instagram.com"]')].map((a) => a.textContent.trim()); return l.length === 2 && l[0] !== l[1]; }));
    ok(`${lang} home: only the official WhatsApp number is used`, links.filter((l) => l.includes('wa.me')).every((l) => l.startsWith(WA)));
    ok(`${lang} home: no placeholders left for address/phone/hours`, (await page.$$('.branch-card .ph')).length === 0);
    for (const [slug, o] of Object.entries(official)) ok(`${lang} home: ${slug} tel link`, links.includes('tel:+2' + o.phone));
    if (lang === 'ar') ok('ar: Arabic brand name updated', body.includes('عيادات فلوريدا لطب وتقويم الأسنان') && !body.includes('عيادات فلوريدا لطب الأسنان'));

    // Branch pages
    for (const [slug, o] of Object.entries(official)) {
      await page.goto(`${base}${pre}/branches/${slug}/`, { waitUntil: 'networkidle' });
      body = await page.textContent('main');
      links = await hrefs();
      ok(`${lang} ${slug}: official address shown`, body.includes(o[lang]) && body.includes(o.ar), o[lang]);
      ok(`${lang} ${slug}: phone visible and clickable`, body.includes(o.phone) && (await page.$(`main a[href="tel:+2${o.phone}"]`)) !== null);
      ok(`${lang} ${slug}: Google Maps buttons use official link`, (await page.$$(`main a[href="${o.map}"]`)).length >= 2);
      ok(`${lang} ${slug}: hours shown (open + Friday closed)`, body.includes(hoursText) && body.includes(closedText));
      ok(`${lang} ${slug}: booking WhatsApp = official link`, links.filter((l) => l.includes('wa.me')).length > 0 && links.filter((l) => l.includes('wa.me')).every((l) => l.startsWith(WA)));
      ok(`${lang} ${slug}: no placeholders`, (await page.$$('main .ph')).length === 0);
      const dentist = (await ld()).find((x) => x['@type'] === 'Dentist');
      ok(`${lang} ${slug}: schema telephone`, dentist?.telephone === '+2' + o.phone, dentist?.telephone);
      ok(`${lang} ${slug}: schema street address`, dentist?.address?.streetAddress?.includes(o[lang]) && dentist?.address?.addressCountry === 'EG');
      ok(`${lang} ${slug}: schema map`, dentist?.hasMap === o.map);
      const oh = dentist?.openingHoursSpecification?.[0];
      ok(`${lang} ${slug}: schema hours Sat-Thu 14:00-22:00, no Friday`, oh?.opens === '14:00' && oh?.closes === '22:00' && oh?.dayOfWeek?.length === 6 && !oh.dayOfWeek.includes('Friday'));
      const desc = await page.getAttribute('meta[name=description]', 'content');
      ok(`${lang} ${slug}: meta description has phone`, desc.includes(o.phone), desc);
    }

    // Contact page
    await page.goto(base + pre + '/contact/', { waitUntil: 'networkidle' });
    body = await page.textContent('main');
    links = await hrefs();
    ok(`${lang} contact: hours shown`, body.includes(hoursText) && body.includes(closedText));
    ok(`${lang} contact: no placeholders`, (await page.$$('main .ph')).length === 0);
    for (const [slug, o] of Object.entries(official)) {
      ok(`${lang} contact: ${slug} phone + map`, links.includes('tel:+2' + o.phone) && links.includes(o.map));
    }
    ok(`${lang} contact: form sends to official WhatsApp`, await page.evaluate(() => { const c = JSON.parse(document.querySelector('[data-booking-config]').textContent); return c.mode === 'whatsapp' && Object.values(c.targets).every((v) => v === '201554368176'); }));
    const org = (await ld()).find((x) => x['@type'] === 'Organization');
    ok(`${lang} contact: organization sameAs has all social links`, socials.every((u) => org?.sameAs?.includes(u)));
  }
  // Services: the seven official categories, in the official order, plus secondary care
  {
    const MAIN = ['orthodontics', 'dental-implants', 'cosmetic-dentistry', 'dental-fillings', 'root-canal-treatment', 'pediatric-dentistry', 'tooth-extraction'];
    const NAMES = {
      ar: ['تقويم الأسنان', 'زراعة الأسنان', 'تجميل الأسنان', 'حشو الأسنان', 'علاج الجذور', 'طب أسنان الأطفال', 'خلع الأسنان'],
      en: ['Orthodontics', 'Dental Implants', 'Cosmetic Dentistry', 'Dental Fillings', 'Root Canal Treatment', 'Pediatric Dentistry', 'Tooth Extraction'],
    };
    const slugOf = (h) => (h || '').match(/services\/([a-z-]+)\//)?.[1];
    for (const lang of ['ar', 'en']) {
      const pre = lang === 'ar' ? '' : '/en';
      for (const path of ['/', '/services/']) {
        await page.goto(base + pre + path, { waitUntil: 'networkidle' });
        const cards = await page.$$eval('[data-main-services] .svc-card', (els) => els.map((e) => ({ num: e.querySelector('.svc-card__num')?.textContent.trim(), name: e.querySelector('h3').textContent.trim(), href: e.querySelector('a').getAttribute('href'), text: e.querySelector('p').textContent.trim().length })));
        ok(`${lang} ${path}: exactly seven main service cards in official order`, JSON.stringify(cards.map((c) => slugOf(c.href))) === JSON.stringify(MAIN), JSON.stringify(cards.map((c) => c.href)));
        ok(`${lang} ${path}: cards numbered 01-07 with official names`, cards.every((c, i) => c.num === String(i + 1).padStart(2, '0') && c.name === NAMES[lang][i] && c.text > 40), JSON.stringify(cards.map((c) => c.num + ' ' + c.name)));
        await page.evaluate(async () => { for (const i of document.querySelectorAll('.svc-card img')) { i.loading = 'eager'; if (!i.complete) await new Promise((r) => { i.onload = i.onerror = r; }); } });
        ok(`${lang} ${path}: every main card has a loaded photo with empty alt`, await page.$$eval('[data-main-services] .svc-card', (els) => els.every((e) => { const i = e.querySelector('img'); return i && i.naturalWidth > 0 && i.getAttribute('alt') === ''; })));
      }
      ok(`${lang} services: secondary care listed separately`, JSON.stringify(await page.$$eval('[data-secondary-services] .svc-card a', (a) => a.map((x) => x.getAttribute('href').match(/services\/([a-z-]+)\//)[1]))) === '["general-dentistry"]');
      ok(`${lang} nav: services menu lists the seven then secondary`, JSON.stringify((await page.$eval('#site-nav .has-sub', (li) => [...li.querySelectorAll('.sub a')].map((x) => x.getAttribute('href')))).map(slugOf).filter(Boolean)) === JSON.stringify([...MAIN, 'general-dentistry']));
      await page.goto(base + pre + '/contact/');
      ok(`${lang} form: service options = seven + general care + unsure`, JSON.stringify(await page.$$eval('#bk-service option', (o) => o.map((x) => x.value).filter(Boolean))) === JSON.stringify([...MAIN, 'general-dentistry', 'unsure']));
      for (const slug of [...MAIN, 'general-dentistry']) {
        const r = await page.goto(`${base}${pre}/services/${slug}/`);
        ok(`${lang} service page ${slug} loads with booking link`, r.status() === 200 && (await page.$(`a[href*="service=${slug}"]`)) !== null);
      }
    }
    // Orthodontics lists clear aligners alongside the existing metal and aesthetic options
    for (const [pre, words] of [['', ['التقويم الشفاف', 'التقويم المعدني أو التجميلي']], ['/en', ['Clear aligners', 'Metal or aesthetic braces']]]) {
      await page.goto(base + pre + '/services/orthodontics/');
      const ortho = await page.textContent('main');
      const desc = await page.getAttribute('meta[name=description]', 'content');
      ok(`${pre || '/ar'} orthodontics page lists clear aligners and keeps metal/aesthetic braces`, words.every((w) => ortho.includes(w)) && /شفاف|clear aligners/i.test(desc), desc);
      await page.goto(base + pre + '/services/');
      ok(`${pre || '/ar'} orthodontics card mentions clear aligners`, /الشفاف|clear aligners/i.test(await page.textContent('[data-main-services] .svc-card')));
    }
    // Existing content preserved, not deleted
    await page.goto(base + '/services/general-dentistry/');
    let txt = await page.textContent('main');
    ok('secondary care keeps check-ups, scaling, crowns/bridges, dentures', ['الكشف الدوري', 'تنظيف الجير وتلميع الأسنان', 'التيجان والجسور', 'التركيبات المتحركة'].every((x) => txt.includes(x)));
    await page.goto(base + '/services/tooth-extraction/');
    txt = await page.textContent('main');
    ok('tooth extraction keeps surgical, wisdom-tooth and minor oral surgery content', ['الخلع العادي', 'الخلع الجراحي', 'خلع ضرس العقل', 'الإجراءات الجراحية البسيطة في الفم'].every((x) => txt.includes(x)));
    await page.goto(base + '/services/cosmetic-dentistry/');
    txt = await page.textContent('main');
    ok('cosmetic dentistry keeps veneers, whitening and aesthetic crowns', ['الفينير', 'تبييض الأسنان', 'التيجان التجميلية'].every((x) => txt.includes(x)));
    ok('old oral-surgery URL no longer exists', (await fetch(base + '/services/oral-surgery/')).status === 404);
    // Home: booking form + floating call menu
    const mob = await browser.newContext(devices['iPhone 13']);
    const mp = await mob.newPage();
    await mp.goto(base + '/');
    ok('home: sections in planned order', await mp.evaluate(() => { const ids = ['about-title', 'services-title', 'why-title', 'branches-title', 'exp-title', 'booking-title'].map((i) => document.getElementById(i)?.getBoundingClientRect().top); return ids.every((v, i) => v !== undefined && (i === 0 || v > ids[i - 1])); }));
    ok('home: dark sections for services and booking, light page elsewhere', await mp.evaluate(() => { const bg = (s) => getComputedStyle(document.querySelector(s)).backgroundColor; return bg('#services-title') !== undefined && bg('section[aria-labelledby="services-title"]') === 'rgb(20, 18, 14)' && bg('#booking') === 'rgb(20, 18, 14)' && bg('body') === 'rgb(255, 255, 255)'; }));
    await mp.click('[data-call-toggle]');
    ok('mobile: call button opens the three branch numbers as tel links', JSON.stringify(await mp.$$eval('[data-call-menu]:not([hidden]) a', (a) => a.map((x) => x.getAttribute('href')))) === JSON.stringify(['tel:+201554368176', 'tel:+201148770555', 'tel:+201060229766']));
    await mp.keyboard.press('Escape');
    ok('mobile: call menu closes', await mp.$eval('[data-call-menu]', (e) => e.hidden));
    await mp.click('[data-nav-toggle]'); await mp.waitForTimeout(350);
    await mp.locator('#site-nav .has-sub [data-sub-toggle]').first().click();
    ok('mobile: services sub-menu opens inside the menu', await mp.isVisible('#site-nav a[href="/services/root-canal-treatment/"]'));
    await mp.goto(base + '/');
    await mp.evaluate(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return null; }; });
    await mp.fill('#bk-name', 'Test User'); await mp.fill('#bk-phone', '01000000000');
    await mp.selectOption('#bk-branch', 'ibrahimia'); await mp.selectOption('#bk-service', 'root-canal-treatment'); await mp.check('#bk-consent');
    await mp.click('[data-submit]');
    const sentHome = (await mp.evaluate(() => window.__opened))[0] || '';
    ok('home: appointment form hands off to official WhatsApp', sentHome.startsWith(WA + '?text=') && decodeURIComponent(sentHome).includes('علاج الجذور') && decodeURIComponent(sentHome).includes('فرع الإبراهيمية'), sentHome.slice(0, 80));
    await mob.close();
  }
  // Before & after gallery and patient reviews
  {
    for (const lang of ['ar', 'en']) {
      const pre = lang === 'ar' ? '' : '/en';
      await page.goto(base + pre + '/cases/', { waitUntil: 'networkidle' });
      const info = await page.evaluate(async () => {
        const figs = [...document.querySelectorAll('[data-cases] [data-case]')];
        for (const i of document.querySelectorAll('[data-ba] img')) { i.loading = 'eager'; if (!i.complete) await new Promise((r) => { i.onload = i.onerror = r; }); }
        return {
          n: figs.length,
          loaded: figs.every((f) => [...f.querySelectorAll('img')].length === 2 && [...f.querySelectorAll('img')].every((i) => i.naturalWidth > 0 && i.alt.length > 5)),
          sameSize: figs.every((f) => { const [a, b] = f.querySelectorAll('img'); return Math.abs(a.naturalWidth / a.naturalHeight - b.naturalWidth / b.naturalHeight) < 0.02; }),
          ratioKept: figs.every((f) => { const box = f.querySelector('[data-ba]').getBoundingClientRect(); const i = f.querySelector('img'); return Math.abs(box.width / box.height - i.naturalWidth / i.naturalHeight) < 0.03; }),
          categories: figs.filter((f) => f.dataset.category).length,
          tags: document.querySelectorAll('[data-cases] .tag').length,
          durations: document.querySelectorAll('.ba-case__meta').length,
          filter: !!document.querySelector('[data-case-filter]'),
          labels: [document.querySelector('.ba__tag--before').textContent, document.querySelector('.ba__tag--after').textContent],
          text: document.querySelector('main').innerText,
        };
      });
      ok(`${lang} cases: five consented cases shown`, info.n === 5, String(info.n));
      ok(`${lang} cases: before and after photos load with alt text`, info.loaded);
      ok(`${lang} cases: before/after pairs share one aspect ratio, displayed undistorted`, info.sameSize && info.ratioKept);
      ok(`${lang} cases: no invented categories, durations or filter`, info.categories === 0 && info.tags === 0 && info.durations === 0 && !info.filter);
      ok(`${lang} cases: before/after labels and consent disclaimer`, JSON.stringify(info.labels) === JSON.stringify(lang === 'ar' ? ['قبل', 'بعد'] : ['Before', 'After']) && info.text.includes(lang === 'ar' ? 'بموافقة المرضى' : 'with patient consent'));
      // slider: keyboard
      const pos = () => page.$eval('[data-ba]', (e) => parseFloat(e.style.getPropertyValue('--pos')));
      await page.focus('[data-ba-range]');
      const p0 = await pos();
      await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight');
      ok(`${lang} cases: slider moves with the keyboard`, (await pos()) === p0 + 2, `${p0} -> ${await pos()}`);
      // slider: mouse drag
      await page.locator('[data-ba]').first().evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
      const box = await page.locator('[data-ba]').first().boundingBox();
      await page.mouse.move(box.x + box.width * 0.5, box.y + box.height / 2); await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, { steps: 5 }); await page.mouse.up();
      const dragged = await pos();
      ok(`${lang} cases: slider drags with the mouse and reveals the image`, dragged > 12 && dragged < 28 && (await page.$eval('.ba__before', (e) => getComputedStyle(e).clipPath)).includes(`${100 - dragged}%`), String(dragged));
      ok(`${lang} nav + footer link to the gallery`, (await page.$(`#site-nav a[href="${pre}/cases/"][aria-current="page"]`)) !== null && (await page.$(`.site-footer a[href="${pre}/cases/"]`)) !== null);
      await page.goto(base + pre + '/', { waitUntil: 'networkidle' });
      ok(`${lang} home: before/after section with link to all cases`, (await page.$$('[data-home-cases] [data-case]')).length === 2 && (await page.$(`section[aria-labelledby="cases-title"] a.btn[href="${pre}/cases/"]`)) !== null);
      // Patient reviews: genuine entries only, first name + initial, verbatim rating
      const homeReviews = await page.$$eval('#reviews-title ~ [data-reviews] .review, section[aria-labelledby="reviews-title"] .review', (els) => els.length);
      ok(`${lang} home: reviews section shows three reviews with link to all`, homeReviews === 3 && (await page.$(`section[aria-labelledby="reviews-title"] a.btn[href="${pre}/reviews/"]`)) !== null, String(homeReviews));
      await page.goto(base + pre + '/reviews/', { waitUntil: 'networkidle' });
      const rv = await page.$$eval('[data-reviews] .review', (els) => els.map((e) => ({
        name: e.querySelector('.review__name').textContent.trim(),
        stars: e.querySelector('.review__stars')?.getAttribute('aria-label') || '',
        gold: (e.querySelector('.review__stars')?.childNodes[0]?.textContent || '').length,
        quoteLang: e.querySelector('blockquote').getAttribute('lang'),
        len: e.querySelector('blockquote').textContent.trim().length,
        meta: e.querySelector('.review__meta').textContent.trim(),
      })));
      ok(`${lang} reviews page: five genuine reviews`, rv.length === 5, String(rv.length));
      ok(`${lang} reviews page: ratings exactly as given (5,5,4,5,5)`, JSON.stringify(rv.map((r) => r.gold)) === '[5,5,4,5,5]', JSON.stringify(rv.map((r) => r.gold)));
      ok(`${lang} reviews page: display names are first name + initial only`, rv.every((r) => /^\S+( \S+)? \S\.$/.test(r.name)), JSON.stringify(rv.map((r) => r.name)));
      ok(`${lang} reviews page: Arabic text kept in Arabic with branch and date`, rv.every((r) => r.quoteLang === 'ar' && r.len > 60 && r.meta.includes('·')));
      ok(`${lang} nav + footer link to reviews`, (await page.$(`#site-nav a[href="${pre}/reviews/"][aria-current="page"]`)) !== null && (await page.$(`.site-footer a[href="${pre}/reviews/"]`)) !== null);
    }
    // touch
    const mob = await browser.newContext(devices['iPhone 13']);
    const mp = await mob.newPage();
    await mp.goto(base + '/cases/', { waitUntil: 'networkidle' });
    const b = await mp.locator('[data-ba]').first().boundingBox();
    await mp.touchscreen.tap(b.x + b.width * 0.8, b.y + b.height / 2);
    const tp = await mp.$eval('[data-ba]', (e) => parseFloat(e.style.getPropertyValue('--pos')));
    ok('mobile: slider responds to touch', tp > 70 && tp < 90, String(tp));
    ok('mobile: slider allows vertical page scrolling', (await mp.$eval('[data-ba-range]', (e) => getComputedStyle(e).touchAction)) === 'pan-y');
    ok('mobile: gallery has no horizontal overflow', await mp.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
    await mob.close();
  }
  // Branch history: chronological order and opening years, in both languages
  {
    const ORDER = ['kafr-negm', 'ibrahimia', 'zagazig'];
    const YEARS = { 'kafr-negm': 2020, ibrahimia: 2022, zagazig: 2024 };
    const slugsIn = (sel) => page.evaluate((q) => [...document.querySelectorAll(q)].map((a) => (a.getAttribute('href') || a.value || '').match(/(kafr-negm|ibrahimia|zagazig)/)?.[1]).filter(Boolean), sel);
    const same = (a) => JSON.stringify(a) === JSON.stringify(ORDER);
    for (const lang of ['ar', 'en']) {
      const pre = lang === 'ar' ? '' : '/en';
      const est = (y) => (lang === 'ar' ? `تأسس عام ${y}` : `Established ${y}`);
      await page.goto(base + pre + '/');
      ok(`${lang} home: branch cards in opening order`, same(await slugsIn('.branch-card a.stretched')));
      ok(`${lang} home: footer branches in opening order`, same(await slugsIn('.site-footer a[href*="/branches/"]')));
      const cards = await page.$$eval('.branch-card', (els) => els.map((e) => e.textContent));
      ORDER.forEach((slug, i) => ok(`${lang} home: ${slug} card shows opening year`, cards[i]?.includes(est(YEARS[slug])), cards[i]?.slice(0, 80)));
      ok(`${lang} home: first-branch label only on Kafr Negm`, cards[0].includes(lang === 'ar' ? 'أول فروعنا' : 'Our first branch') && !cards[1].includes(lang === 'ar' ? 'أول فروعنا' : 'Our first branch'));
      await page.goto(base + pre + '/branches/');
      ok(`${lang} branches page: opening order`, same(await slugsIn('.branch-card a.stretched')));
      await page.goto(base + pre + '/contact/');
      ok(`${lang} contact: branch list in opening order`, same(await slugsIn('.contact__branches h3 a')));
      ok(`${lang} contact: form branch options in opening order`, same(await page.$$eval('#bk-branch option', (o) => o.map((x) => x.value).filter(Boolean))));
      ok(`${lang} contact: call buttons in opening order`, JSON.stringify(await page.$$eval('.channels a[href^="tel:"]', (a) => a.map((x) => x.getAttribute('href')))) === JSON.stringify(ORDER.map((sl) => 'tel:+2' + official[sl].phone)));
      await page.goto(base + pre + '/about/');
      const about = await page.textContent('main');
      ok(`${lang} about: story starts in Kafr Negm 2020, timeline 2020/2022/2024`, about.includes(lang === 'ar' ? 'عام 2020 في كفورنجم' : 'in 2020 in Kafr Negm') && JSON.stringify(await page.$$eval('.timeline__year', (e) => e.map((x) => x.textContent.trim()))) === '["2020","2022","2024"]');
      ok(`${lang} about: no claim that Florida began in Ibrahimia`, !/2020 في الإبراهيمية|2020,? in Ibrahimia/.test(about));
      for (const slug of ORDER) {
        await page.goto(`${base}${pre}/branches/${slug}/`);
        ok(`${lang} ${slug}: opening year on branch page`, (await page.textContent('.page-hero')).includes(est(YEARS[slug])));
        const dentist = (await ld()).find((x) => x['@type'] === 'Dentist');
        ok(`${lang} ${slug}: schema foundingDate`, dentist?.foundingDate === String(YEARS[slug]), dentist?.foundingDate);
      }
    }
  }
  // Click-to-call: every displayed branch number, on every page, is a tel: link to that same number
  {
    const phones = Object.values(official).map((o) => o.phone);
    const mob = await browser.newContext(devices['iPhone 13']);
    const mp = await mob.newPage();
    let shown = 0;
    for (const path of pagesOf(dir)) {
      await mp.goto(base + path, { waitUntil: 'domcontentloaded' });
      const r = await mp.evaluate((nums) => {
        const out = { shown: 0, bad: [] };
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          if (n.parentElement.closest('script,style')) continue;
          for (const num of nums) if (n.textContent.includes(num)) {
            out.shown++;
            const a = n.parentElement.closest('a');
            if (!a || a.getAttribute('href') !== 'tel:+2' + num) out.bad.push(num + ' -> ' + (a ? a.getAttribute('href') : 'not a link'));
          }
        }
        // every tel link must be reachable by a tap (not covered by another element) and never point to WhatsApp
        for (const a of document.querySelectorAll('a[href^="tel:"]')) {
          if (!/^tel:\+201[0125]\d{8}$/.test(a.getAttribute('href'))) out.bad.push('bad href ' + a.getAttribute('href'));
          if (a.target === '_blank') out.bad.push('tel link opens new tab');
          a.scrollIntoView({ block: 'center', behavior: 'instant' });
          const b = a.getBoundingClientRect();
          const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
          if (b.width > 0 && !(hit && (hit === a || a.contains(hit)))) out.bad.push('covered: ' + a.textContent.trim() + ' by ' + (hit ? hit.tagName + '.' + hit.className : 'nothing'));
        }
        return out;
      }, phones);
      shown += r.shown;
      ok(`${path} every displayed phone number is a tappable tel: link`, r.bad.length === 0, JSON.stringify(r.bad));
    }
    ok('phone numbers are displayed across the site', shown >= 38 * 3, String(shown));
    await mob.close();
  }
  // No unfinished placeholders anywhere in the production build, no layout overflow
  for (const path of pagesOf(dir)) {
    await page.goto(base + path, { waitUntil: 'domcontentloaded' });
    const r = await page.evaluate(() => ({
      ph: document.querySelectorAll('.ph').length,
      brackets: /\[[^\]]*(بانتظار|awaiting|TODO|placeholder)[^\]]*\]/i.test(document.body.innerText),
      waiting: /بانتظار التأكيد|awaiting confirmation|lorem ipsum/i.test(document.body.innerText),
      oldSpelling: document.documentElement.outerHTML.includes('كفر نجم'),
      broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length,
      logo: !!document.querySelector('.site-header img[src="/brand/logo-wordmark.webp"]'),
      fakeReviews: document.querySelectorAll('.review').length > 5 || /وحيد محمد|القناوي|السيد مكرم|السيد محمد|احمد عرفات|\b1(54|56|96)\.\d+\.\d+\.\d+/.test(document.documentElement.outerHTML) ? 1 : 0,
    }));
    ok(`${path} no visible placeholders`, r.ph === 0 && !r.brackets && !r.waiting, JSON.stringify(r));
    ok(`${path} Kafr Negm spelled كفورنجم only`, !r.oldSpelling);
    ok(`${path} no broken images, official logo present`, r.broken === 0 && r.logo, JSON.stringify(r));
    ok(`${path} only the genuine reviews, no patient full names or IP addresses`, r.fakeReviews === 0);
  }
  for (const w of [320, 375, 390, 768, 1024, 1440]) {
    const vp = await ctx.newPage();
    await vp.setViewportSize({ width: w, height: 800 });
    for (const path of ['/', '/en/', '/about/', '/services/orthodontics/', '/en/branches/kafr-negm/', '/contact/', '/en/contact/']) {
      await vp.goto(base + path, { waitUntil: 'domcontentloaded' });
      const [sw, cw] = await vp.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
      ok(`no horizontal overflow at ${w}px on ${path}`, sw <= cw, `${sw} > ${cw}`);
    }
    if (w <= 390) ok(`primary CTA visible without scrolling at ${w}px`, await vp.goto(base + '/').then(() => vp.evaluate(() => { const r = document.querySelector('.hero__cta a').getBoundingClientRect(); return r.bottom <= window.innerHeight && r.top >= 0; })));
    await vp.close();
  }
  // Every submitted field reaches WhatsApp intact (Arabic preserved, correct encoding)
  {
    const mob = await browser.newContext(devices['iPhone 13']);
    const mp = await mob.newPage();
    await mp.goto(base + '/contact/');
    await mp.evaluate(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return null; }; });
    await mp.fill('#bk-name', 'منى عبد الله & Co');
    await mp.fill('#bk-phone', '01000000000');
    await mp.selectOption('#bk-branch', 'kafr-negm');
    await mp.selectOption('#bk-service', 'pediatric-dentistry');
    await mp.fill('#bk-date', '2030-01-15');
    await mp.selectOption('#bk-time', 'evening');
    await mp.fill('#bk-notes', 'موعد لطفل #2 + سؤال؟');
    await mp.check('#bk-consent');
    await mp.click('[data-submit]');
    const url = (await mp.evaluate(() => window.__opened))[0] || '';
    const text = new URL(url || 'https://x/?text=').searchParams.get('text') || '';
    ok('mobile: hand-off URL is the official wa.me link', url.startsWith(WA + '?text='), url.slice(0, 60));
    ok('mobile: URL is fully percent-encoded', !/[\s&#+؟\u0600-\u06FF]/.test(url.split('?text=')[1] || ' '));
    for (const part of ['منى عبد الله & Co', '01000000000', 'فرع كفورنجم', 'طب أسنان الأطفال', '2030-01-15', 'مساءً', 'موعد لطفل #2 + سؤال؟']) ok(`mobile: message keeps "${part}"`, text.includes(part), text);
    ok('mobile: message says request, not confirmed', text.includes('طلب موعد وليس حجزًا مؤكدًا'));
    ok('mobile: manual "open WhatsApp" link offered', !!(await mp.$('[data-form-status] a[href^="https://wa.me/201554368176"]')));
    await mob.close();
  }
  // Real hand-off goes to the official number with the chosen branch named
  await page.goto(base + '/contact/?branch=zagazig');
  await page.evaluate(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return null; }; });
  await page.fill('#bk-name', 'Test User'); await page.fill('#bk-phone', '01000000000');
  await page.selectOption('#bk-service', 'orthodontics'); await page.check('#bk-consent');
  await page.click('[data-submit]');
  const sent = (await page.evaluate(() => window.__opened))[0] || '';
  ok('booking request opens official WhatsApp with branch name', sent.startsWith(WA + '?text=') && decodeURIComponent(sent).includes('فرع الزقازيق'), sent);
  ok('official build: no console errors', errors.length === 0, errors.join(' | '));
  await ctx.close();
  srv.close();
}

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) { failed.forEach((f) => console.log(' x', f.name, f.detail)); process.exit(1); }
