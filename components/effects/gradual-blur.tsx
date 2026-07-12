import { cn } from "@/lib/utils";

type Position = "top" | "bottom" | "left" | "right";
type Curve = "linear" | "bezier" | "ease-in" | "ease-out";
type Target = "parent" | "page";

const DIRECTION: Record<Position, string> = {
  top: "to top",
  bottom: "to bottom",
  left: "to left",
  right: "to right",
};

const CURVE_FUNCTIONS: Record<Curve, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
};

/**
 * Pure layer math: one stacked layer per `divCount`, blur ramping along `curve`.
 * `mask` is the gradient stop list; the `linear-gradient(<dir>, …)` wrapper is
 * applied at render time so the same layer works for any edge.
 */
export function buildBlurLayers(opts: {
  divCount: number;
  strength: number;
  exponential?: boolean;
  curve?: Curve;
}) {
  const { divCount, strength, exponential = true, curve = "bezier" } = opts;
  const curveFn = CURVE_FUNCTIONS[curve] ?? CURVE_FUNCTIONS.linear;
  const increment = 100 / divCount;
  const layers: Array<{ blurRem: number; mask: string }> = [];
  for (let i = 1; i <= divCount; i++) {
    const progress = curveFn(i / divCount);
    const blurRem = exponential
      ? Math.pow(2, progress * 4) * 0.0625 * strength
      : 0.0625 * (progress * divCount + 1) * strength;
    const round = (n: number) => Math.round(n * 10) / 10;
    const p1 = round(increment * i - increment);
    const p2 = round(increment * i);
    const p3 = round(increment * i + increment);
    const p4 = round(increment * i + increment * 2);
    let g = `transparent ${p1}%, black ${p2}%`;
    if (p3 <= 100) g += `, black ${p3}%`;
    if (p4 <= 100) g += `, transparent ${p4}%`;
    layers.push({ blurRem: Number(blurRem.toFixed(3)), mask: g });
  }
  return layers;
}

/**
 * Progressive edge blur ("glass"). `target="parent"` (default) attaches it
 * absolutely to the bottom of a `relative`, `overflow-hidden` section so content
 * dissolves as it leaves; `target="page"` pins it fixed to the viewport edge.
 * Renders nothing when `hasFooter` is true.
 */
export function GradualBlur({
  position = "bottom",
  height = "8rem",
  strength = 2.6,
  divCount = 6,
  exponential = true,
  curve = "bezier",
  opacity = 1,
  target = "parent",
  hasFooter = false,
  className,
}: {
  position?: Position;
  height?: string;
  strength?: number;
  divCount?: number;
  exponential?: boolean;
  curve?: Curve;
  opacity?: number;
  target?: Target;
  hasFooter?: boolean;
  className?: string;
}) {
  if (hasFooter) return null;

  const isVertical = position === "top" || position === "bottom";
  const dir = DIRECTION[position];
  const layers = buildBlurLayers({ divCount, strength, exponential, curve });
  const isPage = target === "page";

  return (
    <div
      data-slot="gradual-blur"
      data-target={target}
      aria-hidden
      className={cn(
        "pointer-events-none",
        isPage ? "fixed z-50" : "absolute z-30",
        className
      )}
      style={{
        // Pin the chosen edge to 0 and stretch the cross-axis. (Setting both
        // `[position]:0` and an explicit `top/bottom` collided and cancelled out.)
        top: isVertical ? (position === "top" ? 0 : undefined) : 0,
        bottom: isVertical ? (position === "bottom" ? 0 : undefined) : 0,
        left: isVertical ? 0 : position === "left" ? 0 : undefined,
        right: isVertical ? 0 : position === "right" ? 0 : undefined,
        height: isVertical ? height : "100%",
        width: isVertical ? "100%" : height,
        isolation: "isolate",
      }}
    >
      {layers.map((l, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            opacity,
            WebkitBackdropFilter: `blur(${l.blurRem}rem)`,
            backdropFilter: `blur(${l.blurRem}rem)`,
            WebkitMaskImage: `linear-gradient(${dir}, ${l.mask})`,
            maskImage: `linear-gradient(${dir}, ${l.mask})`,
          }}
        />
      ))}
    </div>
  );
}
