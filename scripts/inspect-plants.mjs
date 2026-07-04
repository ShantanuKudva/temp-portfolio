// Dumps every mesh in plants.glb (name · local-bbox centre · size) in the SAME
// coordinate space DeskPlant's `band` operates on (the loaded scene's own space,
// root at origin). Lets us pick a single pot+foliage unit instead of an x-slice.
// Run: node scripts/inspect-plants.mjs
import { readFileSync } from "node:fs";
import { Box3, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

const path = new URL("../public/assets/plants.glb", import.meta.url);
const buf = readFileSync(path);
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

globalThis.self ??= globalThis;
const loader = new GLTFLoader();
await MeshoptDecoder.ready;
loader.setMeshoptDecoder(MeshoptDecoder);
// We only want geometry — skip all texture image decoding (needs a browser).
loader.register((parser) => {
  parser.loadTextureImage = () => Promise.resolve(null);
  parser.loadTexture = () => Promise.resolve(null);
  return { name: "skip_textures" };
});

const gltf = await new Promise((res, rej) =>
  loader.parse(ab, "", res, rej),
);
const scene = gltf.scene;
scene.updateMatrixWorld(true);

const rows = [];
scene.traverse((m) => {
  if (!m.isMesh) return;
  const b = new Box3().setFromObject(m);
  const c = new Vector3();
  const s = new Vector3();
  b.getCenter(c);
  b.getSize(s);
  rows.push({
    name: m.name,
    cx: +c.x.toFixed(2),
    cy: +c.y.toFixed(2),
    cz: +c.z.toFixed(2),
    sx: +s.x.toFixed(2),
    sy: +s.y.toFixed(2),
    sz: +s.z.toFixed(2),
  });
});

// whole-cluster bounds for reference
const whole = new Box3().setFromObject(scene);
console.log("COUNT", rows.length);
console.log(
  "CLUSTER bbox min",
  whole.min.toArray().map((v) => +v.toFixed(2)),
  "max",
  whole.max.toArray().map((v) => +v.toFixed(2)),
);
console.log("axes: x=left(-)/right(+)  y=down/up  z=back/front");
rows.sort((a, b) => a.cx - b.cx);
for (const r of rows) {
  console.log(
    r.name.padEnd(16),
    "c[" + [r.cx, r.cy, r.cz].join(",") + "]",
    "s[" + [r.sx, r.sy, r.sz].join(",") + "]",
  );
}
