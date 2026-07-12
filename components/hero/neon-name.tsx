import { cn } from "@/lib/utils";
import styles from "./hero.module.css";

export function NeonName({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div aria-hidden className={cn(styles.wordmark, className)}>
      {children}
    </div>
  );
}
