// Extract embedded textures from a .glb (binary glTF): parse the JSON + BIN chunks,
// pull each image out of its bufferView, write it to an output dir. Also prints the
// meshes/materials for context. Run: node scripts/extract-glb-tex.mjs <in.glb> <outDir>
import { readFileSync, writeFileSync } from "node:fs";

const IN = process.argv[2];
const OUT = process.argv[3] ?? ".";
const buf = readFileSync(IN);

const magic = buf.readUInt32LE(0);
if (magic !== 0x46546c67) throw new Error("not a GLB (bad magic)");
const total = buf.readUInt32LE(8);

let json = null;
let bin = null;
let off = 12;
while (off < total) {
  const clen = buf.readUInt32LE(off);
  const ctype = buf.readUInt32LE(off + 4);
  const data = buf.subarray(off + 8, off + 8 + clen);
  if (ctype === 0x4e4f534a) json = JSON.parse(data.toString("utf8"));
  else if (ctype === 0x004e4942) bin = data;
  off += 8 + clen;
}
if (!json) throw new Error("no JSON chunk");

console.log("meshes:", (json.meshes || []).map((m) => m.name).join(", "));
console.log(
  "materials:",
  (json.materials || []).map((m) => m.name).join(", "),
);
const bvs = json.bufferViews || [];
const imgs = json.images || [];
console.log("images:", imgs.length);
imgs.forEach((img, i) => {
  const ext = img.mimeType === "image/png" ? "png" : "jpg";
  if (img.bufferView !== undefined && bin) {
    const bv = bvs[img.bufferView];
    const start = bv.byteOffset || 0;
    const bytes = bin.subarray(start, start + bv.byteLength);
    const file = `${OUT}/glbtex_${i}.${ext}`;
    writeFileSync(file, bytes);
    console.log(
      `  [${i}] ${img.mimeType} ${(bytes.length / 1024) | 0}KB name=${img.name || "?"} -> ${file}`,
    );
  } else if (img.uri) {
    console.log(`  [${i}] uri ${img.uri.slice(0, 50)}`);
  }
});
// which texture each material's baseColor points at
(json.materials || []).forEach((m) => {
  const idx = m.pbrMetallicRoughness?.baseColorTexture?.index;
  const tex = idx !== undefined ? json.textures?.[idx] : undefined;
  console.log(`  mat "${m.name}" baseColor -> image ${tex?.source}`);
});
