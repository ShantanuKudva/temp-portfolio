"use client";

import { useState } from "react";
import type { Reel } from "@/lib/work";
import { REEL_CATEGORIES } from "@/lib/work";
import { ReelCard } from "./reel-card";
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";

/**
 * The reel gallery — reels grouped by category. Each group is a labelled band
 * with a small grid of 9:16 cards; hovering one recedes its siblings (About's
 * bento focus). Tapping opens the lightbox. Mirrors Connect's rate-card rhythm.
 */
export function ReelGallery({ onOpen }: { onOpen: (reel: Reel) => void }) {
  // Track the hovered card per-group by a composite key so only siblings dim.
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="gallery" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Parallax speed={28}>
          <Reveal>
            <p className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.3em] text-[#eebb79]">
              <span>✦</span>&nbsp;&nbsp;The gallery
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mb-14 max-w-xl font-display text-3xl leading-tight sm:text-5xl">
              Reviews, grouped by what they are.
            </h2>
          </Reveal>
        </Parallax>

        <div className="flex flex-col gap-16">
          {REEL_CATEGORIES.map((cat) => (
            <div key={cat.label}>
              {/* Category label + hairline. */}
              <Reveal>
                <div className="mb-6 flex items-center gap-4">
                  <h3 className="font-display text-xl text-creme sm:text-2xl">
                    {cat.label}
                  </h3>
                  <span className="font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-[#eebb79]/80">
                    {String(cat.reels.length).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-creme/12" />
                </div>
              </Reveal>

              <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
                {cat.reels.map((reel, i) => {
                  const key = `${cat.label}:${reel.id}`;
                  const activeInGroup =
                    hovered?.startsWith(`${cat.label}:`) ?? false;
                  return (
                    <Reveal key={reel.id} delay={i * 0.06}>
                      <ReelCard
                        reel={reel}
                        onOpen={onOpen}
                        dimmed={activeInGroup && hovered !== key}
                        onHover={(v) => setHovered(v ? key : null)}
                        className="mx-auto max-w-[320px]"
                      />
                    </Reveal>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
