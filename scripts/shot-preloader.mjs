// One-off: throttle the network so the heavy GLBs stream slowly, then screenshot
// the preloader mid-progress. Run against the prod server on :3000.
import puppeteer from "puppeteer-core";
const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 760 });
const client = await page.target().createCDPSession();
await client.send("Network.enable");
await client.send("Network.emulateNetworkConditions", {
  offline: false,
  downloadThroughput: (1.5 * 1024 * 1024) / 8, // ~1.5 Mbps
  uploadThroughput: (1 * 1024 * 1024) / 8,
  latency: 40,
});
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await new Promise((r) => setTimeout(r, 1200));
await page.screenshot({ path: process.argv[2] ?? "scratch-preloader.png" });
await browser.close();
console.log("shot:", process.argv[2] ?? "scratch-preloader.png");
