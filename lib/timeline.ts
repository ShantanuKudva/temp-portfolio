// Single tunable source of truth for beat boundaries (p in [0,1]). Spec §5.
// Percentages are provisional — tune HERE; every rig references these.
export const BEAT = {
  establishStart: 0.0,
  liftStart:      0.1,
  burstStart:     0.22,
  swirlStart:     0.3,
  constellStart:  0.4,
  constellPeak:   0.45,
  holdStart:      0.5,
  returnStart:    0.58,
  rotateStart:    0.64,
  pushStart:      0.74,
  revealStart:    0.88,
  bridgeStart:    0.95,
  end:            1.0,
} as const;
