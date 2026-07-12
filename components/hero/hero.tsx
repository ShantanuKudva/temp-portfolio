import { GradualBlur } from "@/components/effects/gradual-blur";
import { HeroName } from "./hero-name";
import { WaxSeal } from "./wax-seal";
import { SubjectCutout } from "./subject-cutout";
import { Silk } from "./silk";
import { LoaderCurtain } from "./loader-curtain";
import { BackGlow } from "./back-glow";
import { HeroChromeReveal } from "./hero-chrome-reveal";
import { PointerParallax } from "./pointer-parallax";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <header
      id="top"
      role="banner"
      className="relative isolate flex min-h-screen flex-col overflow-hidden"
    >
      {/* Explicit stacking, bottom → top:
          silk(0) · wall(0) · backglow(1) · curtain(2) · name(3) · subject(4) · chrome(5) */}
      <div className={styles.silk} aria-hidden>
        <Silk color="#5b0f1a" speed={4} scale={1} noiseIntensity={1.2} rotation={0} />
      </div>
      <div className={styles.wall} aria-hidden />
      <BackGlow />

      <LoaderCurtain />
      <PointerParallax />

      <HeroName>Varsheni</HeroName>

      <div
        className={`absolute inset-0 z-4 flex items-end justify-center ${styles.subjectParallax}`}
      >
        <SubjectCutout />
      </div>

      <HeroChromeReveal>
        <span className={`${styles.tick} ${styles.tickTL}`} aria-hidden />
        <span className={`${styles.tick} ${styles.tickTR}`} aria-hidden />
        <span
          className={styles.spark}
          style={{ top: 120, left: 150, fontSize: 22, opacity: 0.85 }}
          aria-hidden
        >
          ✦
        </span>
        <span
          className={styles.spark}
          style={{ top: 250, right: 150, fontSize: 16, opacity: 0.7 }}
          aria-hidden
        >
          ✦
        </span>
        <span
          className={styles.spark}
          style={{ bottom: 210, left: 340, fontSize: 13, opacity: 0.6 }}
          aria-hidden
        >
          ✦
        </span>

        <div className={`${styles.sideText} ${styles.sideLeft}`} aria-hidden>
          Apps · Businesses · Honest reviews
        </div>
        <div className={`${styles.sideText} ${styles.sideRight}`} aria-hidden>
          Est. 2026 — Made in India
        </div>

        <div className={styles.pill}>
          <span className={styles.pillDot} aria-hidden />
          Available for brand deals
        </div>

        <WaxSeal />
      </HeroChromeReveal>

      <GradualBlur position="bottom" height="6rem" strength={3.5} />
    </header>
  );
}
