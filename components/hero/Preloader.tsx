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
  // ?p= is the debug/screenshot path (verify-scene.mjs) — it must see the scene,
  // not this overlay, so bypass entirely and never touch the scroll lock. Derived
  // from the URL at first render (not an effect) so it's stable.
  const [bypass] = useState(
    () =>
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("p"),
  );
  const pct = Math.min(100, Math.round(progress));
  // Idle at 100% → assets are in. (active flips false when the manager drains.)
  const ready = !active && progress >= 100;

  // Freeze the scene at establish (p=0) until loaded.
  useEffect(() => {
    if (bypass) return;
    setLocked(true);
  }, [bypass, setLocked]);

  // Block scroll input while the gate is up so the scene can't advance behind it.
  useEffect(() => {
    if (bypass || done) return;
    const block = (e: Event) => e.preventDefault();
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    return () => {
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
    };
  }, [bypass, done]);

  // Reveal when ready (hold a beat so the 100% reads), plus a hard safety timeout
  // so a stalled asset can never trap the user on the loader forever.
  useEffect(() => {
    if (bypass) return;
    const reveal = () => {
      setDone(true);
      setLocked(false);
    };
    const t = setTimeout(reveal, ready ? 650 : 15000);
    return () => clearTimeout(t);
  }, [bypass, ready, setLocked]);

  if (bypass || done) return null;

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
