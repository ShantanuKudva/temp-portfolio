import { describe, it, expect } from 'vitest';
import { PROCESS_STEPS, CASE_STUDY, PRICING_TIERS, FAQ } from '@/lib/pitchContent';
import { REVIEWED_BRANDS } from '@/lib/appLogos';

describe('editorial content', () => {
  it('has four process steps in order', () => {
    expect(PROCESS_STEPS).toHaveLength(4);
    expect(PROCESS_STEPS.map((s) => s.n)).toEqual(['01', '02', '03', '04']);
    PROCESS_STEPS.forEach((s) => { expect(s.title).toBeTruthy(); expect(s.body).toBeTruthy(); });
  });

  it('case study exposes brief, quote and three metrics', () => {
    expect(CASE_STUDY.brief).toBeTruthy();
    expect(CASE_STUDY.quote).toBeTruthy();
    expect(CASE_STUDY.metrics).toHaveLength(3);
    CASE_STUDY.metrics.forEach((m) => { expect(m.value).toBeTruthy(); expect(m.label).toBeTruthy(); });
  });

  it('has three pricing tiers with exactly one featured, ribboned tier', () => {
    expect(PRICING_TIERS).toHaveLength(3);
    const featured = PRICING_TIERS.filter((t) => t.featured);
    expect(featured).toHaveLength(1);
    expect(featured[0].ribbon).toBeTruthy();
    PRICING_TIERS.forEach((t) => expect(t.features.length).toBeGreaterThanOrEqual(3));
  });

  it('has five FAQ entries', () => {
    expect(FAQ).toHaveLength(5);
    FAQ.forEach((f) => { expect(f.q).toBeTruthy(); expect(f.a).toBeTruthy(); });
  });

  it('reviewed brands all carry a category', () => {
    expect(REVIEWED_BRANDS.length).toBeGreaterThanOrEqual(8);
    REVIEWED_BRANDS.forEach((b) => { expect(b.category).toBeTruthy(); expect(b.slug).toBeTruthy(); });
  });
});
