"use client";

import ColorBends from "@/components/ColorBends";
import Strands from "@/components/Strands";
import Aurora from "@/components/Aurora";

type Effect = "colorbends" | "strands" | "aurora";

// Fine, faint crème grid, echoing the main page's velvet weave.
const GRID: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(0deg, rgba(247,240,227,0.035) 0 1px, transparent 1px 11px)," +
    "repeating-linear-gradient(90deg, rgba(247,240,227,0.035) 0 1px, transparent 1px 11px)",
};

/**
 * Animated background for a nav card: the card's colour gradient as the base,
 * its effect on top (Work = ColorBends, About = Strands, Connect = Aurora — each
 * tinted to its own palette), then a fine grid overlay. WebGL only mounts while
 * the menu is `active` (open).
 */
export function NavCardBg({
  effect,
  colors,
  grad,
  active,
}: {
  effect: Effect;
  colors: string[];
  grad: string;
  active: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
      {/* Colour base (shows behind the transparent shader effects). */}
      <div className="absolute inset-0" style={{ background: grad }} />

      {active && effect === "colorbends" && (
        <div className="absolute inset-0">
          <ColorBends
            colors={colors}
            rotation={120}
            speed={0.18}
            scale={1.1}
            intensity={1.3}
            bandWidth={6}
            noise={0.12}
            parallax={0.4}
            mouseInfluence={0.6}
            transparent
          />
        </div>
      )}

      {active && effect === "strands" && (
        <div className="absolute inset-0">
          <Strands
            colors={colors}
            count={3}
            speed={0.4}
            glow={2.2}
            intensity={0.6}
            scale={1.4}
          />
        </div>
      )}

      {active && effect === "aurora" && (
        <div className="absolute inset-0">
          <Aurora colorStops={colors} blend={0.4} amplitude={1.4} speed={0.6} />
        </div>
      )}

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
