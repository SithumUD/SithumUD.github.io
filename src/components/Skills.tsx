import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FaJava, FaHtml5, FaCss3Alt, FaJs, FaReact, FaGithub,
  FaDatabase, FaNodeJs, FaPaintBrush, FaAws, FaDocker,
  FaNetworkWired, FaRobot,
} from "react-icons/fa";
import {
  SiAndroid, SiMysql, SiFirebase, SiSpringboot, SiSharp,
  SiDotnet, SiPostgresql, SiGooglecloud, SiDigitalocean, SiCloudflare,
} from "react-icons/si";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface SkillDef {
  name: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  category: string;
  description: string;
}

interface StarData {
  id: number;
  skill: SkillDef;
  x: number; // percent
  y: number; // percent
  size: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
}

/* ─────────────────────────────────────────
   SKILLS DATA
───────────────────────────────────────── */
const skillsData: SkillDef[] = [
  { name: "Java",          icon: FaJava,         category: "Backend",   description: "Object-oriented programming for backend and Android" },
  { name: "C#",            icon: SiSharp,        category: "Backend",   description: "Backend & desktop apps with .NET ecosystem" },
  { name: "Spring Boot",   icon: SiSpringboot,   category: "Backend",   description: "Java framework for microservices & REST APIs" },
  { name: ".NET Core",     icon: SiDotnet,       category: "Backend",   description: "Cross-platform backend development" },
  { name: "Node.js",       icon: FaNodeJs,       category: "Backend",   description: "JavaScript runtime for scalable backend" },
  { name: "HTML5",         icon: FaHtml5,        category: "Frontend",  description: "Markup language for web structure" },
  { name: "CSS3",          icon: FaCss3Alt,      category: "Frontend",  description: "Styling and responsive design" },
  { name: "JavaScript",    icon: FaJs,           category: "Frontend",  description: "Dynamic web & full-stack development" },
  { name: "React.js",      icon: FaReact,        category: "Frontend",  description: "UI library for SPAs & interactive dashboards" },
  { name: "UI/UX Design",  icon: FaPaintBrush,   category: "Frontend",  description: "User-centered design, wireframing, prototyping" },
  { name: "Android",       icon: SiAndroid,      category: "Mobile",    description: "Native Android development (Java/Kotlin)" },
  { name: "React Native",  icon: FaReact,        category: "Mobile",    description: "Cross-platform mobile apps using React" },
  { name: "SQL",           icon: FaDatabase,     category: "Database",  description: "Relational DB design & queries" },
  { name: "PostgreSQL",    icon: SiPostgresql,   category: "Database",  description: "Advanced open-source relational DB" },
  { name: "MySQL",         icon: SiMysql,        category: "Database",  description: "Popular relational DB" },
  { name: "Firebase",      icon: SiFirebase,     category: "Database",  description: "Real-time DB & backend services" },
  { name: "AWS",           icon: FaAws,          category: "Cloud",     description: "EC2, S3, Lambda, RDS, and more" },
  { name: "Google Cloud",  icon: SiGooglecloud,  category: "Cloud",     description: "App Engine, Cloud Run, Firestore, GKE" },
  { name: "DigitalOcean",  icon: SiDigitalocean, category: "Cloud",     description: "Droplets, Kubernetes, App Platform" },
  { name: "Cloudflare",    icon: SiCloudflare,   category: "Cloud",     description: "CDN, DNS, DDoS protection, Workers" },
  { name: "Docker",        icon: FaDocker,       category: "DevOps",    description: "Containerization & reproducible deployments" },
  { name: "Git",           icon: FaGithub,       category: "DevOps",    description: "Version control & collaboration" },
  { name: "REST APIs",     icon: FaNetworkWired, category: "API",       description: "Design & consume RESTful services" },
  { name: "Postman",       icon: FaDatabase,     category: "API",       description: "API testing, automation, documentation" },
  { name: "AI / LLM",      icon: FaRobot,        category: "AI",        description: "Integrate LLMs, OpenAI, or custom bots" },
];

/* ─────────────────────────────────────────
   CATEGORY CONFIG
───────────────────────────────────────── */
const CAT_CONFIG: Record<string, { color: string; glow: string; badge: string; badgeText: string }> = {
  Backend:  { color: "#60A5FA", glow: "rgba(96,165,250,0.6)",   badge: "rgba(96,165,250,0.15)",  badgeText: "#93C5FD" },
  Frontend: { color: "#A78BFA", glow: "rgba(167,139,250,0.6)",  badge: "rgba(167,139,250,0.15)", badgeText: "#C4B5FD" },
  Mobile:   { color: "#FBBF24", glow: "rgba(251,191,36,0.6)",   badge: "rgba(251,191,36,0.15)",  badgeText: "#FDE68A" },
  Database: { color: "#34D399", glow: "rgba(52,211,153,0.6)",   badge: "rgba(52,211,153,0.15)",  badgeText: "#6EE7B7" },
  Cloud:    { color: "#22D3EE", glow: "rgba(34,211,238,0.6)",   badge: "rgba(34,211,238,0.15)",  badgeText: "#67E8F9" },
  DevOps:   { color: "#FB923C", glow: "rgba(251,146,60,0.6)",   badge: "rgba(251,146,60,0.15)",  badgeText: "#FDBA74" },
  API:      { color: "#F472B6", glow: "rgba(244,114,182,0.6)",  badge: "rgba(244,114,182,0.15)", badgeText: "#F9A8D4" },
  AI:       { color: "#E2E8F0", glow: "rgba(226,232,240,0.6)",  badge: "rgba(226,232,240,0.1)",  badgeText: "#F1F5F9" },
};

/* ─────────────────────────────────────────
   BACKGROUND CANVAS (ambient stars + nebulae)
───────────────────────────────────────── */
const BackgroundCanvas: React.FC<{ containerRef: React.RefObject<HTMLDivElement> }> = ({ containerRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const ambientStars = useMemo(() =>
    Array.from({ length: 160 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 0.9 + 0.15,
      a: Math.random() * 0.45 + 0.08,
      ts: 0.003 + Math.random() * 0.008,
      to: Math.random() * Math.PI * 2,
      col: Math.random() > 0.88 ? (Math.random() > 0.5 ? "#93C5FD" : "#C4B5FD") : "#ffffff",
    })), []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d")!;
    let t = 0;

    const resize = () => {
      canvas.width = container.offsetWidth * devicePixelRatio;
      canvas.height = container.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const NEBULAE = [
      { x: 0.12, y: 0.2,  r: 0.32, c: "rgba(110,231,183,0.03)"  },
      { x: 0.82, y: 0.65, r: 0.28, c: "rgba(147,197,253,0.028)" },
      { x: 0.52, y: 0.08, r: 0.24, c: "rgba(196,181,253,0.026)" },
      { x: 0.3,  y: 0.85, r: 0.2,  c: "rgba(249,115,22,0.018)"  },
      { x: 0.68, y: 0.42, r: 0.18, c: "rgba(34,211,238,0.02)"   },
    ];

    const draw = () => {
      const W = container.offsetWidth;
      const H = container.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const { x: mx, y: my } = mouseRef.current;
      const px = (mx - 0.5) * 18, py = (my - 0.5) * 12;

      NEBULAE.forEach(n => {
        const gx = n.x * W + Math.sin(t * 0.0003 + n.x * 5) * 24 - px * 0.3;
        const gy = n.y * H + Math.cos(t * 0.00025 + n.y * 5) * 16 - py * 0.3;
        const gr = n.r * Math.max(W, H);
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        g.addColorStop(0, n.c);
        g.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(gx, gy, gr, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      for (const s of ambientStars) {
        const tw = Math.sin(t * s.ts + s.to) * 0.3 + 0.7;
        const sx = s.x * W + px * s.r * 0.4;
        const sy = s.y * H + py * s.r * 0.4;
        ctx.save();
        ctx.globalAlpha = s.a * tw;
        if (s.r > 0.7) {
          ctx.strokeStyle = s.col;
          ctx.lineWidth = 0.4;
          ctx.globalAlpha = s.a * tw * 0.28;
          ctx.beginPath(); ctx.moveTo(sx - s.r * 2.5, sy); ctx.lineTo(sx + s.r * 2.5, sy); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(sx, sy - s.r * 2.5); ctx.lineTo(sx, sy + s.r * 2.5); ctx.stroke();
          ctx.globalAlpha = s.a * tw;
        }
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.r * 2);
        sg.addColorStop(0, s.col);
        sg.addColorStop(1, "transparent");
        ctx.fillStyle = sg;
        ctx.beginPath(); ctx.arc(sx, sy, s.r * 2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      t++;
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [ambientStars, containerRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
    />
  );
};

/* ─────────────────────────────────────────
   TOOLTIP CARD
───────────────────────────────────────── */
interface TooltipProps {
  skill: SkillDef;
  x: number;
  y: number;
  containerW: number;
  containerH: number;
}

const SkillTooltip: React.FC<TooltipProps> = ({ skill, x, y, containerW, containerH }) => {
  const cfg = CAT_CONFIG[skill.category] || CAT_CONFIG.AI;
  const Icon = skill.icon;

  const W = 200, H = 110;
  let left = x + 16;
  let top  = y - H / 2;
  if (left + W > containerW - 8) left = x - W - 16;
  if (top < 8) top = 8;
  if (top + H > containerH - 8) top = containerH - H - 8;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: 6 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "absolute",
        left, top, width: W,
        zIndex: 50,
        background: "rgba(8,14,30,0.92)",
        border: `1px solid ${cfg.color}40`,
        borderRadius: 12,
        padding: "12px 14px",
        pointerEvents: "none",
        backdropFilter: "blur(12px)",
        boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${cfg.glow}30`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 7 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: cfg.badge,
          border: `1px solid ${cfg.color}40`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon size={16} style={{ color: cfg.color }} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>{skill.name}</div>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
            textTransform: "uppercase", color: cfg.badgeText,
            background: cfg.badge, border: `1px solid ${cfg.color}40`,
            borderRadius: 99, padding: "1px 6px", display: "inline-block", marginTop: 2,
          }}>
            {skill.category}
          </span>
        </div>
      </div>
      <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.45 }}>
        {skill.description}
      </div>
      {/* Corner accent */}
      <div style={{
        position: "absolute", top: -1, right: 12, width: 40, height: 1,
        background: `linear-gradient(90deg, transparent, ${cfg.color}80, transparent)`,
      }} />
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   SKILL STAR
───────────────────────────────────────── */
interface SkillStarProps {
  star: StarData;
  isHovered: boolean;
  isOtherHovered: boolean;
  onHover: (id: number | null, x: number, y: number) => void;
}

const SkillStar: React.FC<SkillStarProps> = ({ star, isHovered, isOtherHovered, onHover }) => {
  const cfg = CAT_CONFIG[star.skill.category] || CAT_CONFIG.AI;
  const Icon = star.skill.icon;
  const rafRef = useRef(0);
  const dotRef = useRef<HTMLDivElement>(null);

  // CSS keyframe twinkle via inline animation
  const animName = `twinkle_${star.id}`;

  return (
    <>
      <style>{`
        @keyframes ${animName} {
          0%,100% { opacity: ${star.size > 5 ? 0.85 : 0.6}; transform: scale(1); }
          50%      { opacity: 1; transform: scale(${star.size > 5 ? 1.12 : 1.08}); }
        }
      `}</style>
      <div
        onMouseEnter={(e) => {
          const rect = (e.currentTarget.closest(".skills-universe") as HTMLElement)?.getBoundingClientRect();
          const el = e.currentTarget.getBoundingClientRect();
          const x = el.left + el.width / 2 - (rect?.left ?? 0);
          const y = el.top + el.height / 2 - (rect?.top ?? 0);
          onHover(star.id, x, y);
        }}
        onMouseLeave={() => onHover(null, 0, 0)}
        style={{
          position: "absolute",
          left: `${star.x}%`,
          top: `${star.y}%`,
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          zIndex: isHovered ? 20 : 5,
          transition: "opacity 0.3s",
          opacity: isOtherHovered ? 0.25 : 1,
        }}
      >
        {/* Outer glow ring on hover */}
        <div style={{
          position: "absolute",
          width: star.size * 5,
          height: star.size * 5,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${cfg.glow}${isHovered ? "50" : "00"} 0%, transparent 70%)`,
          transition: "background 0.25s",
          pointerEvents: "none",
        }} />

        {/* The star dot */}
        <div
          ref={dotRef}
          style={{
            width: isHovered ? star.size * 3.5 : star.size * 2,
            height: isHovered ? star.size * 3.5 : star.size * 2,
            borderRadius: "50%",
            background: cfg.color,
            boxShadow: isHovered
              ? `0 0 ${star.size * 4}px ${cfg.color}, 0 0 ${star.size * 8}px ${cfg.glow}`
              : `0 0 ${star.size * 2}px ${cfg.color}bb`,
            animation: isHovered ? "none" : `${animName} ${star.twinkleSpeed}s ${star.twinkleOffset}s ease-in-out infinite`,
            transition: "width 0.2s, height 0.2s, box-shadow 0.2s",
            flexShrink: 0,
            position: "relative",
            zIndex: 2,
          }}
        />

        {/* Cross sparkle for larger stars */}
        {star.size > 4.5 && !isHovered && (
          <div style={{ position: "absolute", pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: star.size * 10, height: 0.7, background: `linear-gradient(90deg,transparent,${cfg.color}60,transparent)` }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%) rotate(90deg)", width: star.size * 10, height: 0.7, background: `linear-gradient(90deg,transparent,${cfg.color}60,transparent)` }} />
          </div>
        )}

        {/* Icon + label — shown on hover */}
        <div style={{
          position: "absolute",
          top: "100%",
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.2s",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: "rgba(8,14,30,0.9)",
            border: `1px solid ${cfg.color}50`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon size={14} style={{ color: cfg.color }} />
          </div>
        </div>

        {/* Skill name label — always faintly visible */}
        <div style={{
          position: "absolute",
          top: `calc(100% + ${star.size + 4}px)`,
          fontSize: 10,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: isHovered ? "#fff" : "rgba(255,255,255,0.35)",
          whiteSpace: "nowrap",
          letterSpacing: "0.03em",
          transition: "color 0.2s, font-size 0.2s",
          pointerEvents: "none",
          userSelect: "none",
        }}>
          {star.skill.name}
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────
   LEGEND
───────────────────────────────────────── */
const Legend: React.FC<{ activeFilter: string | null; onFilter: (cat: string | null) => void }> = ({ activeFilter, onFilter }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
    {Object.entries(CAT_CONFIG).map(([cat, cfg]) => (
      <button
        key={cat}
        onClick={() => onFilter(activeFilter === cat ? null : cat)}
        style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "4px 12px", borderRadius: 99,
          background: activeFilter === cat ? cfg.badge : "rgba(255,255,255,0.04)",
          border: `1px solid ${activeFilter === cat ? cfg.color + "60" : "rgba(255,255,255,0.08)"}`,
          color: activeFilter === cat ? cfg.badgeText : "rgba(255,255,255,0.45)",
          fontSize: 11, fontFamily: "'Plus Jakarta Sans', sans-serif",
          cursor: "pointer", transition: "all 0.18s", letterSpacing: "0.02em",
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
        {cat}
      </button>
    ))}
  </div>
);

/* ─────────────────────────────────────────
   MAIN SKILLS COMPONENT
───────────────────────────────────────── */

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function generateStarPositions(skills: SkillDef[]): StarData[] {
  const placed: { x: number; y: number }[] = [];
  const MIN_DIST = 9; // percent

  return skills.map((skill, i) => {
    const cfg = CAT_CONFIG[skill.category] || CAT_CONFIG.AI;
    let x = 0, y = 0, tries = 0;
    do {
      x = 5 + seededRandom(i * 7 + tries * 3) * 90;
      y = 6 + seededRandom(i * 13 + tries * 5 + 1) * 82;
      tries++;
    } while (tries < 60 && placed.some(p => Math.hypot(p.x - x, p.y - y) < MIN_DIST));
    placed.push({ x, y });

    return {
      id: i,
      skill,
      x, y,
      size: 3 + seededRandom(i * 17) * 3,
      twinkleSpeed: 2.5 + seededRandom(i * 11) * 3,
      twinkleOffset: seededRandom(i * 19) * 2,
      color: cfg.color,
    };
  });
}

export const Skills: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05, rootMargin: "60px" });
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({ w: 800, h: 480 });

  const stars = useMemo(() => generateStarPositions(skillsData), []);

  const visibleStars = useMemo(
    () => activeFilter ? stars.filter(s => s.skill.category === activeFilter) : stars,
    [stars, activeFilter]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    setContainerSize({ w: el.offsetWidth, h: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  const handleHover = useCallback((id: number | null, x: number, y: number) => {
    setHoveredId(id);
    if (id !== null) setTooltipPos({ x, y });
  }, []);

  const hoveredStar = hoveredId !== null ? stars.find(s => s.id === hoveredId) : null;

  // Spotlight effect
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--spot-x", `${x}%`);
      el.style.setProperty("--spot-y", `${y}%`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      style={{ background: "#03060F", padding: "5rem 1.5rem", position: "relative", overflow: "hidden" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            fontWeight: 800,
            textAlign: "center",
            marginBottom: "0.4rem",
            letterSpacing: "-0.02em",
            background: "linear-gradient(135deg,#6EE7B7 0%,#38BDF8 50%,#C4B5FD 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Technical Skills
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            textAlign: "center", color: "rgba(255,255,255,0.3)",
            fontSize: 12, letterSpacing: "0.12em", marginBottom: "1.5rem",
            fontFamily: "'Plus Jakarta Sans', sans-serif", textTransform: "uppercase",
          }}
        >
          Hover any star to explore
        </motion.p>

        {/* Legend / Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ marginBottom: "1.25rem" }}
        >
          <Legend activeFilter={activeFilter} onFilter={setActiveFilter} />
        </motion.div>

        {/* Universe */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="skills-universe"
          style={{
            position: "relative",
            width: "100%",
            height: "clamp(380px, 50vw, 500px)",
            borderRadius: 16,
            background: "#03060F",
            border: "1px solid rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}
        >
          {/* Animated background */}
          <BackgroundCanvas containerRef={containerRef} />

          {/* Spotlight */}
          <div
            style={{
              position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
              background: "radial-gradient(500px circle at var(--spot-x,50%) var(--spot-y,50%), rgba(110,231,183,0.04) 0%, transparent 65%)",
            }}
          />

          {/* Stars */}
          <div style={{ position: "absolute", inset: 0, zIndex: 3 }}>
            <AnimatePresence>
              {visibleStars.map(star => (
                <SkillStar
                  key={star.id}
                  star={star}
                  isHovered={hoveredId === star.id}
                  isOtherHovered={hoveredId !== null && hoveredId !== star.id}
                  onHover={handleHover}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Tooltip */}
          <AnimatePresence>
            {hoveredStar && (
              <SkillTooltip
                key={hoveredStar.id}
                skill={hoveredStar.skill}
                x={tooltipPos.x}
                y={tooltipPos.y}
                containerW={containerSize.w}
                containerH={containerSize.h}
              />
            )}
          </AnimatePresence>

          {/* Bottom fade */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 40, zIndex: 4, pointerEvents: "none",
            background: "linear-gradient(to top, #03060F 0%, transparent 100%)",
          }} />
        </motion.div>

        {/* Count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            textAlign: "center", fontSize: 11, marginTop: "0.75rem",
            color: "rgba(255,255,255,0.2)",
            fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.08em",
          }}
        >
          {visibleStars.length} skill{visibleStars.length !== 1 ? "s" : ""}
          {activeFilter ? ` in ${activeFilter}` : " across 8 categories"}
        </motion.p>
      </div>
    </section>
  );
};