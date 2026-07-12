import styles from "./hero.module.css";

export function WaxSeal() {
  return (
    <a href="#contact" aria-label="Work with me" className={styles.seal}>
      <svg className={styles.sealRing} viewBox="0 0 132 132" aria-hidden>
        <defs>
          <path
            id="seal-ring-path"
            d="M66,66 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0"
          />
        </defs>
        <text>
          <textPath href="#seal-ring-path" startOffset="0%">
            · WORK WITH ME · TECH UGC · HONEST REVIEWS&nbsp;
          </textPath>
        </text>
      </svg>
      <span className={styles.sealCore} aria-hidden>
        ↗
      </span>
    </a>
  );
}
