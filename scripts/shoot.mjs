// Reusable portfolio screenshotter. Drives system Chrome (puppeteer-core), loads
// the running dev server, and captures full-viewport PNGs scrolled top→bottom.
// Full-viewport (no clip) at dsf 2 — clip+dsf returns black in this project.
// Usage: node scripts/shoot.mjs <outDir> [steps] [url]
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const outDir = process.argv[2] || './shots';
const steps = Number(process.argv[3] || 14);
const url = process.argv[4] || 'http://localhost:3000';
mkdirSync(outDir, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--window-size=1440,900'],
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
await sleep(2500); // let the preloader clear + first paint settle

const height = await page.evaluate(() => document.body.scrollHeight);
const vh = 900;
for (let i = 0; i < steps; i++) {
  const y = Math.round((i / (steps - 1)) * Math.max(0, height - vh));
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await sleep(650);
  await page.screenshot({ path: `${outDir}/${String(i).padStart(2, '0')}.png` });
}
console.log(`shot ${steps} frames (docHeight=${height}px) → ${outDir}`);
console.log(errors.length ? `PAGE ERRORS:\n${errors.join('\n')}` : 'no page errors');
await browser.close();
