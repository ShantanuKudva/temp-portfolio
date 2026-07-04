import puppeteer from 'puppeteer-core';

// Usage: node scripts/verify-scene.mjs [p] [outPath] [url]
const P = process.argv[2] ?? '';
const OUT = process.argv[3] ?? `/tmp/varsheni-scene-${P || '0'}.png`;
const BASE = process.argv[4] ?? 'http://localhost:3000';
const URL = P === '' ? BASE : `${BASE}/?p=${P}`;
const CHROME = process.env.CHROME_PATH
  ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 760 });
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE-ERR: ' + m.text()); });
page.on('requestfailed', (r) =>
  errors.push('REQFAIL: ' + r.url().slice(0, 80) + ' :: ' + (r.failure()?.errorText)));
await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 }).catch((e) => errors.push('GOTO: ' + e.message));
await new Promise((r) => setTimeout(r, 4000));
const info = await page.evaluate(() => {
  const c = document.querySelector('canvas');
  return c ? { canvas: true, w: c.width, h: c.height } : { canvas: false };
});
await page.screenshot({ path: OUT });
console.log('URL:', URL);
console.log('ERRORS:', errors.length ? '\n' + errors.join('\n') : '(none)');
console.log('CANVAS:', JSON.stringify(info));
console.log('SHOT:', OUT);
await browser.close();
if (errors.length || !info.canvas) process.exit(1);
