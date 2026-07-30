"use client";

import CurvedLoopBase from "@/components/CurvedLoop";

// JS-interop component — flexible props (its .jsx infers strict types from defaults).
const CurvedLoop = CurvedLoopBase as unknown as React.ComponentType<
  Record<string, unknown>
>;

/**
 * Close band — the "no hard sell" message as a draggable curved marquee that
 * arcs across the foot of the page (crème on indigo, brand serif).
 */
export function CurvedClose({ text }: { text: string }) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <CurvedLoop
        marqueeText={text}
        speed={2.4}
        curveAmount={160}
        direction="left"
        interactive
        className="font-script"
      />
    </section>
  );
}
