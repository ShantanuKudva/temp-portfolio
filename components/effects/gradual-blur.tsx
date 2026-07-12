import { cn } from "@/lib/utils";

type Position = "top" | "bottom" | "left" | "right";

const DIRECTION: Record<Position, string> = {
  top: "to top",
  bottom: "to bottom",
  left: "to left",
  right: "to right",
};

export function buildBlurLayers(opts: {
  divCount: number;
  strength: number;
  exponential?: boolean;
}) {
  const { divCount, strength, exponential = true } = opts;
  const increment = 100 / divCount;
  const layers: Array<{ blurRem: number; mask: string }> = [];
  for (let i = 1; i <= divCount; i++) {
    const progress = i / divCount;
    const blurRem = exponential
      ? Math.pow(2, progress * 4) * 0.0625 * strength
      : 0.0625 * (progress * divCount + 1) * strength;
    const p1 = increment * i - increment;
    const p2 = increment * i;
    const p3 = increment * i + increment;
    const p4 = increment * i + increment * 2;
    let g = `transparent ${p1}%, black ${p2}%`;
    if (p3 <= 100) g += `, black ${p3}%`;
    if (p4 <= 100) g += `, transparent ${p4}%`;
    layers.push({ blurRem: Number(blurRem.toFixed(3)), mask: g });
  }
  return layers;
}

export function GradualBlur({
  position = "bottom",
  height = "7rem",
  strength = 2.2,
  divCount = 6,
  hasFooter = false,
  className,
}: {
  position?: Position;
  height?: string;
  strength?: number;
  divCount?: number;
  hasFooter?: boolean;
  className?: string;
}) {
  if (hasFooter) return null;

  const isVertical = position === "top" || position === "bottom";
  const dir = DIRECTION[position];
  const layers = buildBlurLayers({ divCount, strength });

  return (
    <div
      data-slot="gradual-blur"
      aria-hidden
      className={cn("pointer-events-none fixed z-50", className)}
      style={{
        [position]: 0,
        left: isVertical ? 0 : undefined,
        right: isVertical ? 0 : undefined,
        top: isVertical ? undefined : 0,
        bottom: isVertical ? undefined : 0,
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
