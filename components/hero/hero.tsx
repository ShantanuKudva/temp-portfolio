import { SiteNav } from "@/components/site-nav";
import { NeonName } from "./neon-name";
import { WaxSeal } from "./wax-seal";
import { SubjectCutout } from "./subject-cutout";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <header
      id="top"
      role="banner"
      className="relative flex min-h-screen flex-col overflow-hidden"
    >
      <div className={styles.wall} aria-hidden />
      <SiteNav />

      <div className="relative flex flex-1 items-end justify-center">
        <NeonName>Varsheni</NeonName>
        <div className={styles.backglow} aria-hidden />
        <SubjectCutout />

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
      </div>
    </header>
  );
}
