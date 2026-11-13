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
  ok('page count (2 langs x 15)', pages.length === 30, String(pages.length));
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
  for (const f of ['/robots.txt', '/sitemap-index.xml', '/sitemap-0.xml', '/og-image.png', '/favicon.svg', '/site.webmanifest']) {
    ok(`${f} exists`, (await fetch(base + f)).status === 200);
  }
  const sm = await (await fetch(base + '/sitemap-0.xml')).text();
  ok('sitemap has 30 URLs', (sm.match(/<loc>/g) || []).length === 30, String((sm.match(/<loc>/g) || []).length));
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
    ok(`${lang} home: tagline in hero`, (await page.textContent('.hero__tagline'))?.trim() === (lang === 'ar' ? 'عيادات فلوريدا لطب وتقويم الأسنان جنبك في كل مكان' : 'Florida Dental Clinics, by your side wherever you are'));
    ok(`${lang} home: working hours shown`, body.includes(hoursText));
    ok(`${lang} home: all 5 social links in footer`, socials.every((u) => links.includes(u)), JSON.stringify(socials.filter((u) => !links.includes(u))));
    ok(`${lang} home: social links open safely in new tab`, await page.evaluate(() => [...document.querySelectorAll('a[href*="facebook.com"],a[href*="instagram.com"],a[href*="tiktok.com"]')].every((a) => a.target === '_blank' && a.rel.includes('noopener'))));
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
