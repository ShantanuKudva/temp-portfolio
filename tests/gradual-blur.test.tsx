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

test("GradualBlur attaches to the parent by default and pins to the page when target=page", () => {
  const { container: parent } = render(<GradualBlur />);
  const parentRoot = parent.querySelector('[data-slot="gradual-blur"]')!;
  expect(parentRoot).toHaveAttribute("data-target", "parent");
  expect(parentRoot.className).toContain("absolute");
  expect(parentRoot.className).not.toContain("fixed");

  const { container: page } = render(<GradualBlur target="page" />);
  const pageRoot = page.querySelector('[data-slot="gradual-blur"]')!;
  expect(pageRoot.className).toContain("fixed");
});

test("buildBlurLayers honors the curve without breaking monotonicity", () => {
  const linear = buildBlurLayers({ divCount: 5, strength: 2, curve: "linear" });
  const bezier = buildBlurLayers({ divCount: 5, strength: 2, curve: "bezier" });
  expect(linear).toHaveLength(5);
  expect(bezier).toHaveLength(5);
  const mono = (xs: number[]) => xs.every((v, i) => i === 0 || v >= xs[i - 1]);
  expect(mono(bezier.map((l) => l.blurRem))).toBe(true);
});
