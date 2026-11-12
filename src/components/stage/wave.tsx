import { useEffect, useRef, type RefObject } from "react";
import { liveBursts } from "./wave-bus";

type Props = {
  hzRef: RefObject<HTMLSpanElement | null>;
};

function spineX(width: number) {
  return Math.max(20, width * 0.06);
}

export function Wave({ hzRef }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = true;
    const mouse = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.4 };
    let scrollBoost = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    const motes = Array.from({ length: 36 }, (_, i) => ({
      y: Math.random() * window.innerHeight,
      o: 0.15 + Math.random() * 0.55,
      s: 0.4 + Math.random() * 1.4,
      w: 0.6 + (i % 5) * 0.35,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onScroll = () => {
      const y = window.scrollY;
      const dy = Math.abs(y - lastY);
      lastY = y;
      scrollBoost = Math.min(1.8, scrollBoost + dy / 80);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    const draw = (now: number) => {
      if (!running) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dt = Math.min(40, now - lastT);
      lastT = now;
      scrollBoost *= Math.pow(0.92, dt / 16);
      const t = now / 1000;
      const x0 = spineX(w);
      const pull = Math.exp(-Math.abs(mouse.x - x0) / (w * 0.45));

      ctx.clearRect(0, 0, w, h);

      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255, 183, 3, 0.9)";
      ctx.beginPath();
      ctx.moveTo(x0, 0);
      ctx.lineTo(x0, h);
      ctx.stroke();

      if (!reduce) {
        const bands = 4;
        for (let b = 1; b <= bands; b++) {
          const alpha = 0.18 + b * 0.08;
          ctx.beginPath();
          ctx.strokeStyle = b % 2 === 0 ? `rgba(234, 226, 183, ${alpha})` : `rgba(255, 183, 3, ${alpha})`;
          ctx.lineWidth = b === 1 ? 1.4 : 1;
          for (let y = 0; y <= h; y += 5) {
            const near = Math.exp(-Math.abs(y - mouse.y) / 220);
            const amp = (6 + scrollBoost * 42 + near * 36 * (0.4 + pull) + b * 3) * (0.35 + b * 0.18);
            const wobble = Math.sin(y * (0.012 + b * 0.004) + t * (0.7 + b * 0.22) + mouse.x * 0.002);
            const x = x0 + wobble * amp;
            if (y === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        for (const m of motes) {
          m.y -= m.s * (0.35 + scrollBoost);
          if (m.y < -8) m.y = h + 8;
          const near = Math.exp(-Math.abs(m.y - mouse.y) / 240);
          const amp = 10 + scrollBoost * 28 + near * 22;
          const x = x0 + Math.sin(m.y * 0.02 + t * m.w) * amp;
          ctx.fillStyle = `rgba(255, 183, 3, ${m.o})`;
          ctx.fillRect(x, m.y, 1.5, 1.5);
        }
      }

      const bursts = liveBursts();
      for (let i = bursts.length - 1; i >= 0; i--) {
        const p = bursts[i];
        p.r += (2.2 + p.power * 3.4) * (dt / 16);
        p.a -= 0.012 * (dt / 16);
        if (p.a <= 0) {
          bursts.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 183, 3, ${p.a})`;
        ctx.lineWidth = 1.5;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = `rgba(251, 133, 0, ${p.a * 0.7})`;
        ctx.arc(p.x, p.y, p.r * 0.62, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (hzRef.current && Math.floor(now / 80) !== Math.floor((now - dt) / 80)) {
        const hz = 196 + (mouse.y / Math.max(h, 1)) * 180 + scrollBoost * 40 + Math.sin(t) * 1.4;
        hzRef.current.textContent = `${hz.toFixed(1)} Hz`;
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [hzRef]);

  return <canvas ref={ref} className="dr-wave" aria-hidden="true" />;
}
