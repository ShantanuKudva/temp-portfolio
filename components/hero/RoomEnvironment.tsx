"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { Object3D, Box3, CanvasTexture, RepeatWrapping } from "three";
import type {
  SpotLight,
  Mesh,
  MeshStandardMaterial,
  DirectionalLight,
  AmbientLight,
  PointLight,
} from "three";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { getP } from "@/lib/store";
import { BEAT } from "@/lib/timeline";
import { sampleNumber, type Keyframe } from "@/lib/track";

// ORYZO DESK CLOSE-UP. Warm high-angle close-up of the creator's desk — the real
// Sketchfab desk-setup + house plants ARE the environment, the iPhone the hero.

const withMeshopt = (
  loader: Parameters<NonNullable<Parameters<typeof useGLTF>[3]>>[0],
) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
};

// The desk-setup ships 3 auto-named materials, each a baseColor TEXTURE:
//   wire_088144225 = the bulk (desk, drawers, keyboard, mac mini, shelves, chair)
//   wire_204204204 = the monitor screens (flat, untextured light grey)
//   wire_086086086 = the desk lamp (dark)
// The bulk texture read as flat off-white, so we TINT it to a warm wood (multiply)
// — a wooden desk, not white. Screens → dark. Then per-mesh overrides (names from
// the desk-mesh inspector, scripts/inspect-desk.mjs) recolour the tech items.
const DESK_MAT_COLORS: Record<string, string> = {
  wire_088144225: "#CAA987", // bulk → warm wood tint (toned down the orange)
  wire_204204204: "#0B0D12", // monitor screens → off/dark
  wire_086086086: "#CBCBD0", // game controllers → matte light grey (kill the metallic silver)
};
const DESK_MESH_COLORS: Record<string, string> = {
  Object_15: "#33343A",
  Object_16: "#33343A",
  Object_33: "#33343A",
  Object_34: "#33343A", // chair → charcoal
  Object_57: "#26262A", // keyboard → dark
  Object_12: "#4C7A3C",
  Object_13: "#4C7A3C", // dried pampas in the vase → green
  Object_31: "#1B1B1F",
  Object_32: "#1B1B1F", // monitor bodies → near-black
  Object_58: "#6E5334", // pegboard → cork/wood
  Object_17: "#2E2E33",
  Object_28: "#2E2E33",
  Object_50: "#2E2E33", // desk lamp → dark metal
  Object_60: "#AAB0B6", // pen-cup pens/scissors → metal
  Object_26: "#232327", // headphones → black
  Object_39: "#6E4E32", // desk apron/frame → solid wood (was reading dark)
};
const DESK_DEBUG = false; // rainbow-ID pass (scripts/inspect-desk.mjs reads window.__deskMeshes)

// The gaming desk-setup: authored in mm (bbox ~2234×1915×1280) → ×0.001 to
// metres; base at y=0 sits on the room floor at world y=-0.6. Faces +Z.
function DeskSetup() {
  const { scene } = useGLTF(
    "/assets/desk-setup.glb",
    false,
    false,
    withMeshopt,
  );

  // Procedural warm wood-grain for the desk/drawers/shelves ("wooden appearance").
  const woodTex = useMemo(() => {
    if (typeof document === "undefined") return null;
    const cv = document.createElement("canvas");
    cv.width = cv.height = 512;
    const ctx = cv.getContext("2d");
    if (!ctx) return null;
    let s = 99;
    const rnd = () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    };
    const img = ctx.createImageData(512, 512);
    const d = img.data;
    for (let i = 0, p = 0; i < 512 * 512; i++, p += 4) {
      const x = i % 512;
      const grain = Math.sin(x * 0.05 + Math.sin(x * 0.008) * 8) * 0.5 + 0.5; // wider vertical streaks
      const n = rnd() * 0.18;
      d[p] = 92 + grain * 60 - n * 80;
      d[p + 1] = 56 + grain * 40 - n * 62;
      d[p + 2] = 30 + grain * 24 - n * 44;
      d[p + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    const t = new CanvasTexture(cv);
    t.wrapS = t.wrapT = RepeatWrapping;
    t.repeat.set(2, 2);
    return t;
  }, []);

  useEffect(() => {
    const dump: { name: string; hue: number; c: number[]; s: number[] }[] = [];
    let i = 0;
    scene.traverse((o) => {
      const m = o as Mesh;
      if (!m.isMesh) return;
      m.castShadow = true;
      m.receiveShadow = true;
      const std = m.material as MeshStandardMaterial;
      if (DESK_DEBUG) {
        // TEMP: flat rainbow hue per mesh + dump name/pos so items can be identified
        const hue = Math.round((i * 137.508) % 360);
        const c = std.clone();
        c.color.setHSL(hue / 360, 0.72, 0.5);
        c.map = null;
        m.material = c;
        m.updateMatrixWorld(true);
        const b = new Box3().setFromObject(m);
        dump.push({
          name: m.name,
          hue,
          c: [
            (b.min.x + b.max.x) / 2,
            (b.min.y + b.max.y) / 2,
            (b.min.z + b.max.z) / 2,
          ].map((v) => +v.toFixed(2)),
          s: [b.max.x - b.min.x, b.max.y - b.min.y, b.max.z - b.min.z].map(
            (v) => +v.toFixed(2),
          ),
        });
        i++;
        return;
      }
      const meshC = DESK_MESH_COLORS[m.name];
      if (meshC) {
        const cloned = std.clone(); // per-mesh override needs its own material
        cloned.color.set(meshC);
        cloned.map = null; // solid colour, no texture
        m.material = cloned;
      } else if (std.name === "wire_088144225" && woodTex) {
        std.map = woodTex; // wooden desk / drawers / shelves
        std.color.set("#ffffff");
        std.needsUpdate = true;
      } else {
        const matC = DESK_MAT_COLORS[std.name];
        if (matC && std.color) std.color.set(matC);
      }
    });
    if (DESK_DEBUG)
      (window as unknown as { __deskMeshes?: unknown }).__deskMeshes = dump;
  }, [scene, woodTex]);
  return <primitive object={scene} scale={0.001} position={[0, -0.6, 0.3]} />;
}
useGLTF.preload("/assets/desk-setup.glb", false, false, withMeshopt);

// House plants (metre-scale cluster). Cloned per instance so we can place more
// than one (floor cluster + a small pot on the desk).
function Plants({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF("/assets/plants.glb", false, false, withMeshopt);
  const obj = useMemo(() => scene.clone(true), [scene]);
  useEffect(() => {
    obj.traverse((o) => {
      const m = o as Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
  }, [obj]);
  return <primitive object={obj} scale={scale} position={position} />;
}
useGLTF.preload("/assets/plants.glb", false, false, withMeshopt);

// ONE plant lifted out of the cluster by MESH NAME and RECENTERED (base dropped to
// y=0, centred in x/z), then dropped into a procedural planter so it stands cleanly.
// plants.glb is a planter arrangement, NOT discrete pots — most meshes are wide
// soil-beds/troughs (Object_16/10/4/12, up to 2.5m across) and even the upright
// plants ship WITHOUT their own pot (Object_30 = a braided money-tree whose bare
// trunk clipped through the desk). So we keep one plant by name and give it a pot
// we control. See scripts/inspect-plants.mjs.
function PottedPlant({
  position,
  scale = 1,
  keep,
  pot,
}: {
  position: [number, number, number];
  scale?: number;
  keep: string[];
  // pot dims are in the plant's LOCAL (pre-scale) space; h = rim height
  pot?: { h: number; topR: number; botR: number; color?: string };
}) {
  const { scene } = useGLTF("/assets/plants.glb", false, false, withMeshopt);
  const keepKey = keep.join(",");
  const obj = useMemo(() => {
    const c = scene.clone(true);
    c.updateMatrixWorld(true);
    const wanted = new Set(keep);
    const box = new Box3();
    c.traverse((o) => {
      const m = o as Mesh;
      if (!m.isMesh) return;
      m.castShadow = true;
      m.receiveShadow = true;
      m.visible = wanted.has(m.name);
      if (m.visible) box.union(new Box3().setFromObject(m));
    });
    if (!box.isEmpty()) {
      c.position.set(
        -(box.min.x + box.max.x) / 2,
        -box.min.y,
        -(box.min.z + box.max.z) / 2,
      );
    }
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, keepKey]);
  // Seat the foliage so its trunk sinks into the soil rather than floating.
  const seatY = pot ? pot.h - 0.05 : 0;
  return (
    <group position={position} scale={scale}>
      {pot && (
        <group>
          {/* tapered planter */}
          <mesh position={[0, pot.h / 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[pot.topR, pot.botR, pot.h, 28]} />
            <meshStandardMaterial
              color={pot.color ?? "#3B3A36"}
              roughness={0.85}
            />
          </mesh>
          {/* soil cap so you can't see into the pot */}
          <mesh position={[0, pot.h - 0.02, 0]} receiveShadow>
            <cylinderGeometry
              args={[pot.topR * 0.9, pot.topR * 0.9, 0.03, 28]}
            />
            <meshStandardMaterial color="#241A12" roughness={1} />
          </mesh>
        </group>
      )}
      <primitive object={obj} position={[0, seatY, 0]} />
    </group>
  );
}

// Return-beat spotlight: narrows onto the phone as it flows back.
const SPOT_INTENSITY: Keyframe<number>[] = [
  { at: BEAT.holdStart, value: 0 },
  { at: BEAT.returnStart, value: 9, ease: "outCubic" },
  { at: BEAT.rotateStart, value: 3.5, ease: "inQuad" },
];
// Lift/apps stage spotlights: ramp on as the phone lifts, hold through
// burst→constellation, ease off into the return. Bright enough to carry the
// phone once the room dims around it (see ENV_DIM).
const LIFT_SPOT_INTENSITY: Keyframe<number>[] = [
  { at: BEAT.establishStart, value: 0 },
  { at: BEAT.liftStart, value: 0 },
  { at: BEAT.burstStart, value: 15, ease: "outCubic" },
  { at: BEAT.constellPeak, value: 15 },
  { at: BEAT.returnStart, value: 6, ease: "inOutCubic" },
  { at: BEAT.pushStart, value: 0, ease: "inOutCubic" },
];
// SPOTLIGHT EFFECT (user): as the phone lifts to hero, the whole ROOM dims so the
// stage spotlights make the phone pop — "the rest of the things in the bg go a
// little dark and the main one has the light". 1 = full room, dips through
// burst→constellation, eased partway back for the reveal.
const ENV_DIM: Keyframe<number>[] = [
  { at: BEAT.establishStart, value: 1 },
  { at: BEAT.liftStart, value: 1 },
  { at: BEAT.burstStart, value: 0.22, ease: "inOutCubic" },
  { at: BEAT.constellPeak, value: 0.22 },
  { at: BEAT.returnStart, value: 0.3, ease: "inOutCubic" },
  { at: BEAT.revealStart, value: 0.45, ease: "inOutCubic" },
];
const ENV_BASE = { key: 3.0, fill: 0.85, amb: 0.2, lamp: 1.5, hdri: 0.35 }; // fill up + cooler to fight the orange cast

export default function RoomEnvironment() {
  const returnSpot = useRef<SpotLight>(null);
  const liftA = useRef<SpotLight>(null);
  const liftB = useRef<SpotLight>(null);
  const keyRef = useRef<DirectionalLight>(null);
  const fillRef = useRef<DirectionalLight>(null);
  const ambRef = useRef<AmbientLight>(null);
  const lampRef = useRef<PointLight>(null);
  const returnTarget = useMemo(() => new Object3D(), []);
  const liftTarget = useMemo(() => new Object3D(), []);
  const shadowFrames = useRef(0);

  // Subtle plaster grain so the wall isn't a flat CG plane.
  const wallBump = useMemo(() => {
    if (typeof document === "undefined") return null;
    const cv = document.createElement("canvas");
    cv.width = cv.height = 256;
    const ctx = cv.getContext("2d");
    if (!ctx) return null;
    let s = 1234;
    const rnd = () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    };
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 14000; i++) {
      const v = 96 + rnd() * 104;
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(rnd() * 256, rnd() * 256, 1, 1);
    }
    const t = new CanvasTexture(cv);
    t.wrapS = t.wrapT = RepeatWrapping;
    t.repeat.set(3, 2);
    return t;
  }, []);

  useFrame((state) => {
    const p = getP();
    const lift = sampleNumber(LIFT_SPOT_INTENSITY, p);
    const dim = sampleNumber(ENV_DIM, p);
    if (returnSpot.current)
      returnSpot.current.intensity = sampleNumber(SPOT_INTENSITY, p);
    if (liftA.current) liftA.current.intensity = lift;
    if (liftB.current) liftB.current.intensity = lift * 0.6;
    if (keyRef.current) keyRef.current.intensity = ENV_BASE.key * dim;
    if (fillRef.current) fillRef.current.intensity = ENV_BASE.fill * dim;
    if (ambRef.current) ambRef.current.intensity = ENV_BASE.amb * dim;
    if (lampRef.current) lampRef.current.intensity = ENV_BASE.lamp * dim;
    state.scene.environmentIntensity = ENV_BASE.hdri * dim; // dims the HDRI fill too
    // Perf (lossless): the desk is static, so CACHE its 2048 shadow map instead of
    // re-rasterising ~1M verts every frame. Suspense means frame 1 already has the
    // loaded desk in the map; update for a short warm-up, then freeze auto-update.
    if (keyRef.current && shadowFrames.current < 60) {
      shadowFrames.current += 1;
      if (shadowFrames.current === 60) keyRef.current.shadow.autoUpdate = false;
    }
  });

  return (
    <group>
      {/* Low HDRI for soft realistic fill + reflections (not the whole light). */}
      <Environment
        files="/assets/hdri/room.hdr"
        background={false}
        environmentIntensity={ENV_BASE.hdri}
      />

      {/* Warm modeling key (soft daylight) — gives the desk shape + warmth. */}
      <ambientLight ref={ambRef} intensity={ENV_BASE.amb} color="#FFF3E8" />
      <directionalLight
        ref={keyRef}
        castShadow
        position={[-3, 3.6, 2.4]}
        intensity={ENV_BASE.key}
        color="#FFEAD2"
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00018}
        shadow-camera-near={0.1}
        shadow-camera-far={12}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      {/* Cool soft fill from the opposite side to open the shadows. */}
      <directionalLight
        ref={fillRef}
        position={[3, 2.2, 0.5]}
        intensity={ENV_BASE.fill}
        color="#CFE0FF"
      />
      {/* Cozy desk-lamp glow pooling warm light on the phone/desk. */}
      <pointLight
        ref={lampRef}
        position={[0.02, 0.42, 0.12]}
        intensity={ENV_BASE.lamp}
        distance={1.8}
        decay={2}
        color="#FFC98A"
      />

      {/* Window blinds hung between the sun and the desk — the sun rakes through
          them and throws warm striped light-rays (REAL shadows) across the back
          wall + pegboard. Tilted to face the sun so the gaps read. */}
      <group position={[-1.1, 2.4, 1.5]} rotation={[0.62, 0.34, 0]}>
        {Array.from({ length: 11 }, (_, i) => (
          <mesh key={i} position={[0, 1.3 - i * 0.26, 0]} castShadow>
            <boxGeometry args={[3.6, 0.15, 0.02]} />
            <meshStandardMaterial color="#241812" roughness={1} />
          </mesh>
        ))}
      </group>

      {/* Stage spotlights that carry the phone as the room dims. */}
      <primitive object={returnTarget} position={[0, 0.95, 1.15]} />
      <spotLight
        ref={returnSpot}
        position={[0, 3.5, 1.6]}
        angle={0.5}
        penumbra={0.9}
        decay={1}
        color="#FFF0DC"
        target={returnTarget}
      />
      <primitive object={liftTarget} position={[0, 1.15, 1.15]} />
      <spotLight
        ref={liftA}
        position={[-2.4, 3.2, 2.2]}
        angle={0.6}
        penumbra={0.8}
        decay={1}
        color="#FFD9A0"
        target={liftTarget}
      />
      <spotLight
        ref={liftB}
        position={[2.4, 3.2, 0.4]}
        angle={0.6}
        penumbra={0.8}
        decay={1}
        color="#CBD5E1"
        target={liftTarget}
      />

      {/* Warm coloured back wall the desk sits against + a floor. Both receive the
          sun's shadows — the lamp casts onto the wall, the blinds cast the rays. */}
      <mesh position={[0.1, 1.3, -0.3]} receiveShadow>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial
          color="#4E332F"
          roughness={0.95}
          bumpMap={wallBump ?? undefined}
          bumpScale={2.5}
        />
      </mesh>
      {/* back wall — deep warm clay, closer so it catches the desk's shadow */}
      <mesh
        position={[0.1, -0.6, 0.4]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 7]} />
        <meshStandardMaterial color="#2A1D18" roughness={1} />
      </mesh>
      {/* floor */}

      <DeskSetup />
      <Plants position={[-1.9, -0.6, -0.4]} />
      {/* Braided money tree — a FLOOR plant, in a planter, standing beside the desk
          (back-right corner) so its foliage rises above the desk like a real setup. */}
      <PottedPlant
        position={[1.55, -0.6, -0.15]}
        scale={2.0}
        keep={["Object_30"]}
        pot={{ h: 0.16, topR: 0.15, botR: 0.12, color: "#2E2A26" }}
      />
    </group>
  );
}
