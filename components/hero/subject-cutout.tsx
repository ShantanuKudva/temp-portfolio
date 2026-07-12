import Image from "next/image";
import styles from "./hero.module.css";

export function SubjectCutout() {
  return (
    <Image
      src="/varsheni-2-cutout.png"
      alt="Varsheni, tech UGC creator"
      width={767}
      height={893}
      priority
      className={styles.subject}
    />
  );
}
