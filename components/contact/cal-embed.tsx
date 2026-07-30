"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

/**
 * Inline Cal.com booking, themed dark with the gold brand colour and wrapped in
 * a chocolate frame (amber hairline + feathered top) so the light iframe reads
 * as part of the velvet instead of a floating white slab.
 */
export function CalEmbed({ calLink }: { calLink: string }) {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cal = await getCalApi();
      if (cancelled) return;
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          dark: { "cal-brand": "#aeb2e6" },
          light: { "cal-brand": "#aeb2e6" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-moonlight/30 bg-[#0b0c1a]/70 p-1.5 shadow-[0_40px_100px_-50px_rgba(0,0,0,0.9)] backdrop-blur-md">
      {/* Top hairline sheen. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-creme/25 to-transparent"
      />
      <div className="overflow-hidden rounded-[1.35rem]">
        <Cal
          calLink={calLink}
          config={{ theme: "dark", layout: "month_view" }}
          style={{ width: "100%", height: "100%", minHeight: "560px", overflow: "scroll" }}
        />
      </div>
    </div>
  );
}
