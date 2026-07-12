"use client";

import { Silk } from "@/components/hero/silk";

type Effect = "prism" | "strands" | "silk";

// Faint crème grid, echoing the main page's velvet weave.
const GRID: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(0deg, rgba(247,240,227,0.06) 0 1px, transparent 1px 20px)," +
    "repeating-linear-gradient(90deg, rgba(247,240,227,0.06) 0 1px, transparent 1px 20px)",
};

/**
 * Animated background for a nav card: the effect (Silk today; Prism/Strands
 * once their sources land) under the card's colour gradient and a grid overlay.
 * WebGL only mounts while the menu is `active` (open), to avoid idle canvases.
 */
export function NavCardBg({
  effect,
  color,
  grad,
  active,
}: {
  effect: Effect;
  color: string;
  grad: string;
  active: boolean;
}) {
  const hasWebGL = active && effect === "silk";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
      {hasWebGL && (
        <div className="absolute inset-0">
          <Silk color={color} speed={2.5} scale={1.5} noiseIntensity={1} rotation={0.5} />
        </div>
      )}
      {/* Colour gradient — full when there's no live effect, a tint over Silk. */}
      <div
        className="absolute inset-0"
        style={{ background: grad, opacity: hasWebGL ? 0.5 : 1 }}
      />
      {/* Grid overlay. */}
      <div className="absolute inset-0" style={GRID} />
      {/* Inner sheen for depth. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(247,240,227,0.08), transparent 60%)",
        }}
      />
    </div>
  );
}
