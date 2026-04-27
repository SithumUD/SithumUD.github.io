import { useEffect, useState, useRef, useMemo } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FaJava, FaJs, FaDatabase, FaReact, FaGithub,
} from "react-icons/fa";
import {
  SiAndroid, SiSpringboot, SiKotlin,
} from "react-icons/si";

/* ══════════════════════════════════════════
   STARFIELD CANVAS (Responsive)
══════════════════════════════════════════ */
const StarfieldCanvas = ({ mx, my }: { mx: number; my: number }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);

  // Reduced star count on mobile for performance
  const stars = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 120 : 200;
    return Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.3 + 0.2,
      a: Math.random() * 0.65 + 0.15,
      ts: 0.004 + Math.random() * 0.009,
      to: Math.random() * Math.PI * 2,
      col: Math.random() > 0.85 ? (Math.random() > 0.5 ? "#93C5FD" : "#C4B5FD") : "#ffffff",
    }));
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let t = 0;
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
        const sx = s.x * W + px * s.r * 0.5;
        const sy = s.y * H + py * s.r * 0.5;
        ctx.save();
        ctx.globalAlpha = s.a * tw;
        if (s.r > 1.0) {
          ctx.strokeStyle = s.col; ctx.lineWidth = 0.5;
          ctx.globalAlpha = s.a * tw * 0.35;
          ctx.beginPath(); ctx.moveTo(sx - s.r * 3, sy); ctx.lineTo(sx + s.r * 3, sy); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(sx, sy - s.r * 3); ctx.lineTo(sx, sy + s.r * 3); ctx.stroke();
          ctx.globalAlpha = s.a * tw;
        }
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.r * 2.2);
        sg.addColorStop(0, s.col); sg.addColorStop(1, "transparent");
        ctx.fillStyle = sg;
        ctx.beginPath(); ctx.arc(sx, sy, s.r * 2.2, 0, Math.PI * 2); ctx.fill();
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
   ORBIT RING SVG (decorative, animated) — Responsive
══════════════════════════════════════════ */
const OrbitRing: React.FC<{ size: number; speed: number; color: string; dotColor: string; reverse?: boolean }> = ({
  size, speed, color, dotColor, reverse = false,
}) => (
  <div style={{
    position: "absolute", width: `${size}%`, height: `${size}%`,
    borderRadius: "50%",
    border: `1px solid ${color}`,
    top: "50%", left: "50%",
    transform: "translate(-50%,-50%)",
    animation: `${reverse ? "orbit-ccw" : "orbit-cw"} ${speed}s linear infinite`,
  }}>
    <div style={{
      position: "absolute", top: -4, left: "50%", transform: "translateX(-50%)",
      width: "clamp(5px, 1.5vw, 7px)", height: "clamp(5px, 1.5vw, 7px)",
      borderRadius: "50%",
      background: dotColor,
      boxShadow: `0 0 10px ${dotColor}`,
    }} />
  </div>
);

/* ══════════════════════════════════════════
   ASTRONAUT AVATAR (Fully Responsive)
══════════════════════════════════════════ */
const AstronautAvatar: React.FC = () => (
  <div className="astro-avatar-container" style={{
    position: "relative",
    width: "min(180px, 40vw)",
    aspectRatio: "1 / 1",
    flexShrink: 0,
    margin: "0 auto",
  }}>
    {/* Orbit rings — sizes are percentages of parent */}
    <OrbitRing size={95} speed={14} color="rgba(110,231,183,0.15)" dotColor="#6EE7B7" />
    <OrbitRing size={80} speed={9}  color="rgba(56,189,248,0.12)" dotColor="#38BDF8" reverse />
    <OrbitRing size={65} speed={20} color="rgba(196,181,253,0.1)"  dotColor="#C4B5FD" />

    {/* Core circle */}
    <div style={{
      position: "absolute", inset: 0, display: "flex",
      alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        width: "50%", height: "50%", borderRadius: "50%",
        background: "radial-gradient(circle at 35% 35%, rgba(110,231,183,0.2), rgba(3,6,15,0.9))",
        border: "1.5px solid rgba(110,231,183,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 30px rgba(110,231,183,0.15), inset 0 0 30px rgba(0,0,0,0.6)",
      }}>
        {/* Astronaut SVG icon — responsive */}
        <svg width="50%" height="50%" viewBox="0 0 64 64" fill="none" style={{ maxWidth: 46, maxHeight: 46 }}>
          {/* Helmet */}
          <circle cx="32" cy="22" r="14" fill="rgba(110,231,183,0.15)" stroke="rgba(110,231,183,0.6)" strokeWidth="1.5"/>
          {/* Visor */}
          <ellipse cx="32" cy="21" rx="8" ry="6" fill="rgba(56,189,248,0.25)" stroke="rgba(56,189,248,0.5)" strokeWidth="1"/>
          {/* Visor reflection */}
          <ellipse cx="29" cy="19" rx="2.5" ry="1.8" fill="rgba(255,255,255,0.2)"/>
          {/* Body suit */}
          <path d="M18 44 Q18 36 32 34 Q46 36 46 44 L46 50 Q46 54 32 54 Q18 54 18 50Z"
            fill="rgba(110,231,183,0.1)" stroke="rgba(110,231,183,0.35)" strokeWidth="1.2"/>
          {/* Neck connector */}
          <rect x="28" y="34" width="8" height="5" rx="2" fill="rgba(110,231,183,0.2)" stroke="rgba(110,231,183,0.3)" strokeWidth="1"/>
          {/* Left arm */}
          <path d="M18 38 Q10 40 12 46 Q14 50 18 48" stroke="rgba(110,231,183,0.35)" strokeWidth="4" strokeLinecap="round" fill="none"/>
          {/* Right arm */}
          <path d="M46 38 Q54 40 52 46 Q50 50 46 48" stroke="rgba(110,231,183,0.35)" strokeWidth="4" strokeLinecap="round" fill="none"/>
          {/* Chest badge */}
          <rect x="27" y="42" width="10" height="6" rx="2" fill="rgba(56,189,248,0.2)" stroke="rgba(56,189,248,0.4)" strokeWidth="0.8"/>
          {/* Badge LED */}
          <circle cx="32" cy="45" r="1.5" fill="#6EE7B7" opacity="0.8"/>
        </svg>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════
   MISSION LOG ENTRY — animated typewriter line
══════════════════════════════════════════ */
const LogEntry: React.FC<{ index: number; text: React.ReactNode; icon: string; delay: number; inView: boolean }> = ({
  index, text, icon, delay, inView,
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={inView ? { opacity: 1, x: 0 } : {}}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    style={{
      display: "flex", gap: "clamp(8px, 2.5vw, 12px)", alignItems: "flex-start",
      padding: "clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 14px)",
      borderRadius: 8,
      background: "rgba(110,231,183,0.025)",
      border: "1px solid rgba(110,231,183,0.08)",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div style={{
      position: "absolute", left: 0, top: 0, bottom: 0, width: 2,
      background: "linear-gradient(to bottom, transparent, rgba(110,231,183,0.5), transparent)",
    }} />
    <span style={{
      fontSize: "clamp(8px, 2.5vw, 9px)", fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: "rgba(110,231,183,0.25)", letterSpacing: "0.1em",
      marginTop: 1, flexShrink: 0, minWidth: "clamp(18px, 5vw, 20px)",
      userSelect: "none",
    }}>
      {String(index + 1).padStart(2, "0")}
    </span>
    <span style={{ fontSize: "clamp(14px, 4vw, 15px)", lineHeight: 1, flexShrink: 0, marginTop: 1 }}>{icon}</span>
    <p style={{
      fontSize: "clamp(11px, 3.5vw, 13px)", lineHeight: 1.5,
      color: "rgba(255,255,255,0.45)",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      margin: 0,
      wordBreak: "break-word",
    }}>
      {text}
    </p>
  </motion.div>
);

/* ══════════════════════════════════════════
   CAPABILITY CARD — hexagonal skill chip (Responsive)
══════════════════════════════════════════ */
interface CapabilityProps {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  name: string;
  sub: string;
  color: string;
  delay: number;
  inView: boolean;
}

const CapabilityCard: React.FC<CapabilityProps> = ({ icon: Icon, name, sub, color, delay, inView }) => {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.92 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.45, type: "spring", stiffness: 110 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        padding: "clamp(12px, 2.5vw, 14px) clamp(10px, 2vw, 12px)",
        borderRadius: 10,
        background: hov
          ? `linear-gradient(135deg, ${color}14, ${color}06)`
          : "rgba(255,255,255,0.025)",
        border: `1px solid ${hov ? color + "50" : color + "22"}`,
        boxShadow: hov ? `0 6px 24px ${color}22` : "none",
        transition: "all 0.22s ease",
        cursor: "default",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "clamp(6px, 2vw, 8px)", textAlign: "center",
        transform: hov ? "translateY(-3px)" : "none",
        overflow: "hidden",
      }}
    >
      {hov && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `linear-gradient(100deg, transparent 30%, ${color}14 50%, transparent 70%)`,
          animation: "shimmer 0.55s ease-in-out forwards",
        }} />
      )}
      <div style={{
        width: "clamp(38px, 10vw, 44px)", height: "clamp(38px, 10vw, 44px)", borderRadius: "50%",
        background: `${color}12`,
        border: `1.5px solid ${color}35`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: hov ? `0 0 14px ${color}40` : "none",
        transition: "box-shadow 0.2s",
      }}>
        <Icon size="clamp(18px, 5vw, 22px)" style={{ color }} />
      </div>
      <div>
        <div style={{
          fontSize: "clamp(11px, 3vw, 12px)", fontWeight: 600,
          color: "rgba(255,255,255,0.85)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          lineHeight: 1.3,
        }}>{name}</div>
        <div style={{
          fontSize: "clamp(9px, 2.5vw, 10px)", color: `${color}bb`,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          marginTop: 2, letterSpacing: "0.04em",
        }}>{sub}</div>
      </div>
      <div style={{
        position: "absolute", top: 8, right: 8,
        width: "clamp(4px, 1.5vw, 5px)", height: "clamp(4px, 1.5vw, 5px)",
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 6px ${color}`,
        opacity: hov ? 1 : 0.3,
        transition: "opacity 0.2s",
      }} />
    </motion.div>
  );
};

/* ══════════════════════════════════════════
   STAT BADGE (Responsive)
══════════════════════════════════════════ */
const StatBadge: React.FC<{ value: string; label: string; color: string; delay: number; inView: boolean }> = ({
  value, label, color, delay, inView,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={inView ? { opacity: 1, scale: 1 } : {}}
    transition={{ delay, duration: 0.4, type: "spring", stiffness: 120 }}
    style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px)", borderRadius: 10,
      background: `${color}0d`,
      border: `1px solid ${color}25`,
    }}
  >
    <span style={{
      fontSize: "clamp(18px, 5vw, 22px)", fontWeight: 800,
      fontFamily: "'Syne', sans-serif",
      color,
      lineHeight: 1,
    }}>{value}</span>
    <span style={{
      fontSize: "clamp(8px, 2.5vw, 9px)", letterSpacing: "0.12em", textTransform: "uppercase",
      color: "rgba(255,255,255,0.3)",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      marginTop: 4,
      textAlign: "center",
    }}>{label}</span>
  </motion.div>
);

/* ══════════════════════════════════════════
   ABOUT COMPONENT (Fully Mobile Responsive)
══════════════════════════════════════════ */
export const About: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const h = (e: MouseEvent) => setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  const logEntries = [
    {
      icon: "👨‍🚀",
      text: (
        <>
          Crew member <strong style={{ color: "#6EE7B7" }}>Sithum</strong> — full-stack developer &
          Android engineer. Passionate about intuitive, high-performance applications.
        </>
      ),
    },
    {
      icon: "⚙️",
      text: (
        <>
          Core systems:{" "}
          <span style={{ color: "#F97316", fontWeight: 600 }}>Java</span>,{" "}
          <span style={{ color: "#38BDF8", fontWeight: 600 }}>React.js</span>,{" "}
          <span style={{ color: "#86EFAC", fontWeight: 600 }}>Spring Boot</span>,{" "}
          <span style={{ color: "#C4B5FD", fontWeight: 600 }}>Android / Kotlin</span>.
          Specialises in scalable desktop, web &amp; mobile solutions.
        </>
      ),
    },
    {
      icon: "🛰️",
      text: (
        <>
          Missions completed: <strong style={{ color: "rgba(255,255,255,0.8)" }}>POS systems</strong>,{" "}
          <strong style={{ color: "rgba(255,255,255,0.8)" }}>tour rental platforms</strong>, and{" "}
          <strong style={{ color: "rgba(255,255,255,0.8)" }}>music streaming apps</strong>.
          Enjoys tackling complex challenges and delivering impactful software.
        </>
      ),
    },
    {
      icon: "✦",
      text: (
        <>
          Directive: clean code, peak performance, seamless UX. Staying on the
          cutting edge of the galaxy's latest tech trends.
        </>
      ),
    },
  ];

  const capabilities = [
    { icon: FaJava,      name: "Enterprise Apps",    sub: "Backend",  color: "#F97316" },
    { icon: SiAndroid,   name: "Android Dev",         sub: "Mobile",   color: "#C4B5FD" },
    { icon: FaJs,        name: "Web Dev",             sub: "Frontend", color: "#FCD34D" },
    { icon: FaDatabase,  name: "Database Mgmt",       sub: "Systems",  color: "#38BDF8" },
    { icon: FaReact,     name: "UI / UX Design",      sub: "Design",   color: "#6EE7B7" },
    { icon: FaGithub,    name: "Version Control",     sub: "DevOps",   color: "#E2E8F0" },
    { icon: SiSpringboot,name: "Spring Boot",         sub: "Backend",  color: "#86EFAC" },
    { icon: SiKotlin,    name: "Kotlin",              sub: "Mobile",   color: "#C084FC" },
  ];

  return (
    <section
      style={{
        background: "#03060F",
        padding: "clamp(3rem, 8vw, 5rem) clamp(1rem, 4vw, 1.5rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        @keyframes shimmer   { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes orbit-cw  { to { transform: translate(-50%,-50%) rotate(360deg)  } }
        @keyframes orbit-ccw { to { transform: translate(-50%,-50%) rotate(-360deg) } }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.5 }
          100% { transform: scale(1.6); opacity: 0   }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        /* Responsive grid */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(2rem, 5vw, 3rem);
          align-items: start;
        }
        @media (min-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr 1.15fr;
            gap: 3rem;
          }
        }

        /* Avatar + stats row */
        .avatar-stats-row {
          display: flex;
          gap: clamp(1rem, 4vw, 1.5rem);
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
        }
        .stats-badge-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          min-width: 130px;
        }
        @media (max-width: 480px) {
          .stats-badge-group {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
          }
          .stats-badge-group > div {
            flex: 1 1 auto;
            min-width: 90px;
          }
        }

        /* Capabilities grid */
        .capabilities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: clamp(8px, 2vw, 10px);
        }
        @media (max-width: 380px) {
          .capabilities-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* Mission log */
        .mission-log {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      `}</style>

      <StarfieldCanvas mx={mouse.x} my={mouse.y} />

      {/* Spotlight */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: `radial-gradient(650px circle at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(110,231,183,0.05) 0%, transparent 65%)`,
      }} />

      <div ref={ref} style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto" }}>

        {/* ── SECTION HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "clamp(2rem, 6vw, 3rem)", textAlign: "center" }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(110,231,183,0.06)",
            border: "1px solid rgba(110,231,183,0.15)",
            borderRadius: 99, padding: "4px 14px",
            marginBottom: 14,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%", background: "#6EE7B7",
              boxShadow: "0 0 6px #6EE7B7",
              animation: "blink 2s ease-in-out infinite",
              display: "inline-block",
            }} />
            <span style={{
              fontSize: "clamp(9px, 2.5vw, 10px)", letterSpacing: "0.2em", textTransform: "uppercase",
              color: "rgba(110,231,183,0.7)", fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
            }}>CREW FILE · CLASSIFICATION: PUBLIC</span>
          </div>

          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            background: "linear-gradient(135deg,#6EE7B7 0%,#38BDF8 50%,#C4B5FD 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            margin: 0,
          }}>
            Mission Dossier
          </h2>
        </motion.div>

        {/* ── MAIN GRID ── */}
        <div className="about-grid">

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(1.5rem, 4vw, 2rem)" }}>

            {/* Avatar + stats row */}
            <div className="avatar-stats-row">
              <AstronautAvatar />
              <div className="stats-badge-group">
                <StatBadge value="3+" label="Years active"   color="#6EE7B7" delay={0.3} inView={inView} />
                <StatBadge value="10+" label="Projects built" color="#38BDF8" delay={0.4} inView={inView} />
                <StatBadge value="8"  label="Core systems"   color="#C4B5FD" delay={0.5} inView={inView} />
              </div>
            </div>

            {/* Mission log */}
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                marginBottom: 12,
              }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(110,231,183,0.1)" }} />
                <span style={{
                  fontSize: "clamp(8px, 2.5vw, 9px)", letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "rgba(110,231,183,0.35)", fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                }}>MISSION LOG</span>
                <div style={{ flex: 1, height: "1px", background: "rgba(110,231,183,0.1)" }} />
              </div>

              <div className="mission-log">
                {logEntries.map((entry, i) => (
                  <LogEntry
                    key={i}
                    index={i}
                    text={entry.text}
                    icon={entry.icon}
                    delay={0.2 + i * 0.1}
                    inView={inView}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Capabilities ── */}
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
            }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(110,231,183,0.1)" }} />
              <span style={{
                fontSize: "clamp(8px, 2.5vw, 9px)", letterSpacing: "0.2em", textTransform: "uppercase",
                color: "rgba(110,231,183,0.35)", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
              }}>ONBOARD SYSTEMS</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(110,231,183,0.1)" }} />
            </div>

            <div className="capabilities-grid">
              {capabilities.map((cap, idx) => (
                <CapabilityCard
                  key={cap.name}
                  {...cap}
                  delay={0.15 + idx * 0.07}
                  inView={inView}
                />
              ))}
            </div>

            {/* Transmission footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.9, duration: 0.6 }}
              style={{
                marginTop: "clamp(18px, 4vw, 20px)",
                padding: "clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)",
                borderRadius: 8,
                background: "rgba(110,231,183,0.03)",
                border: "1px solid rgba(110,231,183,0.08)",
                display: "flex", alignItems: "center", gap: "clamp(8px, 2vw, 10px)",
                flexWrap: "wrap",
              }}
            >
              <div style={{
                width: 8, height: 8, borderRadius: "50%", background: "#6EE7B7",
                boxShadow: "0 0 8px #6EE7B7",
                animation: "blink 1.8s ease-in-out infinite", flexShrink: 0,
              }} />
              <p style={{
                fontSize: "clamp(10px, 2.5vw, 11px)", color: "rgba(255,255,255,0.3)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                margin: 0, lineHeight: 1.5, letterSpacing: "0.03em",
                flex: 1,
              }}>
                All systems operational · Open to new missions &amp; collaborations ·{" "}
                <span style={{ color: "rgba(110,231,183,0.5)" }}>Let's build something amazing together</span>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};