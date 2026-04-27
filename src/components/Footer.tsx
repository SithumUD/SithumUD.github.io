import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";

/* ══════════════════════════════════════════
   MINI STARFIELD CANVAS
══════════════════════════════════════════ */
const FooterCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);

  const stars = useMemo(() => Array.from({ length: 80 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 0.9 + 0.15,
    a: Math.random() * 0.4 + 0.08,
    ts: 0.003 + Math.random() * 0.007,
    to: Math.random() * Math.PI * 2,
    col: Math.random() > 0.88 ? (Math.random() > 0.5 ? "#93C5FD" : "#C4B5FD") : "#ffffff",
  })), []);

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
      for (const s of stars) {
        const tw = Math.sin(t * s.ts + s.to) * 0.3 + 0.7;
        const sx = s.x * W, sy = s.y * H;
        ctx.save(); ctx.globalAlpha = s.a * tw;
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.r * 1.8);
        sg.addColorStop(0, s.col); sg.addColorStop(1, "transparent");
        ctx.fillStyle = sg;
        ctx.beginPath(); ctx.arc(sx, sy, s.r * 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      t++; raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf.current); };
  }, [stars]);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
    />
  );
};

/* ══════════════════════════════════════════
   SIGNAL BARS (decorative equalizer)
══════════════════════════════════════════ */
const SignalBars: React.FC = () => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 2.5, height: 18 }}>
    {[0.4, 0.7, 1, 0.6, 0.85, 0.5, 0.9].map((h, i) => (
      <motion.div
        key={i}
        animate={{ scaleY: [h, h * 0.5 + 0.2, h] }}
        transition={{ duration: 1.2 + i * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
        style={{
          width: 3, borderRadius: 2,
          background: `rgba(110,231,183,${0.3 + h * 0.4})`,
          transformOrigin: "bottom",
          height: `${h * 100}%`,
        }}
      />
    ))}
  </div>
);

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
export const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [year] = useState(() => new Date().getFullYear());

  useEffect(() => {
    const h = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const socials = [
    { href: "https://github.com/SithumUD",                            icon: Github,   label: "GitHub",   color: "#e2e8f0" },
    { href: "https://www.linkedin.com/in/sithum-udayanga-6301b4301",  icon: Linkedin, label: "LinkedIn", color: "#38BDF8" },
    { href: "mailto:sithumudayangaofficial@gmail.com",                 icon: Mail,     label: "Email",    color: "#6EE7B7" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        @keyframes aur-footer {
          0%   { background-position: 0%   0% }
          100% { background-position: 200% 0% }
        }
        @keyframes blink-f { 50% { opacity: 0 } }
        @keyframes spin-slow-f { to { transform: rotate(360deg) } }
        @keyframes float-up {
          0%,100% { transform: translateY(0)   }
          50%     { transform: translateY(-4px) }
        }
      `}</style>

      <footer
        style={{
          position: "relative", width: "100%", overflow: "hidden",
          background: "#03060F",
        }}
      >
        {/* Aurora top border */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg,transparent,#6EE7B7,#38BDF8,#C4B5FD,#F97316,transparent)",
          backgroundSize: "200% 100%",
          animation: "aur-footer 6s linear infinite",
          opacity: 0.35,
          zIndex: 5,
        }} />

        {/* Subtle top nebula fade */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 120,
          background: "linear-gradient(to bottom, rgba(110,231,183,0.018), transparent)",
          pointerEvents: "none", zIndex: 2,
        }} />

        <FooterCanvas />

        {/* HUD corner brackets */}
        {[
          { top: 12, left: 12,  borderTop: "1px solid", borderLeft: "1px solid"  },
          { top: 12, right: 12, borderTop: "1px solid", borderRight: "1px solid" },
        ].map((s, i) => (
          <div key={i} style={{
            position: "absolute", width: 20, height: 20,
            borderColor: "rgba(110,231,183,0.15)", zIndex: 4,
            ...s,
          }} />
        ))}

        <div style={{
          position: "relative", zIndex: 10,
          maxWidth: 900, margin: "0 auto",
          padding: "3rem 1.5rem 2rem",
        }}>

          {/* ── TOP ROW: Branding + nav links ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 24,
              marginBottom: "2rem",
            }}
          >
            {/* Brand block */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Orbit logo mark */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  position: "relative", width: 36, height: 36,
                  animation: "float-up 4s ease-in-out infinite",
                }}>
                  {/* Outer ring */}
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: "50%",
                    border: "1px solid rgba(110,231,183,0.2)",
                    animation: "spin-slow-f 10s linear infinite",
                  }}>
                    <div style={{
                      position: "absolute", top: -3, left: "50%", transform: "translateX(-50%)",
                      width: 5, height: 5, borderRadius: "50%",
                      background: "#6EE7B7", boxShadow: "0 0 6px #6EE7B7",
                    }} />
                  </div>
                  {/* Core */}
                  <div style={{
                    position: "absolute", inset: 6, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(110,231,183,0.2), transparent)",
                    border: "1px solid rgba(110,231,183,0.35)",
                  }} />
                </div>

                <div>
                  <div style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 16, fontWeight: 800,
                    background: "linear-gradient(135deg,#6EE7B7,#38BDF8)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: "-0.01em",
                  }}>
                    Sithum Udayanga
                  </div>
                  <div style={{
                    fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
                    color: "rgba(110,231,183,0.4)",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                  }}>
                    Full-Stack · Mobile · UI Architect
                  </div>
                </div>
              </div>

              {/* Status row */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "4px 12px", borderRadius: 99,
                background: "rgba(110,231,183,0.04)",
                border: "1px solid rgba(110,231,183,0.1)",
                alignSelf: "flex-start",
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: "#6EE7B7", boxShadow: "0 0 5px #6EE7B7",
                  display: "inline-block",
                  animation: "blink-f 2s step-end infinite",
                }} />
                <span style={{
                  fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase",
                  color: "rgba(110,231,183,0.5)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
                }}>
                  Systems Online · Open to Missions
                </span>
                <SignalBars />
              </div>
            </div>

            {/* Nav links */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{
                fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
                color: "rgba(110,231,183,0.3)", fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700, marginBottom: 4,
              }}>
                Navigation
              </div>
              {["About", "Skills", "Projects", "Contact"].map((item, i) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  style={{
                    fontSize: 12, color: "rgba(255,255,255,0.35)",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    textDecoration: "none", letterSpacing: "0.04em",
                    display: "flex", alignItems: "center", gap: 7,
                    transition: "color 0.18s, gap 0.18s",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "#6EE7B7";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "rgba(255,255,255,0.35)";
                  }}
                >
                  <span style={{
                    fontSize: 8, color: "rgba(110,231,183,0.3)",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    letterSpacing: "0.1em",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item}
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── DIVIDER with label ── */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem",
          }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(110,231,183,0.12))" }} />
            <span style={{
              fontSize: 8, letterSpacing: "0.22em", textTransform: "uppercase",
              color: "rgba(110,231,183,0.2)", fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
            }}>
              END OF TRANSMISSION
            </span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(110,231,183,0.12))" }} />
          </div>

          {/* ── BOTTOM ROW ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap", gap: 16,
            }}
          >
            {/* Copyright */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <p style={{
                fontSize: 11, color: "rgba(255,255,255,0.22)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: "0.05em", margin: 0,
              }}>
                © {year} Sithum Udayanga · All Rights Reserved
              </p>
              <p style={{
                fontSize: 9.5, color: "rgba(255,255,255,0.12)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: "0.08em", margin: 0,
              }}>
                Crafted with ♥ somewhere in the cosmos
              </p>
            </div>

            {/* Social links */}
            <div style={{ display: "flex", gap: 8 }}>
              {socials.map(({ href, icon: Icon, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={label !== "Email" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: 38, height: 38, borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.4)",
                    transition: "all 0.2s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = `${color}55`;
                    el.style.color = color;
                    el.style.background = `${color}12`;
                    el.style.boxShadow = `0 0 14px ${color}30`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(255,255,255,0.07)";
                    el.style.color = "rgba(255,255,255,0.4)";
                    el.style.background = "rgba(255,255,255,0.03)";
                    el.style.boxShadow = "none";
                  }}
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll to top */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={scrollToTop}
              aria-label="Return to top"
              style={{
                position: "fixed", bottom: 24, right: 24, zIndex: 50,
                width: 44, height: 44, borderRadius: 12,
                background: "rgba(6,12,26,0.9)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(110,231,183,0.3)",
                color: "#6EE7B7",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(110,231,183,0.12)",
                overflow: "hidden",
              }}
              whileHover={{ scale: 1.08, y: -2, boxShadow: "0 0 28px rgba(110,231,183,0.25)" }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Pulsing ring */}
              <motion.div
                animate={{ scale: [1, 1.6], opacity: [0.3, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                style={{
                  position: "absolute", inset: 0, borderRadius: 12,
                  border: "1px solid rgba(110,231,183,0.4)",
                  pointerEvents: "none",
                }}
              />
              <ArrowUp size={17} />
            </motion.button>
          )}
        </AnimatePresence>
      </footer>
    </>
  );
};