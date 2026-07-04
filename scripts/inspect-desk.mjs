import puppeteer from 'puppeteer-core';

// Dumps every desk-setup mesh (name · material · world-bbox centre · size) so we
// can identify each of the 54 meshes and colour them per-item. Reads the
// window.__deskMeshes hook set in RoomEnvironment's DeskSetup (TEMP).
const BASE = process.argv[2] ?? 'http://localhost:3000';
const CHROME = process.env.CHROME_PATH
  ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 760 });
await page.goto(`${BASE}/?p=0`, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise((r) => setTimeout(r, 4500));
const meshes = await page.evaluate(() => window.__deskMeshes || []);
await browser.close();

meshes.sort((a, b) => (a.hue ?? 0) - (b.hue ?? 0));
console.log('COUNT', meshes.length);
console.log('axes: x=left(-)/right(+)  y=down(-)/up(+)  z=back(-)/front,camera(+)');
for (const m of meshes) {
  console.log(
    'hue' + String(m.hue ?? '').padStart(4),
    m.name.padEnd(11),
    'c' + JSON.stringify(m.c).padEnd(22),
    's' + JSON.stringify(m.s),
  );
}
