// Reliable per-item ID: loads the rainbow scene at a beat, then raycasts through
// labelled screen points (pixels on the 1280×760 canvas) via window.__pick (set in
// RoomEnvironment when DESK_DEBUG) and prints the exact mesh name each point hits.
// Run: node scripts/pick-desk.mjs [p] [url]
import puppeteer from "puppeteer-core";
const P = process.argv[2] ?? "0";
// `pick-desk.mjs grid <p> [url]` vs `pick-desk.mjs <p> [url]`
const BASE =
  (P === "grid" ? process.argv[4] : process.argv[3]) ??
  "http://localhost:3000";
const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const W = 1280,
  H = 760;

// pixel points per beat
const POINTS = {
  "0": {
    stapler: [700, 210],
    macmini_top: [815, 175],
    macmini_body: [790, 215],
    penholder_cup: [890, 285],
    pens: [905, 235],
    scissors: [930, 242],
    boxfile1: [1035, 60],
    boxfile2: [1140, 55],
    boxfile3: [1235, 70],
    rdrawer_blue: [1085, 550],
    rdrawer_magenta: [1090, 615],
    rdrawer_teal: [1080, 690],
    blotter: [55, 235],
    laptop_riser: [475, 175],
    keyboard: [400, 260],
    monitor_back: [560, 55],
    desk_right: [1000, 400],
    desk_left: [400, 360],
    chair: [200, 480],
  },
  "0.15": {
    pegboard_L_yellow: [600, 280],
    pinkboard_L: [490, 340],
    pegboard_R_green: [1060, 350],
    pinkboard_R: [880, 320],
    lamp_dome: [490, 400],
    lamp_arm: [455, 500],
    headphones: [1130, 360],
    tray_blue: [1120, 660],
    tray_teal: [1080, 680],
    shelf_green: [1210, 550],
    shelf_support: [1215, 615],
    stapler: [990, 650],
    vase_green: [175, 300],
  },
};

// grid mode: `node scripts/pick-desk.mjs grid <p>` → an ASCII map of Object numbers
const GRID = P === "grid";
const GP = GRID ? (process.argv[3] ?? "0") : P;
const STEP = 34;
const pts = POINTS[P] ?? {};
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader"],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H });
await page.goto(`${BASE}/?p=${GP}`, {
  waitUntil: "networkidle2",
  timeout: 30000,
});
await new Promise((r) => setTimeout(r, 4500));

if (GRID) {
  const rows = await page.evaluate(
    (W, H, STEP) => {
      const pick = window.__pick;
      const out = [];
      for (let py = 0; py < H; py += STEP) {
        const cells = [];
        for (let px = 0; px < W; px += STEP) {
          const nx = (px / W) * 2 - 1;
          const ny = -((py / H) * 2 - 1);
          const hit = pick ? pick(nx, ny) : null;
          const n = hit?.name?.replace("Object_", "") ?? "..";
          cells.push(String(n).padStart(2, " "));
        }
        out.push(cells.join(" "));
      }
      return out;
    },
    W,
    H,
    STEP,
  );
  await browser.close();
  console.log("GRID p=" + GP + " step=" + STEP + " (cols left→right, rows top→down)");
  rows.forEach((r, i) => console.log(String(i * STEP).padStart(3), r));
} else {
  const out = await page.evaluate(
    (pts, W, H) => {
      const pick = window.__pick;
      const res = {};
      for (const [label, [px, py]] of Object.entries(pts)) {
        const nx = (px / W) * 2 - 1;
        const ny = -((py / H) * 2 - 1);
        res[label] = pick ? pick(nx, ny) : "NO __pick";
      }
      return res;
    },
    pts,
    W,
    H,
  );
  await browser.close();
  console.log("beat p=" + P);
  for (const [label, hit] of Object.entries(out)) {
    console.log(label.padEnd(18), JSON.stringify(hit));
  }
}
