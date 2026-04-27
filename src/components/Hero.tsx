import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import {
  Github, Linkedin, Mail, FileText, ArrowRight, Sparkles,
  Code2, Layers, Smartphone, Terminal, Zap, Star,
} from "lucide-react";
import HireMeModal from "./HireMeModal";

/* ══════════════════════════════════════════
   STARFIELD CANVAS
══════════════════════════════════════════ */
const StarfieldCanvas = ({ mx, my }: { mx: number; my: number }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);

  const stars = useMemo(() => Array.from({ length: 220 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.3 + 0.2,
    a: Math.random() * 0.65 + 0.15,
    ts: 0.004 + Math.random() * 0.009,
    to: Math.random() * Math.PI * 2,
    col: Math.random() > 0.85 ? (Math.random() > 0.5 ? "#93C5FD" : "#C4B5FD") : "#ffffff",
  })), []);

  const shots = useRef(Array.from({ length: 4 }, () => ({
    x: 0, y: 0, vx: 0, vy: 0, alpha: 0, active: false, age: 0,
  })));

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let t = 0;

    const spawn = (s: typeof shots.current[0]) => {
      s.x = Math.random() * 0.7; s.y = Math.random() * 0.4;
      const ang = 0.55 + Math.random() * 0.35;
      const spd = 0.0045 + Math.random() * 0.005;
      s.vx = Math.cos(ang) * spd; s.vy = Math.sin(ang) * spd;
      s.alpha = 1; s.active = true; s.age = 0;
    };
    shots.current.forEach((s, i) => setTimeout(() => spawn(s), i * 1600 + Math.random() * 2200));

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const px = (mx - 0.5) * 16, py = (my - 0.5) * 10;

      [
        { x: 0.15, y: 0.22, r: 0.3,  c: "rgba(110,231,183,0.028)" },
        { x: 0.8,  y: 0.68, r: 0.26, c: "rgba(147,197,253,0.026)" },
        { x: 0.55, y: 0.1,  r: 0.22, c: "rgba(196,181,253,0.024)" },
        { x: 0.32, y: 0.82, r: 0.18, c: "rgba(249,115,22,0.018)"  },
      ].forEach(n => {
        const gx = n.x * W + Math.sin(t * 0.0004 + n.x * 5) * 22 - px * 0.35;
        const gy = n.y * H + Math.cos(t * 0.0003 + n.y * 5) * 14 - py * 0.35;
        const gr = n.r * Math.max(W, H);
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        g.addColorStop(0, n.c); g.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      });

      stars.forEach(s => {
        const tw = Math.sin(t * s.ts + s.to) * 0.35 + 0.65;
        const sx = s.x * W + px * s.r * 0.5, sy = s.y * H + py * s.r * 0.5;
        ctx.save(); ctx.globalAlpha = s.a * tw;
        if (s.r > 1.0) {
          ctx.strokeStyle = s.col; ctx.lineWidth = 0.5;
          ctx.globalAlpha = s.a * tw * 0.35;
          ctx.beginPath(); ctx.moveTo(sx - s.r * 3, sy); ctx.lineTo(sx + s.r * 3, sy); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(sx, sy - s.r * 3); ctx.lineTo(sx, sy + s.r * 3); ctx.stroke();
          ctx.globalAlpha = s.a * tw;
        }
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.r * 2.2);
        sg.addColorStop(0, s.col); sg.addColorStop(1, "transparent");
        ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, sy, s.r * 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      shots.current.forEach(s => {
        if (!s.active) return;
        s.x += s.vx; s.y += s.vy; s.age++;
        s.alpha = Math.max(0, 1 - s.age / 52);
        if (s.age > 58 || s.x > 1.1 || s.y > 1.1) {
          s.active = false;
          setTimeout(() => spawn(s), 2800 + Math.random() * 3500);
        }
        const x1 = s.x * W, y1 = s.y * H, x0 = x1 - s.vx * W * 10, y0 = y1 - s.vy * H * 10;
        const g = ctx.createLinearGradient(x0, y0, x1, y1);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(0.5, `rgba(190,225,255,${s.alpha * 0.45})`);
        g.addColorStop(1, `rgba(255,255,255,${s.alpha})`);
        ctx.save(); ctx.strokeStyle = g; ctx.lineWidth = 1.4;
        ctx.shadowBlur = 6; ctx.shadowColor = "rgba(147,197,253,0.9)"; ctx.globalAlpha = s.alpha;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.beginPath(); ctx.arc(x1, y1, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      t++; raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf.current); };
  }, [stars, mx, my]);

  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }} />;
};

/* ══════════════════════════════════════════
   MISSION CLOCK (Mobile Responsive)
══════════════════════════════════════════ */
const MissionClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <span style={{ 
      fontFamily: "'Plus Jakarta Sans', sans-serif", 
      fontSize: "clamp(7px, 3vw, 10px)", 
      letterSpacing: "0.15em", 
      color: "rgba(110,231,183,0.5)", 
      fontWeight: 600,
      whiteSpace: "nowrap",
    }}>
      <span className="clock-label" style={{ display: "inline-block" }}>MCC · </span>
      {pad(time.getUTCHours())}:{pad(time.getUTCMinutes())}:{pad(time.getUTCSeconds())} UTC
    </span>
  );
};

/* ══════════════════════════════════════════
   BOOT SEQUENCE HOOK
══════════════════════════════════════════ */
const useBootSequence = () => {
  const [phase, setPhase] = useState(0);
  // phases: 0=flicker, 1=scan, 2=vitals, 3=manifest, 4=complete
  useEffect(() => {
    const timings = [350, 900, 1800, 2400, 3200];
    const timers = timings.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, []);
  return phase;
};

/* ══════════════════════════════════════════
   TYPEWRITER
══════════════════════════════════════════ */
const useTypewriter = (words: string[], spd = 70, del = 40, pause = 2400) => {
  const [txt, setTxt] = useState("");
  const [wi, setWi] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) { const t = setTimeout(() => setPaused(false), pause); return () => clearTimeout(t); }
    const w = words[wi];
    const t = setTimeout(() => {
      if (!deleting) {
        if (txt.length < w.length) setTxt(w.slice(0, txt.length + 1));
        else { setPaused(true); setDeleting(true); }
      } else {
        if (txt.length > 0) setTxt(w.slice(0, txt.length - 1));
        else { setDeleting(false); setWi(i => (i + 1) % words.length); }
      }
    }, deleting ? del : spd);
    return () => clearTimeout(t);
  }, [txt, deleting, paused, wi, words, spd, del, pause]);
  return txt;
};

/* ══════════════════════════════════════════
   HEXAGONAL PORTRAIT (Responsive)
══════════════════════════════════════════ */
const HexPortrait: React.FC<{ phase: number }> = ({ phase }) => {
  const scanRef = useRef<HTMLDivElement>(null);
  return (
    <div className="hex-portrait-container" style={{ 
      position: "relative", 
      width: "clamp(110px, 25vw, 160px)", 
      height: "clamp(122px, 27.5vw, 178px)", 
      flexShrink: 0,
      margin: "0 auto",
    }}>
      {/* Hex clip SVG def */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id="hexClip" clipPathUnits="objectBoundingBox">
            <polygon points="0.5,0 1,0.25 1,0.75 0.5,1 0,0.75 0,0.25" />
          </clipPath>
        </defs>
      </svg>

      {/* Outer hex border glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 2 ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "absolute", inset: -4,
          clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
          background: "linear-gradient(135deg, rgba(110,231,183,0.4), rgba(56,189,248,0.3), rgba(196,181,253,0.25))",
          zIndex: 1,
        }}
      />
      {/* Inner hex bg */}
      <div style={{
        position: "absolute", inset: 2,
        clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
        background: "#030810",
        zIndex: 2,
      }} />

      {/* Profile image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 2 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute", inset: 4,
          clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
          zIndex: 3, overflow: "hidden",
        }}
      >
        <img
          src="profile-image-modified.png"
          alt="Sithum Udayanga"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
        />
        {/* Scan effect overlay */}
        {phase === 2 && (
          <motion.div
            ref={scanRef}
            initial={{ top: "-8%" }}
            animate={{ top: "108%" }}
            transition={{ duration: 0.85, ease: "linear" }}
            style={{
              position: "absolute", left: 0, right: 0, height: "12%",
              background: "linear-gradient(to bottom, transparent, rgba(110,231,183,0.35), transparent)",
              pointerEvents: "none",
            }}
          />
        )}
        {/* Permanent scanline texture */}
        <div style={{
          position: "absolute", inset: 0,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 3px)",
          pointerEvents: "none",
        }} />
      </motion.div>

      {/* Corner scan brackets - responsive size */}
      {phase >= 2 && [
        { top: 8, left: "12%", borderTop: "2px solid #6EE7B7", borderLeft: "2px solid #6EE7B7" },
        { top: 8, right: "12%", borderTop: "2px solid #6EE7B7", borderRight: "2px solid #6EE7B7" },
        { bottom: 8, left: "12%", borderBottom: "2px solid #6EE7B7", borderLeft: "2px solid #6EE7B7" },
        { bottom: 8, right: "12%", borderBottom: "2px solid #6EE7B7", borderRight: "2px solid #6EE7B7" },
      ].map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 * i }}
          style={{
            position: "absolute", width: "clamp(8px, 4vw, 14px)", height: "clamp(8px, 4vw, 14px)",
            borderColor: "#6EE7B7", zIndex: 10, pointerEvents: "none", ...s,
          }}
        />
      ))}

      {/* Status badge below hex */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 6 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute", bottom: -10, left: "50%", transform: "translateX(-50%)",
          padding: "3px 12px", borderRadius: 99,
          background: "rgba(6,12,26,0.95)",
          border: "1px solid rgba(110,231,183,0.4)",
          zIndex: 10, whiteSpace: "nowrap",
          display: "flex", alignItems: "center", gap: 5,
        }}
      >
        <span style={{
          width: 5, height: 5, borderRadius: "50%", background: "#6EE7B7",
          boxShadow: "0 0 6px #6EE7B7", display: "inline-block",
          animation: "blink-h 1.8s step-end infinite",
        }} />
        <span style={{
          fontSize: "clamp(7px, 2.5vw, 8.5px)", letterSpacing: "0.16em", textTransform: "uppercase",
          color: "#6EE7B7", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
        }}>
          PILOT · CLEARED
        </span>
      </motion.div>
    </div>
  );
};

/* ══════════════════════════════════════════
   VITALS ROW — single animated stat line
══════════════════════════════════════════ */
const VitalRow: React.FC<{ label: string; value: string; color?: string; delay: number; phase: number; mono?: boolean }> = ({
  label, value, color = "rgba(255,255,255,0.75)", delay, phase, mono,
}) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: phase >= 3 ? 1 : 0, x: phase >= 3 ? 0 : -10 }}
    transition={{ delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "5px 10px",
      borderBottom: "1px solid rgba(110,231,183,0.05)",
      flexWrap: "wrap",
      gap: "4px",
    }}
  >
    <span style={{
      fontSize: "clamp(7px, 2.5vw, 8.5px)", letterSpacing: "0.14em", textTransform: "uppercase",
      color: "rgba(110,231,183,0.35)", fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 700,
    }}>{label}</span>
    <span style={{
      fontSize: mono ? "clamp(9px, 3vw, 10px)" : "clamp(10px, 3.5vw, 11px)", 
      fontWeight: 600,
      color, fontFamily: mono ? "monospace" : "'Plus Jakarta Sans', sans-serif",
      letterSpacing: mono ? "0.08em" : "0.02em",
      wordBreak: "break-word",
      textAlign: "right",
    }}>{value}</span>
  </motion.div>
);

/* ══════════════════════════════════════════
   EKG CANVAS
══════════════════════════════════════════ */
const EKGCanvas: React.FC<{ active: boolean }> = ({ active }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const t = useRef(0);

  useEffect(() => {
    if (!active) return;
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.beginPath();
      ctx.strokeStyle = "#6EE7B7";
      ctx.lineWidth = 1.2;
      ctx.shadowColor = "#6EE7B7";
      ctx.shadowBlur = 4;
      const offset = t.current % W;

      for (let x = 0; x < W; x++) {
        const pos = (x - offset + W) % W;
        const cycle = pos / 60;
        let y = H / 2;
        const cyc = cycle % 1;
        if (cyc < 0.08) y = H / 2 - Math.sin(cyc / 0.08 * Math.PI) * H * 0.18;
        else if (cyc < 0.14) y = H / 2 + Math.sin((cyc - 0.08) / 0.06 * Math.PI) * H * 0.35;
        else if (cyc < 0.22) y = H / 2 - Math.sin((cyc - 0.14) / 0.08 * Math.PI) * H * 0.55;
        else if (cyc < 0.3)  y = H / 2 + Math.sin((cyc - 0.22) / 0.08 * Math.PI) * H * 0.2;
        else if (cyc < 0.36) y = H / 2 - Math.sin((cyc - 0.3)  / 0.06 * Math.PI) * H * 0.1;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Fade mask
      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, "rgba(3,8,16,1)");
      grad.addColorStop(0.15, "rgba(3,8,16,0)");
      grad.addColorStop(0.82, "rgba(3,8,16,0)");
      grad.addColorStop(1, "rgba(3,8,16,1)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      t.current += 1.4;
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf.current);
  }, [active]);

  return (
    <canvas ref={ref} width={220} height={28}
      style={{ width: "100%", height: 28, display: "block", opacity: active ? 1 : 0.2 }} />
  );
};

/* ══════════════════════════════════════════
   GLOBE CANVAS — 3D wireframe + category pins (Touch/Mobile Support)
══════════════════════════════════════════ */
interface GlobePinDef {
  label: string;
  sub: string;
  lat: number;
  lng: number;
  color: string;
  icon: React.ComponentType<{ size?: number }>;
}

const GLOBE_PINS: GlobePinDef[] = [
  { label: "Backend",  sub: "Java · Spring · Node",      lat:  35, lng:  20,  color: "#60A5FA", icon: Terminal },
  { label: "Frontend", sub: "React · TS · Tailwind",     lat: -20, lng: 100,  color: "#A78BFA", icon: Layers   },
  { label: "Mobile",   sub: "Android · Kotlin",          lat:  50, lng: -60,  color: "#FBBF24", icon: Smartphone },
  { label: "Cloud",    sub: "AWS · GCP · Docker",        lat: -45, lng: -30,  color: "#22D3EE", icon: Code2    },
];

const GlobeCanvas: React.FC<{ phase: number }> = ({ phase }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const rotRef = useRef(0);
  const [hoveredPin, setHoveredPin] = useState<number | null>(null);
  const [pinScreenPos, setPinScreenPos] = useState<{ x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase < 4) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);

    const toXYZ = (lat: number, lng: number, r: number): [number, number, number] => {
      const φ = (lat * Math.PI) / 180;
      const λ = (lng * Math.PI) / 180;
      return [r * Math.cos(φ) * Math.cos(λ), r * Math.sin(φ), r * Math.cos(φ) * Math.sin(λ)];
    };

    const project = (x: number, y: number, z: number, W: number, H: number): [number, number, number] => {
      const fov = 320;
      const dpr = devicePixelRatio;
      const cx = W / 2, cy = H / 2;
      const rz = rotRef.current;
      const rx2 = x * Math.cos(rz) - z * Math.sin(rz);
      const rz2 = x * Math.sin(rz) + z * Math.cos(rz);
      const depth = rz2 + fov * dpr;
      const scale = (fov * dpr) / depth;
      return [cx + rx2 * scale, cy - y * scale, rz2];
    };

    const newPinPos: { x: number; y: number }[] = [];

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const dpr = devicePixelRatio;
      const R = Math.min(W, H) * 0.32;

      // Draw latitude lines
      for (let lat = -80; lat <= 80; lat += 20) {
        const y = R * Math.sin((lat * Math.PI) / 180);
        const r2 = Math.sqrt(R * R - y * y);
        ctx.beginPath();
        for (let lng = 0; lng <= 360; lng += 3) {
          const lngRad = (lng * Math.PI) / 180;
          const x3 = r2 * Math.cos(lngRad);
          const z3 = r2 * Math.sin(lngRad);
          const [sx, sy, sz] = project(x3, y, z3, W, H);
          const alpha = Math.max(0, (sz + R) / (R * 2)) * 0.18 + 0.04;
          if (lng === 0) { ctx.moveTo(sx, sy); }
          else { ctx.lineTo(sx, sy); }
          ctx.strokeStyle = `rgba(110,231,183,${alpha})`;
        }
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // Draw longitude lines
      for (let lng = 0; lng < 360; lng += 20) {
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 3) {
          const [x3, y3, z3] = toXYZ(lat, lng + (rotRef.current * 180) / Math.PI, R);
          const [sx, sy, sz] = project(x3, y3, z3, W, H);
          const alpha = Math.max(0, (sz + R) / (R * 2)) * 0.18 + 0.04;
          if (lat === -90) { ctx.moveTo(sx, sy); }
          else { ctx.lineTo(sx, sy); }
          ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
        }
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // Equator glow ring
      ctx.beginPath();
      for (let lng = 0; lng <= 360; lng += 2) {
        const [x3, y3, z3] = toXYZ(0, lng + (rotRef.current * 180) / Math.PI, R);
        const [sx, sy, sz] = project(x3, y3, z3, W, H);
        const alpha = Math.max(0, (sz + R) / (R * 2)) * 0.45 + 0.05;
        ctx.strokeStyle = `rgba(110,231,183,${alpha})`;
        if (lng === 0) { ctx.moveTo(sx, sy); } else { ctx.lineTo(sx, sy); }
      }
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Draw pins
      newPinPos.length = 0;
      GLOBE_PINS.forEach((pin, i) => {
        const [x3, y3, z3] = toXYZ(pin.lat, pin.lng, R);
        const rz = rotRef.current;
        const rx2 = x3 * Math.cos(rz) - z3 * Math.sin(rz);
        const rz2 = x3 * Math.sin(rz) + z3 * Math.cos(rz);
        const [sx, sy, sz] = project(x3, y3, z3, W, H);

        // Only show pins on visible hemisphere
        if (rz2 > -R * 0.1) {
          const isHov = hoveredPin === i;
          const alpha = Math.max(0.3, (rz2 + R) / (R * 1.5));

          // Pin dot
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.shadowColor = pin.color;
          ctx.shadowBlur = isHov ? 16 : 8;
          ctx.fillStyle = pin.color;
          ctx.beginPath();
          ctx.arc(sx, sy, isHov ? 6 * dpr : 4 * dpr, 0, Math.PI * 2);
          ctx.fill();

          // Pulse ring for hovered
          if (isHov) {
            ctx.beginPath();
            ctx.arc(sx, sy, 10 * dpr, 0, Math.PI * 2);
            ctx.strokeStyle = pin.color;
            ctx.lineWidth = 1 * dpr;
            ctx.globalAlpha = 0.4;
            ctx.stroke();
          }
          ctx.restore();

          // Connector line
          ctx.save();
          ctx.globalAlpha = alpha * 0.3;
          ctx.strokeStyle = pin.color;
          ctx.lineWidth = 0.8 * dpr;
          ctx.setLineDash([3 * dpr, 4 * dpr]);
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx, sy - 22 * dpr);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();

          newPinPos[i] = { x: sx / dpr, y: sy / dpr };
        } else {
          newPinPos[i] = { x: -999, y: -999 };
        }
      });

      setPinScreenPos([...newPinPos]);
      rotRef.current += 0.003;
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(rafRef.current); };
  }, [phase, hoveredPin]);

  // Touch and mouse handlers for pin detection
  const updateHoverFromPoint = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = clientX - rect.left;
    const my = clientY - rect.top;
    let found: number | null = null;
    pinScreenPos.forEach((p, i) => {
      if (Math.hypot(p.x - mx, p.y - my) < 22) found = i;
    });
    setHoveredPin(found);
  }, [pinScreenPos]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    updateHoverFromPoint(e.clientX, e.clientY);
  }, [updateHoverFromPoint]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length) {
      updateHoverFromPoint(e.touches[0].clientX, e.touches[0].clientY);
      e.preventDefault();
    }
  }, [updateHoverFromPoint]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length) {
      updateHoverFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [updateHoverFromPoint]);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredPin(null)}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={() => setTimeout(() => setHoveredPin(null), 100)}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />

      {/* Pin tooltip cards - responsive positioning */}
      <AnimatePresence>
        {hoveredPin !== null && pinScreenPos[hoveredPin] && pinScreenPos[hoveredPin].x > 0 && (
          <motion.div
            key={hoveredPin}
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              left: `min(${pinScreenPos[hoveredPin].x}px, ${window.innerWidth - 160}px)`,
              top: `${Math.max(10, pinScreenPos[hoveredPin].y - 88)}px`,
              width: "min(150px, 80vw)",
              background: "rgba(4,10,24,0.95)",
              border: `1px solid ${GLOBE_PINS[hoveredPin].color}50`,
              borderRadius: 10,
              padding: "10px 12px",
              pointerEvents: "none",
              zIndex: 20,
              backdropFilter: "blur(12px)",
              boxShadow: `0 0 20px ${GLOBE_PINS[hoveredPin].color}25`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                background: `${GLOBE_PINS[hoveredPin].color}15`,
                border: `1px solid ${GLOBE_PINS[hoveredPin].color}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: GLOBE_PINS[hoveredPin].color,
              }}>
                {(() => { const Icon = GLOBE_PINS[hoveredPin].icon; return <Icon size={12} />; })()}
              </div>
              <span style={{
                fontSize: 11, fontWeight: 700, color: GLOBE_PINS[hoveredPin].color,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>{GLOBE_PINS[hoveredPin].label}</span>
            </div>
            <p style={{
              fontSize: 10, color: "rgba(255,255,255,0.45)",
              fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0, lineHeight: 1.4,
            }}>{GLOBE_PINS[hoveredPin].sub}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pin labels always visible - responsive font */}
      {phase >= 4 && pinScreenPos.map((pos, i) => pos.x > 0 && (
        <div key={i} style={{
          position: "absolute",
          left: pos.x,
          top: pos.y - 30,
          transform: "translateX(-50%)",
          fontSize: "clamp(8px, 2.5vw, 9px)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
          color: GLOBE_PINS[i].color,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          pointerEvents: "none",
          textShadow: `0 0 8px ${GLOBE_PINS[i].color}`,
          whiteSpace: "nowrap",
          opacity: hoveredPin === i ? 1 : 0.65,
          transition: "opacity 0.2s",
        }}>
          {GLOBE_PINS[i].label}
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════
   TELEMETRY STRIP — bottom HUD bar (Responsive)
══════════════════════════════════════════ */
const TelemetryStrip: React.FC<{ phase: number }> = ({ phase }) => {
  const stats = [
    { label: "ACTIVE MISSIONS",   value: "20+",   color: "#6EE7B7" },
    { label: "SYSTEMS ONLINE",    value: "25",     color: "#38BDF8" },
    { label: "CLIENT UPLINK",     value: "10+",    color: "#C4B5FD" },
    { label: "MISSION ELAPSED",   value: "3+ YRS", color: "#FBBF24" },
    { label: "DEPLOYMENT STATUS", value: "LIVE",   color: "#F97316" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: phase >= 4 ? 1 : 0, y: phase >= 4 ? 0 : 16 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="telemetry-strip"
      style={{
        display: "flex",
        flexWrap: "wrap",
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid rgba(110,231,183,0.1)",
        background: "rgba(3,8,16,0.8)",
        backdropFilter: "blur(12px)",
      }}
    >
      {stats.map((s, i) => (
        <div key={s.label} style={{
          flex: "1 1 auto",
          minWidth: "80px",
          padding: "clamp(6px, 2vw, 10px) clamp(4px, 2vw, 8px)",
          textAlign: "center",
          borderRight: i < stats.length - 1 ? "1px solid rgba(110,231,183,0.07)" : "none",
          borderBottom: window.innerWidth < 640 && i < stats.length - 1 ? "1px solid rgba(110,231,183,0.07)" : "none",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
            background: `linear-gradient(90deg, transparent, ${s.color}50, transparent)`,
          }} />
          <div style={{
            fontSize: "clamp(12px, 4vw, 14px)", fontWeight: 800, fontFamily: "'Syne', sans-serif",
            color: s.color, lineHeight: 1, marginBottom: 3,
          }}>{s.value}</div>
          <div style={{
            fontSize: "clamp(6px, 2vw, 7.5px)", letterSpacing: "0.12em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)", fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>{s.label}</div>
        </div>
      ))}
    </motion.div>
  );
};

/* ══════════════════════════════════════════
   LAUNCH BUTTON — PRIMARY "HIRE ME"
   Asymmetric hex-cut shape with plasma glow,
   animated energy fill on hover, corner clips
══════════════════════════════════════════ */
const HireBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [hov, setHov] = useState(false);
  const [pressed, setPressed] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 300, damping: 24 });
  const sy = useSpring(my, { stiffness: 300, damping: 24 });

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={e => {
        if (!ref.current) return;
        const b = ref.current.getBoundingClientRect();
        mx.set((e.clientX - (b.left + b.width / 2)) * 0.22);
        my.set((e.clientY - (b.top + b.height / 2)) * 0.22);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); setHov(false); }}
      onMouseEnter={() => setHov(true)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className="hire-btn"
      style={{
        x: sx, y: sy,
        position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 9,
        /* Asymmetric clip — flat left, angled right corner */
        clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
        padding: "clamp(10px, 3vw, 14px) clamp(20px, 5vw, 28px)",
        background: hov
          ? "linear-gradient(135deg, #6EE7B7 0%, #38BDF8 60%, #5EEAD4 100%)"
          : "linear-gradient(135deg, #4ADE80 0%, #22D3EE 60%, #6EE7B7 100%)",
        color: "#020B14",
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800,
        fontSize: "clamp(11px, 3.5vw, 13px)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        cursor: "pointer",
        border: "none",
        outline: "none",
        userSelect: "none",
        minWidth: "min(160px, 70vw)",
        boxShadow: hov
          ? "0 0 40px rgba(110,231,183,0.55), 0 0 80px rgba(110,231,183,0.2), inset 0 1px 0 rgba(255,255,255,0.3)"
          : "0 0 20px rgba(110,231,183,0.25), 0 4px 20px rgba(0,0,0,0.4)",
        transition: "background 0.25s, box-shadow 0.25s",
        overflow: "hidden",
      } as any}
    >
      <AnimatePresence>
        {hov && (
          <motion.div
            initial={{ x: "-110%", skewX: -12 }}
            animate={{ x: "220%" }}
            exit={{ x: "220%" }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      <div style={{
        position: "absolute", top: 3, left: 3,
        width: 8, height: 8,
        borderTop: "1.5px solid rgba(2,11,20,0.4)",
        borderLeft: "1.5px solid rgba(2,11,20,0.4)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: 3, right: 3,
        width: 8, height: 8,
        borderBottom: "1.5px solid rgba(2,11,20,0.4)",
        borderRight: "1.5px solid rgba(2,11,20,0.4)",
        pointerEvents: "none",
      }} />

      <span style={{ position: "relative", flexShrink: 0 }}>
        <span style={{
          display: "block", width: 7, height: 7, borderRadius: "50%",
          background: "rgba(2,11,20,0.5)",
          boxShadow: "inset 0 0 3px rgba(0,0,0,0.4)",
        }} />
        {hov && (
          <motion.span
            animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
            transition={{ duration: 0.9, repeat: Infinity }}
            style={{
              position: "absolute", inset: -2, borderRadius: "50%",
              border: "1px solid rgba(2,11,20,0.5)",
              pointerEvents: "none",
            }}
          />
        )}
      </span>

      <span style={{ position: "relative", zIndex: 1 }}>Hire Me</span>

      <motion.span
        animate={hov ? { x: [0, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.7, repeat: hov ? Infinity : 0 }}
        style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center" }}
      >
        <ArrowRight size={15} />
      </motion.span>

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 1.5,
        background: "rgba(2,11,20,0.25)",
        pointerEvents: "none",
      }} />
    </motion.button>
  );
};

/* ══════════════════════════════════════════
   MISSION BRIEF BUTTON — SECONDARY
   Outlined tactical style, dashed border
   segments, corner notch, ghost fill on hover
══════════════════════════════════════════ */
const MissionBriefBtn: React.FC<{ href: string }> = ({ href }) => {
  const [hov, setHov] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 300, damping: 24 });
  const sy = useSpring(my, { stiffness: 300, damping: 24 });

  return (
    <motion.a
      ref={ref}
      href={href}
      download
      style={{ x: sx, y: sy }}
      onMouseMove={e => {
        if (!ref.current) return;
        const b = ref.current.getBoundingClientRect();
        mx.set((e.clientX - (b.left + b.width / 2)) * 0.22);
        my.set((e.clientY - (b.top + b.height / 2)) * 0.22);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); setHov(false); }}
      onMouseEnter={() => setHov(true)}
      whileTap={{ scale: 0.95 }}
      className="mission-brief-btn"
      style={{
        x: sx, y: sy,
        position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 9,
        clipPath: "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
        padding: "clamp(9px, 3vw, 13px) clamp(20px, 5vw, 26px)",
        background: hov ? "rgba(110,231,183,0.08)" : "rgba(110,231,183,0.03)",
        color: hov ? "#6EE7B7" : "rgba(255,255,255,0.7)",
        fontFamily: "'Syne', sans-serif",
        fontWeight: 700,
        fontSize: "clamp(11px, 3.5vw, 12.5px)",
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        cursor: "pointer",
        textDecoration: "none",
        userSelect: "none",
        minWidth: "min(160px, 70vw)",
        backdropFilter: "blur(12px)",
        transition: "background 0.22s, color 0.22s, box-shadow 0.22s",
        boxShadow: hov
          ? "0 0 22px rgba(110,231,183,0.15), inset 0 0 20px rgba(110,231,183,0.04)"
          : "none",
        overflow: "hidden",
      } as any}
    >
      <div style={{
        position: "absolute", inset: 0,
        clipPath: "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
        background: "transparent",
        boxShadow: hov
          ? "inset 0 0 0 1px rgba(110,231,183,0.55)"
          : "inset 0 0 0 1px rgba(110,231,183,0.2)",
        transition: "box-shadow 0.22s",
        pointerEvents: "none",
      }} />

      <AnimatePresence>
        {hov && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 50% 120%, rgba(110,231,183,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      {[
        { top: 2, left: 2, borderTop: `1.5px solid ${hov ? "#6EE7B7" : "rgba(110,231,183,0.4)"}`, borderLeft: `1.5px solid ${hov ? "#6EE7B7" : "rgba(110,231,183,0.4)"}` },
        { bottom: 2, right: 2, borderBottom: `1.5px solid ${hov ? "#6EE7B7" : "rgba(110,231,183,0.4)"}`, borderRight: `1.5px solid ${hov ? "#6EE7B7" : "rgba(110,231,183,0.4)"}` },
      ].map((s, i) => (
        <div key={i} style={{
          position: "absolute", width: 9, height: 9,
          transition: "border-color 0.22s",
          pointerEvents: "none", ...s,
        }} />
      ))}

      <span style={{
        position: "absolute", top: -1, right: 12,
        fontSize: "clamp(6px, 2vw, 7.5px)", fontWeight: 800, letterSpacing: "0.12em",
        color: hov ? "#6EE7B7" : "rgba(110,231,183,0.4)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: hov ? "rgba(110,231,183,0.12)" : "rgba(110,231,183,0.05)",
        border: `1px solid ${hov ? "rgba(110,231,183,0.4)" : "rgba(110,231,183,0.15)"}`,
        padding: "1px 5px", borderRadius: "0 0 4px 4px",
        transition: "all 0.22s",
      }}>PDF</span>

      <FileText size={14} style={{ flexShrink: 0, position: "relative", zIndex: 1 }} />
      <span style={{ position: "relative", zIndex: 1 }}>Mission Brief</span>

      <motion.div
        animate={hov ? { scaleX: [0, 1] } : { scaleX: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, #6EE7B7, transparent)",
          transformOrigin: "left",
          pointerEvents: "none",
        }}
      />
    </motion.a>
  );
};

/* ══════════════════════════════════════════
   SCREEN FLICKER
══════════════════════════════════════════ */
const ScreenFlicker: React.FC<{ phase: number }> = ({ phase }) => (
  <AnimatePresence>
    {phase === 0 && (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0, 1, 0, 1, 0] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, times: [0, 0.15, 0.3, 0.5, 0.75, 1] }}
        style={{
          position: "fixed", inset: 0, zIndex: 999,
          background: "#0a1628", pointerEvents: "none",
        }}
      />
    )}
  </AnimatePresence>
);

/* ══════════════════════════════════════════
   BOOT STATUS BAR
══════════════════════════════════════════ */
const BootStatusBar: React.FC<{ phase: number }> = ({ phase }) => {
  const lines = [
    { p: 1, text: "MISSION CONTROL — INITIATING DOSSIER SCAN...", color: "#6EE7B7" },
    { p: 2, text: "BIOMETRIC SCAN COMPLETE — IDENTITY CONFIRMED", color: "#38BDF8" },
    { p: 3, text: "LOADING PILOT MANIFEST...", color: "#C4B5FD" },
    { p: 4, text: "DOSSIER COMPLETE — PILOT CLEARED FOR DEPLOYMENT ✓", color: "#6EE7B7" },
  ];

  return (
    <div className="boot-status-bar" style={{
      position: "absolute", top: "clamp(8px, 2vh, 14px)", left: "50%", transform: "translateX(-50%)",
      zIndex: 30, pointerEvents: "none", textAlign: "center",
      width: "90%",
    }}>
      <AnimatePresence mode="wait">
        {lines.filter(l => l.p === phase).map(l => (
          <motion.div
            key={l.text}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            style={{
              fontSize: "clamp(7px, 2.5vw, 9px)", letterSpacing: "0.2em",
              color: l.color, fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700, textTransform: "uppercase",
              whiteSpace: "nowrap",
              overflowX: "auto",
              maxWidth: "98%",
              display: "inline-block",
            }}
          >
            {l.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

/* ══════════════════════════════════════════
   HUD CORNER BRACKETS (Responsive)
══════════════════════════════════════════ */
const HUDCorners: React.FC = () => (
  <>
    {[
      { top: "clamp(8px, 2vh, 16px)", left: "clamp(8px, 2vw, 16px)", borderTop: "1px solid", borderLeft: "1px solid" },
      { top: "clamp(8px, 2vh, 16px)", right: "clamp(8px, 2vw, 16px)", borderTop: "1px solid", borderRight: "1px solid" },
      { bottom: "clamp(8px, 2vh, 16px)", left: "clamp(8px, 2vw, 16px)", borderBottom: "1px solid", borderLeft: "1px solid" },
      { bottom: "clamp(8px, 2vh, 16px)", right: "clamp(8px, 2vw, 16px)", borderBottom: "1px solid", borderRight: "1px solid" },
    ].map((style, i) => (
      <div key={i} style={{
        position: "absolute", width: "clamp(18px, 5vw, 28px)", height: "clamp(18px, 5vw, 28px)",
        borderColor: "rgba(110,231,183,0.2)", zIndex: 4, pointerEvents: "none", ...style,
      }} />
    ))}
  </>
);

/* ══════════════════════════════════════════
   HERO (Fully Mobile Responsive)
══════════════════════════════════════════ */
export const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const phase = useBootSequence();

  const typed = useTypewriter([
    "Software Engineer",
    "Full-Stack Developer",
    "Android Engineer",
    "UI Architect",
  ], 70, 40, 2400);

  useEffect(() => {
    const h = (e: MouseEvent) => setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  const onClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const id = Date.now();
    setRipples(p => [...p, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setRipples(p => p.filter(r => r.id !== id)), 900);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        @keyframes blink-h   { 50% { opacity: 0 } }
        @keyframes blink-dot { 50% { opacity: 0 } }
        @keyframes aur {
          0%   { background-position: 0% 0%   }
          100% { background-position: 200% 0% }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6 }
          100% { transform: scale(2.4); opacity: 0   }
        }
        @keyframes otw-float {
          0%,100% { transform: translateY(-50%) translateX(0)   }
          50%     { transform: translateY(-50%) translateX(-5px) }
        }
        @keyframes scanline-h {
          0%   { transform: translateY(-100%) }
          100% { transform: translateY(200vh) }
        }
        .hero-split { 
          display: grid; 
          grid-template-columns: 1fr; 
          gap: 2rem; 
          align-items: start; 
        }
        @media (min-width: 900px) {
          .hero-split { grid-template-columns: 1fr 1.45fr; }
        }
        .cta-btn-row { display: flex; gap: 12px; flex-wrap: wrap; align-items: stretch; }
        .cta-btn-row > button, .cta-btn-row > a { 
          flex: 1 1 auto; 
          min-width: 148px; 
          max-width: 210px; 
          box-sizing: border-box; 
        }
        @media (max-width: 480px) {
          .cta-btn-row { flex-direction: column; width: 100%; }
          .cta-btn-row > button, .cta-btn-row > a { 
            max-width: 100% !important; 
            min-width: unset !important; 
            width: 100% !important; 
          }
          .clock-label { display: none !important; }
          .hero-globe-panel { margin-top: 1rem; }
          .telemetry-strip { gap: 0; }
        }
        @media (max-width: 640px) {
          .hero-split { gap: 1.5rem; }
          .hero-content-padding { padding-left: 1rem; padding-right: 1rem; }
        }
        .portrait-vitals-row {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
          flex-wrap: wrap;
          justify-content: center;
        }
        @media (max-width: 640px) {
          .portrait-vitals-row {
            flex-direction: column;
            align-items: center;
          }
          .vitals-panel {
            width: 100%;
          }
        }
        .hidden.lg\\:flex {
          display: flex;
        }
        @media (max-width: 768px) {
          .hidden.lg\\:flex {
            display: none !important;
          }
        }
      `}</style>

      {/* Click ripples */}
      {ripples.map(r => (
        <motion.div key={r.id}
          style={{
            position: "fixed", left: r.x - 1, top: r.y - 1,
            width: 2, height: 2, borderRadius: "50%",
            border: "1.5px solid rgba(110,231,183,0.55)",
            zIndex: 9999, pointerEvents: "none",
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 95, opacity: 0 }}
          transition={{ duration: 0.88, ease: "easeOut" }}
        />
      ))}

      <ScreenFlicker phase={phase} />

      <section
        onClick={onClick}
        style={{ minHeight: "100vh", background: "#03060F", position: "relative", overflow: "hidden", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* Aurora top bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2, zIndex: 5,
          background: "linear-gradient(90deg,transparent,#6EE7B7,#38BDF8,#C4B5FD,#F97316,transparent)",
          backgroundSize: "200% 100%",
          animation: "aur 4s linear infinite",
        }} />

        <StarfieldCanvas mx={mouse.x} my={mouse.y} />
        <HUDCorners />
        <BootStatusBar phase={phase} />

        {/* Spotlight */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: `radial-gradient(700px circle at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(110,231,183,0.048) 0%, transparent 65%)`,
        }} />

        {/* Scanline sweep */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{
            position: "absolute", left: 0, right: 0, height: 100,
            background: "linear-gradient(to bottom, transparent, rgba(110,231,183,0.011), transparent)",
            animation: "scanline-h 9s linear infinite",
          }} />
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{
          position: "relative", zIndex: 10,
          maxWidth: 1200, margin: "0 auto",
          padding: "clamp(40px, 6vh, 80px) clamp(1rem, 4vw, 1.5rem) clamp(30px, 4vh, 60px)",
          minHeight: "100vh",
          display: "flex", flexDirection: "column", justifyContent: "center",
          gap: "1.5rem",
        }}>

          {/* ── SPLIT GRID ── */}
          <div className="hero-split">

            {/* ════════════════════════════
                LEFT — Pilot Dossier Panel
            ════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : -30 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
            >
              {/* Terminal header strip */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 12px",
                background: "rgba(110,231,183,0.04)",
                border: "1px solid rgba(110,231,183,0.12)",
                borderRadius: "8px 8px 0 0",
                borderBottom: "none",
                flexWrap: "wrap",
              }}>
                {["#F97316", "#FBBF24", "#6EE7B7"].map((c, i) => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: c, opacity: 0.7 }} />
                ))}
                <span style={{
                  fontSize: "clamp(7px, 2.5vw, 9px)", letterSpacing: "0.2em", color: "rgba(110,231,183,0.35)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
                  textTransform: "uppercase", flex: 1, textAlign: "center",
                }}>
                  PILOT.DOSSIER — v4.2.1
                </span>
                <MissionClock />
              </div>

              {/* Dossier panel body */}
              <div style={{
                border: "1px solid rgba(110,231,183,0.12)",
                borderRadius: "0 0 12px 12px",
                background: "rgba(3,8,16,0.85)",
                backdropFilter: "blur(20px)",
                overflow: "hidden",
                position: "relative",
              }}>
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(110,231,183,0.007) 3px,rgba(110,231,183,0.007) 4px)",
                }} />

                {/* Portrait + vitals row - responsive */}
                <div className="portrait-vitals-row" style={{ padding: "clamp(16px, 3vw, 20px) clamp(12px, 3vw, 18px)" }}>
                  <HexPortrait phase={phase} />

                  {/* Vitals */}
                  <div className="vitals-panel" style={{ flex: 1, minWidth: 0, width: "100%" }}>
                    <div style={{
                      fontSize: "clamp(7px, 2.5vw, 8px)", letterSpacing: "0.22em", textTransform: "uppercase",
                      color: "rgba(110,231,183,0.3)", fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 700, marginBottom: 6, padding: "0 4px",
                      textAlign: "center",
                    }}>
                      ╔══ IDENTITY MATRIX ══╗
                    </div>

                    <VitalRow label="CALLSIGN"  value="SITHUM.UD"             color="#6EE7B7"               delay={0}    phase={phase} mono />
                    <VitalRow label="RANK"      value="Senior Developer"       color="rgba(255,255,255,0.85)" delay={0.08} phase={phase} />
                    <VitalRow label="SPEC"      value="Full-Stack · Mobile"    color="#38BDF8"               delay={0.16} phase={phase} />
                    <VitalRow label="LOCATION"  value="Earth · LK"             color="rgba(255,255,255,0.6)"  delay={0.24} phase={phase} />
                    <VitalRow label="STATUS"    value="ONLINE ●"               color="#6EE7B7"               delay={0.32} phase={phase} />

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: phase >= 3 ? 1 : 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      style={{ marginTop: 8 }}
                    >
                      <div style={{
                        fontSize: "clamp(7px, 2.5vw, 8px)", letterSpacing: "0.14em", color: "rgba(110,231,183,0.25)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 3, paddingLeft: 10,
                      }}>
                        VITALS · NOMINAL
                      </div>
                      <EKGCanvas active={phase >= 3} />
                    </motion.div>
                  </div>
                </div>

                {/* Transmission ticker — typewriter role */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase >= 4 ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    borderTop: "1px solid rgba(110,231,183,0.08)",
                    padding: "clamp(8px, 2vw, 10px) clamp(12px, 3vw, 18px)",
                    background: "rgba(110,231,183,0.02)",
                    display: "flex", alignItems: "center", gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{
                    fontSize: "clamp(7px, 2.5vw, 8px)", letterSpacing: "0.18em", textTransform: "uppercase",
                    color: "rgba(110,231,183,0.3)", fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700, whiteSpace: "nowrap",
                  }}>
                    ▶ INCOMING:
                  </span>
                  <span style={{
                    fontSize: "clamp(10px, 3.5vw, 12.5px)", fontFamily: "'Syne', sans-serif",
                    fontWeight: 700, color: "#fff", letterSpacing: "-0.01em",
                    wordBreak: "break-word",
                  }}>
                    {typed}
                    <span className="cblink" style={{ color: "#6EE7B7" }}>▌</span>
                  </span>
                </motion.div>
              </div>

              {/* Name headline */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: phase >= 4 ? 1 : 0, y: phase >= 4 ? 0 : 12 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(1.8rem, 5vw, 3.2rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  margin: "0 0 6px",
                  color: "#fff",
                  textAlign: "center",
                }}>
                  Sithum{" "}
                  <span style={{
                    background: "linear-gradient(135deg,#6EE7B7 0%,#38BDF8 50%,#C4B5FD 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>
                    Udayanga
                  </span>
                </h1>
                <p style={{
                  fontSize: "clamp(11px, 3vw, 12.5px)", color: "rgba(255,255,255,0.35)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0, lineHeight: 1.6,
                  maxWidth: 380, textAlign: "center", marginLeft: "auto", marginRight: "auto",
                }}>
                  Building{" "}
                  <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
                    expertly crafted solutions
                  </strong>{" "}
                  that blend design, development, and performance across web and mobile.
                </p>
              </motion.div>

              {/* CTA row */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: phase >= 4 ? 1 : 0, y: phase >= 4 ? 0 : 10 }}
                transition={{ delay: 0.1, duration: 0.45 }}
                style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}
              >
                {/* Status pill */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "center",
                  padding: "5px 14px", borderRadius: 99,
                  background: "rgba(110,231,183,0.06)",
                  border: "1px solid rgba(110,231,183,0.2)",
                }}>
                  <span style={{ position: "relative", width: 8, height: 8, flexShrink: 0 }}>
                    <span style={{ display: "block", width: 8, height: 8, borderRadius: "50%", background: "#6EE7B7", boxShadow: "0 0 8px #6EE7B7" }} />
                    <span style={{ position: "absolute", inset: -3, borderRadius: "50%", border: "1.5px solid #6EE7B7", animation: "pulse-ring 2s ease-out infinite" }} />
                  </span>
                  <span style={{ fontSize: "clamp(9px, 3vw, 10.5px)", fontWeight: 700, letterSpacing: "0.1em", color: "#6EE7B7", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Available for Opportunities
                  </span>
                  <Zap size={10} style={{ color: "#FCD34D" }} />
                </div>

                {/* Buttons row */}
                <div className="cta-btn-row" style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
                  <HireBtn onClick={() => setIsModalOpen(true)} />
                  <MissionBriefBtn href="/SITHUM UDAYANGA - CV.pdf" />
                </div>

                {/* Sub-label */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                  <div style={{ width: 28, height: 1, background: "linear-gradient(to right, rgba(110,231,183,0.3), transparent)" }} />
                  <span style={{
                    fontSize: "clamp(7px, 2.5vw, 9px)", letterSpacing: "0.18em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.15)", fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                  }}>LAUNCH SEQUENCE READY</span>
                </div>
              </motion.div>

              {/* Social row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 4 ? 1 : 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}
              >
                <span style={{
                  fontSize: "clamp(7px, 2.5vw, 8.5px)", letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "rgba(110,231,183,0.25)", fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700, marginRight: 4,
                }}>
                  LINKS:
                </span>
                {[
                  { href: "https://github.com/SithumUD", icon: Github, label: "GitHub", c: "#e2e8f0" },
                  { href: "https://www.linkedin.com/in/sithum-udayanga-6301b4301", icon: Linkedin, label: "LinkedIn", c: "#38BDF8" },
                  { href: "mailto:sithumudayangaofficial@gmail.com", icon: Mail, label: "Email", c: "#6EE7B7" },
                ].map(({ href, icon: Icon, label, c }) => (
                  <motion.a key={label} href={href}
                    target={label !== "Email" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ scale: 1.18, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      width: 36, height: 36, borderRadius: 9,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.4)",
                      transition: "all 0.22s",
                      textDecoration: "none",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = `${c}50`; el.style.color = c;
                      el.style.background = `${c}10`; el.style.boxShadow = `0 0 18px ${c}28`;
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "rgba(255,255,255,0.08)";
                      el.style.color = "rgba(255,255,255,0.4)";
                      el.style.background = "rgba(255,255,255,0.04)";
                      el.style.boxShadow = "none";
                    }}
                  >
                    <Icon size={15} />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* ════════════════════════════
                RIGHT — Mission Manifest (Globe)
            ════════════════════════════ */}
            <motion.div
              className="hero-globe-panel"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: phase >= 3 ? 1 : 0, x: phase >= 3 ? 0 : 30 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* Panel header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "6px 14px",
                background: "rgba(56,189,248,0.04)",
                border: "1px solid rgba(56,189,248,0.1)",
                borderRadius: "8px 8px 0 0",
                borderBottom: "none",
                flexWrap: "wrap",
                gap: "8px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: "#38BDF8", boxShadow: "0 0 5px #38BDF8",
                    display: "inline-block", animation: "blink-h 2s step-end infinite",
                  }} />
                  <span style={{
                    fontSize: "clamp(7px, 2.5vw, 9px)", letterSpacing: "0.2em", textTransform: "uppercase",
                    color: "rgba(56,189,248,0.5)", fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                  }}>
                    TECH CONSTELLATION MAP
                  </span>
                </div>
                <span style={{
                  fontSize: "clamp(7px, 2.5vw, 8.5px)", color: "rgba(255,255,255,0.2)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.08em",
                }}>
                  LIVE · ROTATING
                </span>
              </div>

              {/* Globe panel */}
              <div style={{
                border: "1px solid rgba(56,189,248,0.1)",
                borderRadius: "0 0 12px 12px",
                background: "rgba(3,8,16,0.85)",
                backdropFilter: "blur(20px)",
                overflow: "hidden",
                position: "relative",
              }}>
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(56,189,248,0.006) 3px,rgba(56,189,248,0.006) 4px)",
                }} />

                {/* Globe */}
                <div style={{ height: "clamp(220px, 40vw, 340px)", position: "relative" }}>
                  <GlobeCanvas phase={phase} />

                  {phase < 4 && (
                    <div style={{
                      position: "absolute", inset: 0, display: "flex",
                      alignItems: "center", justifyContent: "center",
                      pointerEvents: "none",
                    }}>
                      <div style={{
                        fontSize: "clamp(8px, 3vw, 10px)", letterSpacing: "0.2em", textTransform: "uppercase",
                        color: "rgba(56,189,248,0.3)", fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 700,
                      }}>
                        LOADING CONSTELLATION...
                      </div>
                    </div>
                  )}
                </div>

                {/* Legend row */}
                <div style={{
                  borderTop: "1px solid rgba(56,189,248,0.08)",
                  padding: "clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px)",
                  display: "flex", flexWrap: "wrap", gap: 8,
                  background: "rgba(56,189,248,0.02)",
                  justifyContent: "center",
                }}>
                  {GLOBE_PINS.map(pin => {
                    const Icon = pin.icon;
                    return (
                      <div key={pin.label} style={{
                        display: "flex", alignItems: "center", gap: 5,
                        padding: "3px 10px", borderRadius: 99,
                        background: `${pin.color}0e`,
                        border: `1px solid ${pin.color}30`,
                      }}>
                        <Icon size={10} style={{ color: pin.color }} />
                        <span style={{
                          fontSize: "clamp(8px, 2.5vw, 9.5px)", fontWeight: 700, color: pin.color,
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          letterSpacing: "0.05em",
                        }}>{pin.label}</span>
                      </div>
                    );
                  })}
                  <div style={{ marginLeft: "auto", display: "none", alignItems: "center", gap: 5 }}>
                    <span style={{
                      fontSize: 8.5, color: "rgba(255,255,255,0.18)",
                      fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.08em",
                    }}>
                      HOVER PIN TO INSPECT
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick stat cards — 2×2 grid */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: phase >= 4 ? 1 : 0, y: phase >= 4 ? 0 : 12 }}
                transition={{ delay: 0.15, duration: 0.45 }}
                style={{
                  display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8,
                }}
              >
                {[
                  { icon: Code2,      label: "Projects Shipped",  value: "20+",  color: "#6EE7B7", sub: "Web & Mobile" },
                  { icon: Star,       label: "Client Rating",     value: "★★★★★", color: "#FBBF24", sub: "All 5-star" },
                  { icon: Zap,        label: "On-Time Delivery",  value: "100%", color: "#38BDF8", sub: "Never missed" },
                  { icon: Sparkles,   label: "Happy Clients",     value: "10+",  color: "#C4B5FD", sub: "Worldwide" },
                ].map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={card.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: phase >= 4 ? 1 : 0, scale: phase >= 4 ? 1 : 0.9 }}
                      transition={{ delay: 0.1 + i * 0.07, duration: 0.35, type: "spring", stiffness: 130 }}
                      style={{
                        padding: "clamp(10px, 2.5vw, 12px) clamp(10px, 2.5vw, 14px)", borderRadius: 10,
                        background: "rgba(3,8,16,0.8)",
                        border: `1px solid ${card.color}20`,
                        backdropFilter: "blur(10px)",
                        position: "relative", overflow: "hidden",
                        transition: "all 0.2s",
                        cursor: "default",
                      }}
                      whileHover={{ scale: 1.03, borderColor: `${card.color}50` } as any}
                    >
                      <div style={{
                        position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
                        background: `linear-gradient(90deg, transparent, ${card.color}50, transparent)`,
                      }} />
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                          background: `${card.color}12`,
                          border: `1px solid ${card.color}30`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: card.color,
                        }}>
                          <Icon size={13} />
                        </div>
                        <div style={{
                          fontSize: "clamp(15px, 4vw, 17px)", fontWeight: 800, fontFamily: "'Syne', sans-serif",
                          color: card.color, lineHeight: 1,
                        }}>{card.value}</div>
                      </div>
                      <div style={{
                        fontSize: "clamp(8px, 2.5vw, 9.5px)", fontWeight: 600, color: "rgba(255,255,255,0.55)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.3,
                      }}>{card.label}</div>
                      <div style={{
                        fontSize: "clamp(7px, 2vw, 8.5px)", color: "rgba(255,255,255,0.2)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif", marginTop: 1,
                        letterSpacing: "0.04em",
                      }}>{card.sub}</div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>

          {/* ── TELEMETRY STRIP ── */}
          <TelemetryStrip phase={phase} />

        </div>

        {/* Open-to-work side badge - hidden on mobile */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: phase >= 4 ? 1 : 0, x: 0 }}
          transition={{ delay: 0.5 }}
          className="hidden lg:flex"
          style={{
            position: "fixed", right: 20, top: "50%",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            zIndex: 40, pointerEvents: "none",
            animation: phase >= 4 ? "otw-float 3.5s ease-in-out infinite" : "none",
          }}
        >
          <div style={{ width: 1, height: 56, background: "linear-gradient(to bottom,transparent,rgba(110,231,183,0.28))" }} />
          <div style={{
            padding: "12px 10px", borderRadius: 14,
            background: "rgba(110,231,183,0.06)",
            border: "1px solid rgba(110,231,183,0.16)",
            backdropFilter: "blur(12px)",
            writingMode: "vertical-rl",
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#6EE7B7", letterSpacing: "0.18em", fontFamily: "'Syne', sans-serif" }}>
              Open to Work
            </span>
          </div>
          <Star size={11} style={{ color: "#FCD34D", opacity: 0.6 }} />
          <div style={{ width: 1, height: 56, background: "linear-gradient(to top,transparent,rgba(110,231,183,0.28))" }} />
        </motion.div>

        {/* Scroll indicator - hidden on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 5 ? 1 : 0 }}
          transition={{ delay: 0.3 }}
          className="hidden md:flex"
          style={{
            position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
            display: "none", flexDirection: "column", alignItems: "center", gap: 6,
            zIndex: 20, pointerEvents: "none",
          }}
        >
          <span style={{
            color: "rgba(255,255,255,0.14)", fontSize: 9, letterSpacing: "0.22em",
            textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>scroll</span>
          <div style={{ position: "relative", width: 1, height: 40, overflow: "hidden", background: "rgba(255,255,255,0.05)" }}>
            <motion.div
              style={{ position: "absolute", width: "100%", height: "50%", background: "linear-gradient(to bottom,transparent,#6EE7B7,transparent)" }}
              animate={{ y: ["-60%", "160%"] }}
              transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        <HireMeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </section>
    </>
  );
};