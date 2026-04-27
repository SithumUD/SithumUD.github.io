import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ExternalLink, Github } from "lucide-react";

/* ══════════════════════════════════════════
   STARFIELD CANVAS (reduced on mobile)
══════════════════════════════════════════ */
const StarfieldCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const stars = useMemo(() => {
    const count = isMobile ? 70 : 130;
    return Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.3 + 0.2,
      a: Math.random() * 0.65 + 0.15,
      ts: 0.004 + Math.random() * 0.009,
      to: Math.random() * Math.PI * 2,
      col: Math.random() > 0.85 ? (Math.random() > 0.5 ? "#93C5FD" : "#C4B5FD") : "#ffffff",
    }));
  }, [isMobile]);

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
      const { x: mx, y: my } = mouseRef.current;
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
      for (const s of stars) {
        const tw = Math.sin(t * s.ts + s.to) * 0.35 + 0.65;
        const sx = s.x * W + px * s.r * 0.5;
        const sy = s.y * H + py * s.r * 0.5;
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
        ctx.fillStyle = sg; ctx.beginPath();
        ctx.arc(sx, sy, s.r * 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      t++; raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf.current); };
  }, [stars]);

  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }} />;
};

/* ══════════════════════════════════════════
   PROJECT DATA
══════════════════════════════════════════ */
const CAT_CONFIG: Record<string, { color: string; glow: string; badge: string; label: string; prefix: string; orbit: number; speed: number; size: number }> = {
  "web application":     { color: "#38BDF8", glow: "rgba(56,189,248,0.55)",   badge: "rgba(56,189,248,0.12)",   label: "Web App",     prefix: "WEB", orbit: 0,   speed: 0.0012, size: 34 },
  "android application": { color: "#C4B5FD", glow: "rgba(196,181,253,0.55)", badge: "rgba(196,181,253,0.12)", label: "Android App", prefix: "MOB", orbit: 0,   speed: 0.002,  size: 30 },
};

const projectsData = [
  {
    id: 1,
    title: "POS & Inventory System",
    description: "A full-stack system to manage point of sale and inventory with JWT authentication and real-time data.",
    image: "pos.png",
    technologies: ["Java", "Spring Boot", "React.js", "Tailwind CSS", "JWT Auth", "MySQL"],
    category: "web application",
    githubUrl: "https://github.com/SithumUD/pos-system.git",
  },
  {
    id: 2,
    title: "Hotel Website",
    description: "A hotel booking platform with a clean, user-friendly interface and responsive design.",
    image: "jjvilla-thumb-pic.png",
    technologies: ["React.js", "HTML", "Tailwind CSS", "JavaScript"],
    category: "web application",
    liveUrl: "https://jjvilla.netlify.app/",
    githubUrl: "https://github.com/SithumUD/jjvilla-hotel.git",
  },
  {
    id: 3,
    title: "Tour Booking Platform",
    description: "A platform for renting tours and booking activities online with a robust backend.",
    image: "tourbooking.png",
    technologies: ["Java", "Spring Boot", "React.js", "Tailwind CSS", "Bootstrap", "MySQL"],
    category: "web application",
    githubUrl: "https://github.com/SithumUD/EAD2-CW.git",
  },
  {
    id: 4,
    title: "Melomind — Music & Podcast App",
    description: "An Android app to listen to podcasts and music on the go with Firebase backend.",
    image: "melomind.png",
    technologies: ["Java", "Kotlin", "Android Studio", "Firebase"],
    category: "android application",
    githubUrl: "https://github.com/SithumUD/Melomind-Android-App.git",
  },
  {
    id: 5,
    title: "TipTap — Tip Calculator",
    description: "A simple and elegant Android app to calculate tips and split the bill among friends.",
    image: "tiptap-project.png",
    technologies: ["Java", "Android Studio"],
    category: "android application",
    githubUrl: "https://github.com/SithumUD/TipTap-Tip-Calculator-.git",
  },
  {
    id: 6,
    title: "WeatherX Dashboard",
    description: "A live weather dashboard displaying forecasts for any city using the OpenWeather API.",
    image: "/weatherx.png",
    technologies: ["React.js", "OpenWeather API", "Tailwind CSS", "JavaScript"],
    category: "web application",
    liveUrl: "https://weatherxxxx.netlify.app/",
    githubUrl: "https://github.com/SithumUD/weather-x.git",
  },
  {
    id: 7,
    title: "HangWord — Hangman Game",
    description: "Interactive Hangman game with a fun responsive interface built with React.",
    image: "/hangman.png",
    technologies: ["React.js", "HTML", "Tailwind CSS", "JavaScript"],
    category: "web application",
    liveUrl: "https://hangword.netlify.app/",
    githubUrl: "https://github.com/SithumUD/hangman-game.git",
  },
  {
    id: 8,
    title: "TaskFlow — To-Do List",
    description: "A slick and intuitive to-do list web app for streamlined task management.",
    image: "/taskflow.png",
    technologies: ["React", "HTML", "Tailwind CSS", "JavaScript"],
    category: "web application",
    liveUrl: "https://taskflor.netlify.app/",
    githubUrl: "https://github.com/SithumUD/Todo-List-Website.git",
  },
  {
    id: 9,
    title: "JobPrep — Interview Platform",
    description: "Job and interview preparation site with practice questions, progress tracking, and smooth UI.",
    image: "/jobprep.png",
    technologies: ["React Js", "Tailwind CSS", "Firebase"],
    category: "web application",
    liveUrl: "https://jobprepp.netlify.app/",
    githubUrl: "https://github.com/SithumUD/question-bank-web.git",
  },
];

/* ══════════════════════════════════════════
   ORBIT RADII — dynamic based on screen width
══════════════════════════════════════════ */
const getOrbitRadii = (isMobile: boolean) => ({
  "web application":     { base: isMobile ? 0.28 : 0.36, label: "Web Orbit" },
  "android application": { base: isMobile ? 0.16 : 0.20, label: "Mobile Orbit" },
});

/* ══════════════════════════════════════════
   DOSSIER PANEL (Responsive: stack on mobile)
══════════════════════════════════════════ */
interface DossierPanelProps {
  project: typeof projectsData[0] | null;
  locked: boolean;
}

const DossierPanel: React.FC<DossierPanelProps> = ({ project, locked }) => {
  if (!project) {
    return (
      <div style={{
        padding: "clamp(16px, 4vw, 24px) clamp(16px, 5vw, 28px)",
        display: "flex", alignItems: "center", gap: 14,
        minHeight: 100,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "1px solid rgba(110,231,183,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            border: "1px solid rgba(110,231,183,0.3)",
          }} />
        </div>
        <div>
          <p style={{
            fontSize: "clamp(10px, 3vw, 11px)", letterSpacing: "0.16em", textTransform: "uppercase",
            color: "rgba(110,231,183,0.25)",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600, margin: 0,
          }}>AWAITING TARGET LOCK</p>
          <p style={{
            fontSize: "clamp(11px, 3vw, 12px)", color: "rgba(255,255,255,0.2)",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            margin: "4px 0 0",
          }}>Tap a planet to scan dossier</p>
        </div>
      </div>
    );
  }

  const cfg = CAT_CONFIG[project.category] || CAT_CONFIG["web application"];
  const catProjects = projectsData.filter(p => p.category === project.category);
  const catIdx = catProjects.findIndex(p => p.id === project.id) + 1;
  const missionId = `${cfg.prefix}-${String(catIdx).padStart(3, "0")}`;

  const isMobile = window.innerWidth < 640;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={project.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        style={{ padding: "clamp(16px, 4vw, 20px) clamp(16px, 5vw, 28px)" }}
      >
        {/* Responsive layout: column on mobile, row on desktop */}
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "center" : "flex-start",
          gap: isMobile ? 16 : 20,
        }}>
          {/* Image thumbnail */}
          <div style={{
            width: isMobile ? 100 : 100, height: 68, borderRadius: 8, overflow: "hidden", flexShrink: 0,
            border: `1px solid ${cfg.color}30`,
            position: "relative",
          }}>
            <img
              src={project.image}
              alt={project.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(135deg, ${cfg.color}22, transparent)`,
            }} />
          </div>

          {/* Info block */}
          <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 6,
              flexWrap: "wrap",
            }}>
              <span style={{
                width: 4, height: 4, borderRadius: "50%",
                background: cfg.color, boxShadow: `0 0 5px ${cfg.color}`,
                display: "inline-block",
                animation: "blink-proj 2s step-end infinite",
                flexShrink: 0,
              }} />
              <span style={{
                fontSize: "clamp(8px, 2.5vw, 9px)", letterSpacing: "0.2em", textTransform: "uppercase",
                color: `${cfg.color}99`,
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
              }}>
                {missionId} · {cfg.label.toUpperCase()} · {locked ? "TARGET LOCKED" : "SCANNING"}
              </span>
            </div>

            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(16px, 4vw, 18px)", fontWeight: 800,
              color: "rgba(255,255,255,0.92)",
              margin: "0 0 6px", letterSpacing: "-0.01em", lineHeight: 1.2,
            }}>
              {project.title}
            </h3>

            <p style={{
              fontSize: "clamp(11px, 3vw, 12px)", lineHeight: 1.5,
              color: "rgba(255,255,255,0.4)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: "0 0 12px",
            }}>
              {project.description}
            </p>

            {/* Tech pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
              {project.technologies.slice(0, 4).map(tech => (
                <span key={tech} style={{
                  padding: "3px 9px", borderRadius: 6,
                  fontSize: "clamp(9px, 2.5vw, 10px)", fontWeight: 600,
                  background: cfg.badge,
                  border: `1px solid ${cfg.color}30`,
                  color: cfg.color,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  letterSpacing: "0.03em",
                }}>
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span style={{
                  padding: "3px 9px", borderRadius: 6,
                  fontSize: "clamp(9px, 2.5vw, 10px)", fontWeight: 600,
                  background: cfg.badge,
                  border: `1px solid ${cfg.color}30`,
                  color: cfg.color,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>

            {/* Links */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    fontSize: "clamp(10px, 2.5vw, 11.5px)", fontWeight: 600,
                    color: cfg.color,
                    textDecoration: "none",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    letterSpacing: "0.04em",
                    padding: "6px 14px", borderRadius: 8,
                    border: `1px solid ${cfg.color}40`,
                    background: cfg.badge,
                    transition: "all 0.18s",
                    touchAction: "manipulation",
                  }}
                >
                  <ExternalLink size={12} />
                  Live Demo
                </a>
              )}
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  fontSize: "clamp(10px, 2.5vw, 11.5px)", fontWeight: 600,
                  color: "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  letterSpacing: "0.04em",
                  padding: "6px 14px", borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                  transition: "all 0.18s",
                  touchAction: "manipulation",
                }}
              >
                <Github size={12} />
                Source Code
              </a>

              {!locked && (
                <span style={{
                  fontSize: "clamp(9px, 2.5vw, 10px)", color: "rgba(255,255,255,0.2)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  display: "flex", alignItems: "center", marginLeft: 4,
                }}>
                  · tap to lock
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════
   ORBIT MAP CANVAS — responsive rings
══════════════════════════════════════════ */
interface OrbitMapCanvasProps {
  containerRef: React.RefObject<HTMLDivElement>;
  activeCategory: string | null;
}

const OrbitMapCanvas: React.FC<OrbitMapCanvasProps> = ({ containerRef, activeCategory }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const ambientStars = useMemo(() => {
    const count = isMobile ? 40 : 80;
    return Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 0.8 + 0.1,
      a: Math.random() * 0.4 + 0.06,
      ts: 0.003 + Math.random() * 0.007,
      to: Math.random() * Math.PI * 2,
      col: Math.random() > 0.88 ? (Math.random() > 0.5 ? "#93C5FD" : "#C4B5FD") : "#ffffff",
    }));
  }, [isMobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d")!;
    let t = 0;
    const orbitRadii = getOrbitRadii(isMobile);

    const resize = () => {
      canvas.width = container.offsetWidth * devicePixelRatio;
      canvas.height = container.offsetHeight * devicePixelRatio;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const draw = () => {
      const W = container.offsetWidth;
      const H = container.offsetHeight;
      const dpr = devicePixelRatio;
      ctx.clearRect(0, 0, W * dpr, H * dpr);

      const cx = W / 2, cy = H / 2;

      // Nebula glows
      [
        { x: 0.5, y: 0.5, r: 0.55, c: "rgba(110,231,183,0.018)" },
        { x: 0.5, y: 0.5, r: 0.3,  c: "rgba(56,189,248,0.015)"  },
        { x: 0.5, y: 0.5, r: 0.15, c: "rgba(196,181,253,0.02)"  },
      ].forEach(n => {
        const gr = n.r * Math.max(W, H) * dpr;
        const gx = cx * dpr, gy = cy * dpr;
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        g.addColorStop(0, n.c); g.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      });

      // Orbit rings
      Object.entries(orbitRadii).forEach(([cat, cfg]) => {
        const r = cfg.base * Math.min(W, H) * dpr;
        const catCfg = CAT_CONFIG[cat];
        const isActive = activeCategory === null || activeCategory === cat;
        ctx.save();
        ctx.globalAlpha = isActive ? 0.22 : 0.07;
        ctx.strokeStyle = catCfg.color;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 8]);
        ctx.beginPath();
        ctx.arc(cx * dpr, cy * dpr, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Orbit label (hide on very small)
        if (isActive && !isMobile) {
          ctx.save();
          ctx.globalAlpha = 0.3;
          ctx.font = `9px 'Plus Jakarta Sans', sans-serif`;
          ctx.fillStyle = catCfg.color;
          ctx.fillText(cfg.label.toUpperCase(), (cx + r / dpr + 8) * dpr, cy * dpr);
          ctx.restore();
        }
      });

      // Ambient stars
      for (const s of ambientStars) {
        const tw = Math.sin(t * s.ts + s.to) * 0.3 + 0.7;
        const sx = s.x * W * dpr, sy = s.y * H * dpr;
        ctx.save(); ctx.globalAlpha = s.a * tw;
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.r * 1.8 * dpr);
        sg.addColorStop(0, s.col); sg.addColorStop(1, "transparent");
        ctx.fillStyle = sg;
        ctx.beginPath(); ctx.arc(sx, sy, s.r * 1.8 * dpr, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      t++;
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [ambientStars, containerRef, activeCategory, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
    />
  );
};

/* ══════════════════════════════════════════
   PLANET NODE (with touch support)
══════════════════════════════════════════ */
interface PlanetNodeProps {
  project: typeof projectsData[0];
  angle: number;
  orbitR: number;
  cx: number; cy: number;
  isHovered: boolean;
  isLocked: boolean;
  isDimmed: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

const PlanetNode: React.FC<PlanetNodeProps> = ({
  project, angle, orbitR, cx, cy,
  isHovered, isLocked, isDimmed,
  onHover, onLeave, onClick,
}) => {
  const cfg = CAT_CONFIG[project.category] || CAT_CONFIG["web application"];
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const size = isMobile ? cfg.size * 0.8 : cfg.size;
  const x = cx + orbitR * Math.cos(angle);
  const y = cy + orbitR * Math.sin(angle);
  const active = isHovered || isLocked;

  const shortTitle = project.title.split(" — ")[0].split(" ").slice(0, 3).join(" ");

  return (
    <motion.div
      style={{
        position: "absolute",
        left: x, top: y,
        transform: "translate(-50%, -50%)",
        zIndex: active ? 20 : 10,
        cursor: "pointer",
        opacity: isDimmed ? 0.18 : 1,
        transition: "opacity 0.3s ease",
        touchAction: "manipulation",
        padding: isMobile ? 8 : 0,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      onTouchStart={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <motion.div
        animate={{
          width: active ? size * 3.2 : size * 1.8,
          height: active ? size * 3.2 : size * 1.8,
          opacity: active ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${cfg.glow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {isLocked && (
        <motion.div
          animate={{ scale: [1, 2.0], opacity: [0.5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: "50%", left: "50%",
            width: size, height: size,
            transform: "translate(-50%,-50%)",
            borderRadius: "50%",
            border: `1.5px solid ${cfg.color}`,
            pointerEvents: "none",
          }}
        />
      )}

      <motion.div
        animate={{ scale: active ? 1.45 : 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{
          width: size, height: size,
          borderRadius: "50%",
          background: active
            ? `radial-gradient(circle at 35% 35%, ${cfg.color}55, ${cfg.color}18)`
            : `radial-gradient(circle at 35% 35%, ${cfg.color}30, ${cfg.color}10)`,
          border: `${isLocked ? 2 : 1.5}px solid ${active ? cfg.color : cfg.color + "70"}`,
          boxShadow: active
            ? `0 0 18px ${cfg.color}80, inset 0 0 10px ${cfg.color}20`
            : `0 0 6px ${cfg.color}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.2s, border 0.2s, box-shadow 0.2s",
        }}
      >
        <div style={{
          width: size * 0.38, height: size * 0.38,
          borderRadius: "50%",
          background: cfg.color,
          boxShadow: `0 0 8px ${cfg.color}`,
        }} />

        {isLocked && (
          <div style={{
            position: "absolute", bottom: -2, right: -2,
            width: 10, height: 10, borderRadius: "50%",
            background: "#03060F",
            border: `1.5px solid ${cfg.color}`,
          }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: cfg.color }} />
          </div>
        )}
      </motion.div>

      <motion.div
        animate={{ opacity: active ? 1 : 0.45 }}
        style={{
          position: "absolute",
          top: "100%",
          marginTop: isMobile ? 4 : 7,
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: isMobile ? "normal" : "nowrap",
          maxWidth: isMobile ? 80 : 90,
          fontSize: isMobile ? "9px" : "10px",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 600,
          color: active ? "#fff" : "rgba(255,255,255,0.4)",
          letterSpacing: "0.03em",
          pointerEvents: "none",
          userSelect: "none",
          textShadow: active ? "0 0 12px rgba(0,0,0,0.8)" : "none",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {shortTitle}
      </motion.div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════
   MISSION CORE
══════════════════════════════════════════ */
const MissionCore: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const coreSize = isMobile ? 40 : 52;
  const innerSize = isMobile ? 14 : 20;
  return (
    <div style={{
      position: "absolute",
      left: cx, top: cy,
      transform: "translate(-50%, -50%)",
      zIndex: 15,
      pointerEvents: "none",
    }}>
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", inset: -18,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(110,231,183,0.2) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div style={{
        width: coreSize, height: coreSize, borderRadius: "50%",
        background: "radial-gradient(circle at 35% 35%, rgba(110,231,183,0.25), rgba(110,231,183,0.06))",
        border: "1.5px solid rgba(110,231,183,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 30px rgba(110,231,183,0.2), inset 0 0 20px rgba(110,231,183,0.08)",
      }}>
        <div style={{
          width: innerSize, height: innerSize, borderRadius: "50%",
          background: "#6EE7B7",
          boxShadow: "0 0 16px #6EE7B7, 0 0 32px rgba(110,231,183,0.5)",
        }} />
      </div>
      {!isMobile && (
        <div style={{
          position: "absolute", top: "100%", left: "50%",
          transform: "translateX(-50%)",
          marginTop: 8,
          fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
          color: "rgba(110,231,183,0.4)",
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
          whiteSpace: "nowrap",
        }}>
          Mission Core
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════
   FILTER TAB (responsive)
══════════════════════════════════════════ */
const FilterTab: React.FC<{
  label: string; count: number; active: boolean;
  color: string; onClick: () => void;
}> = ({ label, count, active, color, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: 7,
      padding: "6px 14px", borderRadius: 99,
      background: active ? `${color}14` : "rgba(255,255,255,0.03)",
      border: `1px solid ${active ? color + "50" : "rgba(255,255,255,0.08)"}`,
      color: active ? color : "rgba(255,255,255,0.4)",
      fontSize: "clamp(10px, 3vw, 11.5px)", fontWeight: 600,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      letterSpacing: "0.05em",
      cursor: "pointer",
      transition: "all 0.18s",
      touchAction: "manipulation",
      flexShrink: 0,
    }}
  >
    {active && (
      <span style={{
        width: 5, height: 5, borderRadius: "50%",
        background: color, boxShadow: `0 0 6px ${color}`,
        flexShrink: 0,
      }} />
    )}
    {label}
    <span style={{
      fontSize: "clamp(8px, 2.5vw, 9px)", padding: "1px 6px", borderRadius: 99,
      background: active ? `${color}20` : "rgba(255,255,255,0.05)",
      color: active ? color : "rgba(255,255,255,0.25)",
      border: `1px solid ${active ? color + "30" : "rgba(255,255,255,0.06)"}`,
      fontWeight: 700,
    }}>
      {count}
    </span>
  </button>
);

/* ══════════════════════════════════════════
   GALAXY ORBIT MAP (responsive)
══════════════════════════════════════════ */
interface GalaxyOrbitMapProps {
  activeCategory: string | null;
  inView: boolean;
}

const GalaxyOrbitMap: React.FC<GalaxyOrbitMapProps> = ({ activeCategory, inView }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [lockedId, setLockedId] = useState<number | null>(null);
  const anglesRef = useRef<Record<number, number>>({});
  const rafRef = useRef(0);
  const [, forceUpdate] = useState(0);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const orbitRadii = useMemo(() => getOrbitRadii(isMobile), [isMobile]);

  // Assign initial angles spread evenly per category
  useMemo(() => {
    const catProjects: Record<string, number[]> = {};
    projectsData.forEach(p => {
      if (!catProjects[p.category]) catProjects[p.category] = [];
      catProjects[p.category].push(p.id);
    });
    Object.entries(catProjects).forEach(([, ids]) => {
      ids.forEach((id, i) => {
        anglesRef.current[id] = (2 * Math.PI / ids.length) * i - Math.PI / 2;
      });
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setDims({ w: el.offsetWidth, h: el.offsetHeight });
    });
    ro.observe(el);
    setDims({ w: el.offsetWidth, h: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  // Animate planet angles (slower on mobile)
  useEffect(() => {
    if (!inView) return;
    const animate = () => {
      projectsData.forEach(p => {
        const speed = (CAT_CONFIG[p.category]?.speed ?? 0.001) * (isMobile ? 0.7 : 1);
        anglesRef.current[p.id] = (anglesRef.current[p.id] ?? 0) + speed;
      });
      forceUpdate(n => n + 1);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, isMobile]);

  const cx = dims.w / 2;
  const cy = dims.h / 2;
  const minDim = Math.min(dims.w, dims.h);

  const activeProject = lockedId !== null
    ? projectsData.find(p => p.id === lockedId) ?? null
    : hoveredId !== null
    ? projectsData.find(p => p.id === hoveredId) ?? null
    : null;

  const handlePlanetClick = useCallback((id: number) => {
    setLockedId(prev => prev === id ? null : id);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          height: isMobile ? "clamp(300px, 55vw, 380px)" : "clamp(340px, 45vw, 480px)",
          borderRadius: "14px 14px 0 0",
          border: "1px solid rgba(110,231,183,0.1)",
          borderBottom: "none",
          background: "#030810",
          overflow: "hidden",
        }}
      >
        <OrbitMapCanvas containerRef={containerRef} activeCategory={activeCategory} />

        {/* HUD corners */}
        {[
          { top: 8, left: 8, borderTop: "1px solid", borderLeft: "1px solid" },
          { top: 8, right: 8, borderTop: "1px solid", borderRight: "1px solid" },
          { bottom: 8, left: 8, borderBottom: "1px solid", borderLeft: "1px solid" },
          { bottom: 8, right: 8, borderBottom: "1px solid", borderRight: "1px solid" },
        ].map((s, i) => (
          <div key={i} style={{
            position: "absolute", width: 14, height: 14, zIndex: 5, pointerEvents: "none",
            borderColor: "rgba(110,231,183,0.18)", ...s,
          }} />
        ))}

        {dims.w > 0 && <MissionCore cx={cx} cy={cy} />}

        {dims.w > 0 && projectsData.map(project => {
          const orbitCfg = orbitRadii[project.category as keyof typeof orbitRadii];
          if (!orbitCfg) return null;
          const orbitR = orbitCfg.base * minDim;
          const angle = anglesRef.current[project.id] ?? 0;
          const isHovered = hoveredId === project.id;
          const isLocked = lockedId === project.id;
          const isDimmed = activeCategory !== null && activeCategory !== project.category;

          return (
            <PlanetNode
              key={project.id}
              project={project}
              angle={angle}
              orbitR={orbitR}
              cx={cx} cy={cy}
              isHovered={isHovered}
              isLocked={isLocked}
              isDimmed={isDimmed}
              onHover={() => setHoveredId(project.id)}
              onLeave={() => setHoveredId(null)}
              onClick={() => handlePlanetClick(project.id)}
            />
          );
        })}

        {/* Legend pills — bottom left */}
        <div style={{
          position: "absolute", bottom: 10, left: 12, zIndex: 10,
          display: "flex", gap: 6,
          flexWrap: "wrap",
        }}>
          {Object.entries(CAT_CONFIG).map(([cat, cfg]) => (
            <div key={cat} style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "2px 8px", borderRadius: 99,
              background: "rgba(3,6,15,0.8)",
              border: `1px solid ${cfg.color}30`,
              backdropFilter: "blur(8px)",
            }}>
              <span style={{
                width: 4, height: 4, borderRadius: "50%",
                background: cfg.color, boxShadow: `0 0 5px ${cfg.color}`,
              }} />
              <span style={{
                fontSize: isMobile ? 7 : 9, letterSpacing: "0.12em", textTransform: "uppercase",
                color: cfg.color, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
              }}>
                {cfg.label}
              </span>
            </div>
          ))}
        </div>

        {/* Planet count */}
        <div style={{
          position: "absolute", bottom: 10, right: 12, zIndex: 10,
          fontSize: isMobile ? 7 : 9, letterSpacing: "0.14em", textTransform: "uppercase",
          color: "rgba(110,231,183,0.3)",
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
        }}>
          {projectsData.length} MISSIONS
        </div>

        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 36,
          background: "linear-gradient(to bottom, transparent, rgba(3,6,15,0.7))",
          pointerEvents: "none", zIndex: 6,
        }} />
      </div>

      {/* Dossier panel */}
      <div style={{
        borderRadius: "0 0 14px 14px",
        border: "1px solid rgba(110,231,183,0.1)",
        borderTop: `1px solid ${activeProject ? CAT_CONFIG[activeProject.category]?.color + "30" : "rgba(110,231,183,0.08)"}`,
        background: "rgba(2,7,18,0.95)",
        backdropFilter: "blur(20px)",
        minHeight: 100,
        transition: "border-top-color 0.3s",
        position: "relative",
        overflow: "hidden",
      }}>
        {activeProject && (
          <div style={{
            position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
            background: `linear-gradient(90deg, transparent, ${CAT_CONFIG[activeProject.category]?.color}60, transparent)`,
          }} />
        )}
        <DossierPanel project={activeProject} locked={lockedId !== null} />
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   PROJECTS COMPONENT (Fully Responsive)
══════════════════════════════════════════ */
type FilterKey = "all" | "web application" | "android application";

export const Projects = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.06, rootMargin: "60px" });
  const [filter, setFilter] = useState<FilterKey>("all");
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || isMobile) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--spot-y", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [isMobile]);

  const counts = {
    all: projectsData.length,
    "web application": projectsData.filter(p => p.category === "web application").length,
    "android application": projectsData.filter(p => p.category === "android application").length,
  };

  const tabs: { key: FilterKey; label: string; color: string }[] = [
    { key: "all",                 label: "All Missions",    color: "#6EE7B7" },
    { key: "web application",     label: "Web Ops",         color: "#38BDF8" },
    { key: "android application", label: "Mobile Ops",      color: "#C4B5FD" },
  ];

  const activeCategory = filter === "all" ? null : filter;

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#03060F",
        padding: "clamp(3rem, 6vw, 5rem) clamp(1rem, 4vw, 1.5rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        @keyframes blink-proj { 50% { opacity: 0 } }
        @keyframes scanline-proj {
          0%   { transform: translateY(-100vh) }
          100% { transform: translateY(200vh)  }
        }
        :root { --spot-x: 50%; --spot-y: 50%; }
      `}</style>

      <StarfieldCanvas />

      {!isMobile && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: "radial-gradient(650px circle at var(--spot-x,50%) var(--spot-y,50%), rgba(110,231,183,0.045) 0%, transparent 65%)",
        }} />
      )}

      {!isMobile && (
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{
            position: "absolute", left: 0, right: 0, height: 100,
            background: "linear-gradient(to bottom, transparent, rgba(110,231,183,0.012), transparent)",
            animation: "scanline-proj 10s linear infinite",
          }} />
        </div>
      )}

      <div ref={ref} style={{ position: "relative", zIndex: 10, maxWidth: 1000, margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "clamp(1.5rem, 5vw, 2.5rem)" }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(110,231,183,0.06)",
            border: "1px solid rgba(110,231,183,0.15)",
            borderRadius: 99, padding: "3px 12px",
            marginBottom: 12,
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "#6EE7B7", boxShadow: "0 0 6px #6EE7B7",
              display: "inline-block",
              animation: "blink-proj 2s step-end infinite",
            }} />
            <span style={{
              fontSize: "clamp(9px, 2.5vw, 10px)", letterSpacing: "0.22em", textTransform: "uppercase",
              color: "rgba(110,231,183,0.6)", fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
            }}>
              MISSION ARCHIVE · {projectsData.length} EXPEDITIONS
            </span>
          </div>

          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "flex-end",
            justifyContent: "space-between",
            gap: 16,
          }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              background: "linear-gradient(135deg,#6EE7B7 0%,#38BDF8 55%,#C4B5FD 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0,
            }}>
              Featured Missions
            </h2>

            <div style={{ display: "flex", gap: 20 }}>
              {[
                { val: counts["web application"],     label: "Web",    color: "#38BDF8" },
                { val: counts["android application"], label: "Mobile", color: "#C4B5FD" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{
                    fontSize: "clamp(18px, 4vw, 20px)", fontWeight: 800, fontFamily: "'Syne', sans-serif",
                    color: s.color, lineHeight: 1,
                  }}>{s.val}</span>
                  <span style={{
                    fontSize: "clamp(8px, 2.5vw, 9px)", letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.25)", fontFamily: "'Plus Jakarta Sans', sans-serif",
                    marginTop: 2,
                  }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{
            display: "flex", gap: 8, flexWrap: "wrap",
            marginBottom: "clamp(1rem, 3vw, 1.75rem)",
            justifyContent: isMobile ? "center" : "flex-start",
          }}
        >
          {tabs.map(tab => (
            <FilterTab
              key={tab.key}
              label={tab.label}
              count={counts[tab.key]}
              active={filter === tab.key}
              color={tab.color}
              onClick={() => setFilter(tab.key)}
            />
          ))}
        </motion.div>

        {/* Galaxy Orbit Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <GalaxyOrbitMap activeCategory={activeCategory} inView={inView} />
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          style={{
            textAlign: "center", marginTop: "clamp(1rem, 3vw, 1.75rem)",
            fontSize: "clamp(9px, 2.5vw, 11px)", color: "rgba(255,255,255,0.18)",
            fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {projectsData.length} missions orbiting ·{" "}
          <span style={{ color: "rgba(110,231,183,0.35)" }}>{isMobile ? "tap to lock" : "hover to scan · click to lock"}</span>
        </motion.p>
      </div>
    </section>
  );
};