import styles from "./about.module.css";

/**
 * A slowly rotating wax-seal prop — circular text around a centred ✦. Echoes the
 * hero's "work with me" seal so /about feels part of the same world.
 */
export function Seal({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className={`${styles.seal} ${className}`} aria-hidden>
      <svg viewBox="0 0 120 120" className="h-full w-full">
        <defs>
          <path
            id="sealCircle"
            d="M60,60 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0"
          />
        </defs>
        <circle
          cx="60"
          cy="60"
          r="57"
          fill="none"
          stroke="rgba(217,160,91,0.4)"
          strokeWidth="1"
        />
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="rgba(217,160,91,0.25)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
        <text
          fill="#d9a05b"
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "9.5px",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}
        >
          <textPath href="#sealCircle" startOffset="0">
            {text}
          </textPath>
        </text>
        <text
          x="60"
          y="60"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#d9a05b"
          style={{ fontFamily: "var(--font-alex-brush)", fontSize: "34px" }}
        >
          ✦
        </text>
      </svg>
    </div>
  );
}
