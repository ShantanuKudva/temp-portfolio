import type { Keyframe, Tuple3 } from '@/lib/track';
import { BEAT } from '@/lib/timeline';

// Camera distances are tuned for a REALISTIC phone (PHONE_SCALE=0.1, ~0.158m
// tall) resting on the desk and lifting to PHONE_HERO_POS=[0,0.95,1.15]. To
// read the small phone as "hero" the camera sits close (~0.1–0.2m off it),
// not the several metres a big mock phone would need.
//
// PUSH-THROUGH: the camera pushes IN until the phone screen fills the frame and
// then STOPS — it stays IN FRONT of the phone (front face ~z=1.25) and never
// crosses it. Crossing clips the near plane through the model and reveals the
// phone's internal layers. The "into the content" illusion is the screen
// content's job (ScreenContent breakout + reveal), not the camera crashing
// through geometry.
export const CAM_POS: Keyframe<Tuple3>[] = [
  { at: BEAT.establishStart, value: [2.6, 1.5, 4.2] },                     // 3/4 establishing (wide room shot)
  { at: BEAT.liftStart,      value: [1.5, 1.2, 2.6], ease: 'inOutCubic' }, // easing in + centering
  { at: BEAT.burstStart,     value: [0, 1.05, 1.65], ease: 'inOutCubic' }, // frontal hero, ~0.5m off the phone
  { at: BEAT.holdStart,      value: [0, 1.02, 1.6], ease: 'inOutCubic' },  // gentle creep (eased — no velocity jerk)
  { at: BEAT.returnStart,    value: [0, 1.0, 1.55], ease: 'inOutCubic' },  // map flows back into the phone
  { at: BEAT.rotateStart,    value: [0, 0.97, 1.5], ease: 'inOutCubic' },  // begins pushing in
  { at: BEAT.pushStart,      value: [0, 0.95, 1.46], ease: 'inOutCubic' }, // approaching the screen
  { at: BEAT.revealStart,    value: [0, 0.95, 1.4], ease: 'inCubic' },     // screen fills the frame (~0.15m off)
  { at: BEAT.end,            value: [0, 0.95, 1.38] },                     // STOP — screen covered, camera stays in front of the phone
];

// CAM_LOOK keeps aiming straight at the phone/screen through the whole hero +
// push span (never "past" it), so the screen stays centred as it fills.
export const CAM_LOOK: Keyframe<Tuple3>[] = [
  { at: BEAT.establishStart, value: [0.2, 0.6, 0.2] },                     // desk/phone at rest
  { at: BEAT.burstStart,     value: [0, 0.95, 1.15], ease: 'inOutCubic' }, // phone hero (== PHONE_HERO_POS)
  { at: BEAT.end,            value: [0, 0.95, 1.2] },                      // holds on the screen centre
];
