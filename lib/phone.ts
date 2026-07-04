import type { Keyframe, Tuple3 } from '@/lib/track';
import { BEAT } from '@/lib/timeline';

export const PHONE_HERO_POS: Tuple3 = [0, 0.95, 1.15];

// Uniform scale applied to the raw `phone.glb` model. The asset is the iPhone
// 14 Pro (Sketchfab, meshopt+webp) — authored at ~real-world scale, bbox
// 0.0836 x 0.1709 x 0.0131m (`gltf-transform inspect`). A true-to-life scale
// read as "too small" for a hero landing (a real phone on a real desk is a
// speck from the establishing camera), so we deliberately HERO-size it: 1.4
// gives ~0.117 x 0.239 x 0.018m — a bold, dominant phone that STILL lies flat
// on the desk at establish without clipping the tabletop (unlike the earlier
// ~1m mock that punched straight through it). The CameraRig frames it as the
// subject; this scale sets its heft.
export const PHONE_SCALE = 1.4;

// Desk top surface world Y ≈ 0.1994 (desk bboxMax.y=0.79941 [gltf-transform
// inspect] + desk position.y=-0.6 [RoomEnvironment.tsx]). At PHONE_SCALE=1.4
// lying flat the phone is ~0.0183m thick (half ≈ 0.0092m), so its center must
// sit at ~0.209 for the base to REST ON the surface. The prior 0.199 (tuned
// for the thin 0.1-scale phone) left this thicker hero phone embedded ~10mm —
// it read as lying flush/inlaid INTO the tabletop rather than on it. 0.209
// seats it cleanly on top (well under the phone test's y<0.4 "on desk" gate).
export const PHONE_POS: Keyframe<Tuple3>[] = [
  { at: BEAT.establishStart, value: [0.35, 0.209, 0.55] },             // resting on the desk
  { at: BEAT.liftStart,      value: [0.35, 0.209, 0.55] },
  { at: BEAT.burstStart,     value: PHONE_HERO_POS, ease: 'outCubic' },// lifted hero
  { at: BEAT.returnStart,    value: PHONE_HERO_POS },                  // holds hero
  { at: BEAT.rotateStart,    value: PHONE_HERO_POS },
  { at: BEAT.pushStart,      value: [0, 0.95, 1.2], ease: 'inOutCubic' },
  { at: BEAT.revealStart,    value: [0, 0.95, 1.25] },
];

// establishStart/liftStart rotation: lying flat, screen up (rotation.x=-π/2
// turns the model's native screen-faces-+Z orientation to screen-faces-+Y).
// The brief's original steep "propped, angled" tilt ([-0.35, 0.5, 0]) needs
// ~0.08m of vertical clearance once the phone is realistically scaled —
// mathematically incompatible with resting on the desk under the `<0.2`
// establish-height test (would need establishStart y≈0.28) without gross
// clipping. Lying flat minimizes the required clearance to a few mm (see
// PHONE_POS comment) and is also just how a phone usually sits on a desk.
// It then rotates upright ("squares to camera") as it lifts into hero —
// physically read as the phone tipping up off the desk as it rises.
export const PHONE_ROT: Keyframe<Tuple3>[] = [
  { at: BEAT.establishStart, value: [-Math.PI / 2, 0, 0] },           // flat, screen up
  { at: BEAT.liftStart,      value: [-Math.PI / 2, 0, 0] },
  { at: BEAT.burstStart,     value: [0, 0, 0], ease: 'outCubic' },     // squares to camera
  { at: BEAT.rotateStart,    value: [0, 0, 0] },
  { at: BEAT.pushStart,      value: [0, 0, -Math.PI / 2], ease: 'inOutCubic' }, // landscape
  { at: BEAT.revealStart,    value: [0, 0, -Math.PI / 2] },
];

// Screen "breakout" — content scales slightly past the frame during push (spec §7).
export const SCREEN_BREAKOUT: Keyframe<number>[] = [
  { at: BEAT.pushStart,   value: 1.0 },
  { at: BEAT.revealStart, value: 1.1, ease: 'inOutCubic' },
];
