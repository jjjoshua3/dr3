import { useEffect, useState } from "react";

type Props = { onDone: () => void };

export function Preloader({ onDone }: Props) {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<"load" | "morph" | "leave">("load");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      onDone();
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let raf = 0;
    let cancelled = false;
    const timers: number[] = [];
    const start = performance.now();
    const dur = 2200;
    const tick = (now: number) => {
      if (cancelled) return;
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setPct(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setPhase("morph");
        timers.push(window.setTimeout(() => setPhase("leave"), 780));
        timers.push(
          window.setTimeout(() => {
            if (!cancelled) onDone();
          }, 1300),
        );
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
      document.body.style.overflow = prev;
    };
  }, [onDone]);

  const skip = () => {
    document.body.style.overflow = "";
    onDone();
  };

  return (
    <div className={`dr-pre is-${phase}`} role="status" aria-live="polite">
      <div className="dr-pre-line" aria-hidden="true" />
      <div className="dr-pre-sax">
        <Sax />
        <div className="dr-eq" aria-hidden="true">
          {Array.from({ length: 28 }, (_, i) => (
            <span
              key={i}
              className={i < Math.round((pct / 100) * 28) ? "is-on" : ""}
              style={{ animationDelay: `${(i % 7) * 0.08}s` }}
            />
          ))}
        </div>
        <p className="dr-pre-pct">
          <span>{String(pct).padStart(3, "0")}</span>
          <small>%</small>
        </p>
        <p className="dr-pre-name">Daan Roosenbrand</p>
      </div>
      <button type="button" className="dr-skip" onClick={skip}>
        Sla over
      </button>
    </div>
  );
}

function Sax() {
  return (
    <svg className="dr-sax" viewBox="0 0 220 460" fill="none" aria-hidden="true">
      <path
        className="dr-sax-tube"
        d="M156 86c-8 18-18 34-24 58-6 28-8 48-8 92 0 70 2 120-2 156-4 34-28 62-62 78"
      />
      <path
        className="dr-sax-line"
        d="M156 86c-8 18-18 34-24 58-6 28-8 48-8 92 0 70 2 120-2 156-4 34-28 62-62 78"
      />
      <path className="dr-sax-line" d="M148 78c18-16 46-14 56 4 8 14-4 26-24 24" />
      <path className="dr-sax-line" d="M168 96c8 2 14 8 12 14" />
      <path
        className="dr-sax-line"
        d="M46 452c-22 8-34 28-26 48 10 18 42 24 68 8 16-10 18-28 6-40"
      />
      <path className="dr-sax-line" d="M62 468c-8 8-8 20 2 28 12 8 28 6 36-6" />
      <g className="dr-sax-keys">
        <circle cx="128" cy="168" r="7" />
        <circle cx="128" cy="196" r="7" />
        <circle cx="126" cy="224" r="7" />
        <circle cx="126" cy="252" r="6" />
        <circle cx="124" cy="278" r="6" />
        <circle cx="140" cy="188" r="4.5" />
        <circle cx="140" cy="216" r="4.5" />
        <circle cx="138" cy="244" r="4" />
      </g>
    </svg>
  );
}
