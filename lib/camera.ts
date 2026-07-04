import type { Keyframe, Tuple3 } from '@/lib/track';
import { BEAT } from '@/lib/timeline';

// ORYZO DESK CLOSE-UP. Establish is a warm HIGH-ANGLE close-up looking DOWN at
// the iPhone lying on the creator's desk (camera above, aimed at the desk
// surface). As the phone lifts, the camera rises and swings frontal so it reads
// as a dominant hero, then pushes IN until the screen fills the frame.
//
// PUSH-THROUGH: the camera pushes IN until the phone screen fills the frame and
// then STOPS — it stays IN FRONT of the phone (front face ~z=1.25) and never
// crosses it. Crossing clips the near plane through the model and reveals the
// phone's internal layers. The "into the content" illusion is the screen
// content's job (ScreenContent breakout + reveal), not the camera crashing
// through geometry.
export const CAM_POS: Keyframe<Tuple3>[] = [
  { at: BEAT.establishStart, value: [0.5, 0.95, 1.35] },                     // high-angle close-up, looking down at the phone on the desk
  { at: BEAT.liftStart,      value: [0.3, 1.02, 1.7], ease: 'inOutCubic' },  // rises + swings frontal as the phone lifts
  { at: BEAT.burstStart,     value: [0, 1.05, 1.65], ease: 'inOutCubic' },   // frontal hero, ~0.5m off the phone
  { at: BEAT.holdStart,      value: [0, 1.02, 1.6], ease: 'inOutCubic' },    // gentle creep (eased — no velocity jerk)
  { at: BEAT.returnStart,    value: [0, 1.0, 1.55], ease: 'inOutCubic' },    // map flows back into the phone
  { at: BEAT.rotateStart,    value: [0, 0.97, 1.5], ease: 'inOutCubic' },    // begins pushing in
  { at: BEAT.pushStart,      value: [0, 0.95, 1.46], ease: 'inOutCubic' },   // approaching the screen
  { at: BEAT.revealStart,    value: [0, 0.95, 1.4], ease: 'inCubic' },       // screen fills the frame (~0.15m off)
  { at: BEAT.end,            value: [0, 0.95, 1.38] },                       // STOP — screen covered, camera stays in front of the phone
];

// CAM_LOOK aims DOWN at the phone on the desk at establish, then tracks up to
// the lifted hero and holds on the screen centre through the push.
export const CAM_LOOK: Keyframe<Tuple3>[] = [
  { at: BEAT.establishStart, value: [0.32, 0.18, 0.5] },                     // phone on the desk (aimed down)
  { at: BEAT.burstStart,     value: [0, 0.95, 1.15], ease: 'inOutCubic' },   // phone hero (== PHONE_HERO_POS)
  { at: BEAT.end,            value: [0, 0.95, 1.2] },                        // holds on the screen centre
];
