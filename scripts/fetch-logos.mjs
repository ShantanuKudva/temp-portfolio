// Downloads real brand logos (favicons) for the reviewed-apps marquee into
// public/assets/logos/<slug>.png. Google's favicon service returns the actual
// brand mark as PNG for any domain, no API key. Re-run to refresh.
import { mkdirSync, writeFileSync } from 'node:fs';
import { APP_LOGOS } from '../lib/appLogos.ts';

const OUT = new URL('../public/assets/logos/', import.meta.url);
mkdirSync(OUT, { recursive: true });

let ok = 0, fail = 0;
for (const l of APP_LOGOS) {
  const url = `https://www.google.com/s2/favicons?domain=${l.domain}&sz=128`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(new URL(`${l.slug}.png`, OUT), buf);
    console.log(`✓ ${l.slug.padEnd(14)} ${l.domain.padEnd(20)} ${buf.length}b`);
    ok++;
  } catch (e) {
    console.log(`✗ ${l.slug.padEnd(14)} ${l.domain.padEnd(20)} ${e.message}`);
    fail++;
  }
}
console.log(`\n${ok} ok, ${fail} failed`);
