"use client";
import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { useScrollStore } from "@/lib/store";

// Gated preloader: a 3D gyroscope spinner counting to 100% while the heavy GLBs +
// HDRI stream in. drei's useProgress tracks every useGLTF/useTexture/Environment
// load through the default loading manager, so the bar reaches 100% only once the
// scene is fully loaded — then the overlay fades and the scene is revealed.
export default function Preloader() {
  const { progress, active } = useProgress();
  const setLocked = useScrollStore((s) => s.setLocked);
  const [done, setDone] = useState(false);
  const pct = Math.min(100, Math.round(progress));
  // Idle at 100% → assets are in. (active flips false when the manager drains.)
  const ready = !active && progress >= 100;

  // Block scroll input while the gate is up so the scene can't advance behind it.
  useEffect(() => {
    if (done) return;
    const block = (e: Event) => e.preventDefault();
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    return () => {
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
    };
  }, [done]);

  // Lock the scene at establish while loading, then reveal once ready (hold a beat
  // so the 100% reads), with a hard safety timeout so a stalled asset can't trap
  // the user. The ?p= debug/screenshot path (verify-scene.mjs) must see the scene,
  // not the loader, so it skips the lock and reveals promptly. This lives in an
  // effect (client-only) so it never diverges from SSR → no hydration mismatch.
  useEffect(() => {
    if (done) return;
    const debug = new URLSearchParams(window.location.search).has("p");
    if (!debug) setLocked(true);
    const t = setTimeout(
      () => {
        setDone(true);
        if (!debug) setLocked(false);
      },
      debug ? 300 : ready ? 750 : 15000,
    );
    return () => clearTimeout(t);
  }, [done, ready, setLocked]);

  if (done) return null;

  return (
    <div
      className="preloader"
      data-ready={ready ? "1" : "0"}
      role="progressbar"
      aria-label="Loading"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span className="preloader__eyebrow">Varsheni</span>
      <div className="preloader__spinner" aria-hidden="true">
        <span className="preloader__ring preloader__ring--1" />
        <span className="preloader__ring preloader__ring--2" />
        <span className="preloader__ring preloader__ring--3" />
        <span className="preloader__count">
          {pct}
          <i>%</i>
        </span>
      </div>
      <div className="preloader__bar">
        <span style={{ width: `${pct}%` }} />
      </div>
      <span className="preloader__label">Loading the studio</span>
    </div>
  );
}
