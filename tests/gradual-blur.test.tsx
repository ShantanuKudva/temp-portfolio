import { render } from "@testing-library/react";
import { buildBlurLayers, GradualBlur } from "@/components/effects/gradual-blur";

test("buildBlurLayers returns one layer per divCount with increasing blur", () => {
  const layers = buildBlurLayers({ divCount: 6, strength: 2, exponential: true });
  expect(layers).toHaveLength(6);
  const blurs = layers.map((l) => l.blurRem);
  const sorted = [...blurs].sort((a, b) => a - b);
  expect(blurs).toEqual(sorted); // monotonically increasing
  expect(blurs[0]).toBeGreaterThan(0);
  layers.forEach((l) => expect(l.mask).toContain("black"));
});

test("GradualBlur renders divCount layers by default", () => {
  const { container } = render(<GradualBlur />);
  const root = container.querySelector('[data-slot="gradual-blur"]');
  expect(root).not.toBeNull();
  expect(root!.querySelectorAll("div")).toHaveLength(6);
});

test("GradualBlur renders nothing when hasFooter is true", () => {
  const { container } = render(<GradualBlur hasFooter />);
  expect(container.querySelector('[data-slot="gradual-blur"]')).toBeNull();
});
