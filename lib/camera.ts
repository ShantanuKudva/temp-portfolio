import type { Keyframe, Tuple3 } from '@/lib/track';
import { BEAT } from '@/lib/timeline';

// Camera distances are tuned for the iPhone 14 Pro at PHONE_SCALE=1.4
// (~0.239m tall) resting on the desk and lifting to PHONE_HERO_POS=
// [0,0.95,1.15]. Establish is a medium 3/4 shot that frames the phone on the
// desk (room as backdrop, NOT a far wide-room shot); the camera then closes
// in as the phone lifts so it reads as a dominant hero, and finally pushes IN
// until the screen fills the frame.
//
// PUSH-THROUGH: the camera pushes IN until the phone screen fills the frame and
// then STOPS — it stays IN FRONT of the phone (front face ~z=1.25) and never
// crosses it. Crossing clips the near plane through the model and reveals the
// phone's internal layers. The "into the content" illusion is the screen
// content's job (ScreenContent breakout + reveal), not the camera crashing
// through geometry.
export const CAM_POS: Keyframe<Tuple3>[] = [
  { at: BEAT.establishStart, value: [1.5, 0.8, 2.4] },                       // medium 3/4, framing the phone on the desk
  { at: BEAT.liftStart,      value: [1.15, 0.98, 2.15], ease: 'inOutCubic' },// easing in + centering as it lifts
  { at: BEAT.burstStart,     value: [0, 1.05, 1.65], ease: 'inOutCubic' },   // frontal hero, ~0.5m off the phone
  { at: BEAT.holdStart,      value: [0, 1.02, 1.6], ease: 'inOutCubic' },    // gentle creep (eased — no velocity jerk)
  { at: BEAT.returnStart,    value: [0, 1.0, 1.55], ease: 'inOutCubic' },    // map flows back into the phone
  { at: BEAT.rotateStart,    value: [0, 0.97, 1.5], ease: 'inOutCubic' },    // begins pushing in
  { at: BEAT.pushStart,      value: [0, 0.95, 1.46], ease: 'inOutCubic' },   // approaching the screen
  { at: BEAT.revealStart,    value: [0, 0.95, 1.4], ease: 'inCubic' },       // screen fills the frame (~0.15m off)
  { at: BEAT.end,            value: [0, 0.95, 1.38] },                       // STOP — screen covered, camera stays in front of the phone
];

// CAM_LOOK aims at the phone's desk rest at establish, then tracks up to the
// lifted hero and holds on the screen centre through the push (never "past").
export const CAM_LOOK: Keyframe<Tuple3>[] = [
  { at: BEAT.establishStart, value: [0.32, 0.32, 0.55] },                    // phone at rest on the desk (z~0.55)
  { at: BEAT.burstStart,     value: [0, 0.95, 1.15], ease: 'inOutCubic' },   // phone hero (== PHONE_HERO_POS)
  { at: BEAT.end,            value: [0, 0.95, 1.2] },                        // holds on the screen centre
];
