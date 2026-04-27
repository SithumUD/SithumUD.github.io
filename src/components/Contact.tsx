import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import emailjs from "emailjs-com";
import { FileText } from "lucide-react";

/* ══════════════════════════════════════════
   BACKGROUND STARFIELD CANVAS (responsive)
══════════════════════════════════════════ */
const StarfieldCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const stars = useMemo(() => {
    const count = isMobile ? 70 : 130;
    return Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      a: Math.random() * 0.55 + 0.1,
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
      const px = (mx - 0.5) * 14, py = (my - 0.5) * 10;
      [
        { x: 0.15, y: 0.22, r: 0.3,  c: "rgba(110,231,183,0.025)" },
        { x: 0.82, y: 0.65, r: 0.26, c: "rgba(147,197,253,0.022)" },
        { x: 0.52, y: 0.08, r: 0.22, c: "rgba(196,181,253,0.02)"  },
        { x: 0.3,  y: 0.85, r: 0.18, c: "rgba(249,115,22,0.015)"  },
      ].forEach(n => {
        const gx = n.x * W + Math.sin(t * 0.0004 + n.x * 5) * 20 - px * 0.3;
        const gy = n.y * H + Math.cos(t * 0.0003 + n.y * 5) * 13 - py * 0.3;
        const gr = n.r * Math.max(W, H);
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        g.addColorStop(0, n.c); g.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      });
      for (const s of stars) {
        const tw = Math.sin(t * s.ts + s.to) * 0.3 + 0.7;
        const sx = s.x * W + px * s.r * 0.4;
        const sy = s.y * H + py * s.r * 0.4;
        ctx.save();
        ctx.globalAlpha = s.a * tw;
        if (s.r > 1.0) {
          ctx.strokeStyle = s.col; ctx.lineWidth = 0.4;
          ctx.globalAlpha = s.a * tw * 0.28;
          ctx.beginPath(); ctx.moveTo(sx - s.r * 2.8, sy); ctx.lineTo(sx + s.r * 2.8, sy); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(sx, sy - s.r * 2.8); ctx.lineTo(sx, sy + s.r * 2.8); ctx.stroke();
          ctx.globalAlpha = s.a * tw;
        }
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.r * 2);
        sg.addColorStop(0, s.col); sg.addColorStop(1, "transparent");
        ctx.fillStyle = sg;
        ctx.beginPath(); ctx.arc(sx, sy, s.r * 2, 0, Math.PI * 2); ctx.fill();
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
   SIGNAL WAVEFORM (responsive canvas)
══════════════════════════════════════════ */
const SignalWaveform: React.FC<{ active: boolean; messageLength: number }> = ({ active, messageLength }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const tRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(400);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setCanvasWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const amplitude = active ? Math.min(0.15 + (messageLength / 500) * 0.55, 0.7) : 0.06;
    const freq = active ? 0.04 + (messageLength / 500) * 0.03 : 0.025;
    const color = active ? "#6EE7B7" : "rgba(110,231,183,0.25)";

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = active ? 1.5 : 0.8;
      ctx.shadowColor = active ? "#6EE7B7" : "transparent";
      ctx.shadowBlur = active ? 6 : 0;
      const t = tRef.current;
      for (let x = 0; x < W; x++) {
        const progress = x / W;
        const wave1 = Math.sin(progress * Math.PI * 12 * freq * W + t * 0.04) * amplitude * H;
        const wave2 = Math.sin(progress * Math.PI * 7 * freq * W + t * 0.06 + 1.2) * amplitude * 0.4 * H;
        const y = H / 2 + wave1 + wave2;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      tRef.current++;
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, messageLength, canvasWidth]);

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={40}
        style={{ width: "100%", height: 40, display: "block" }}
      />
    </div>
  );
};

/* ══════════════════════════════════════════
   TRANSMISSION LAUNCH ANIMATION
══════════════════════════════════════════ */
const LaunchBeam: React.FC<{ trigger: boolean }> = ({ trigger }) => {
  if (!trigger) return null;
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 1 }}
      animate={{ scaleX: 1, opacity: [1, 1, 0] }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "absolute",
        top: "50%",
        left: 0,
        right: 0,
        height: 1.5,
        background: "linear-gradient(90deg, transparent, #6EE7B7, #38BDF8, transparent)",
        transformOrigin: "left",
        zIndex: 100,
        pointerEvents: "none",
      }}
    />
  );
};

/* ══════════════════════════════════════════
   HUD FIELD (responsive)
══════════════════════════════════════════ */
interface HUDFieldProps {
  label: string;
  coord: string;
  children: React.ReactNode;
  focused: boolean;
}

const HUDField: React.FC<HUDFieldProps> = ({ label, coord, children, focused }) => (
  <div style={{ position: "relative" }}>
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      marginBottom: 6,
      flexWrap: "wrap",
      gap: 4,
    }}>
      <label style={{
        fontSize: "clamp(9px, 3vw, 10px)", letterSpacing: "0.18em", textTransform: "uppercase",
        color: focused ? "#6EE7B7" : "rgba(110,231,183,0.4)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 600,
        transition: "color 0.2s",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <span style={{
          display: "inline-block", width: 5, height: 5, borderRadius: "50%",
          background: focused ? "#6EE7B7" : "rgba(110,231,183,0.25)",
          boxShadow: focused ? "0 0 6px #6EE7B7" : "none",
          transition: "all 0.2s",
        }} />
        {label}
      </label>
      <span style={{
        fontSize: "clamp(8px, 2.5vw, 9px)", letterSpacing: "0.14em",
        color: "rgba(255,255,255,0.15)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>{coord}</span>
    </div>
    <div style={{
      position: "relative",
      border: `1px solid ${focused ? "rgba(110,231,183,0.5)" : "rgba(110,231,183,0.12)"}`,
      borderRadius: 8,
      background: focused ? "rgba(110,231,183,0.03)" : "rgba(0,0,0,0.3)",
      boxShadow: focused ? "0 0 0 1px rgba(110,231,183,0.1), inset 0 0 20px rgba(110,231,183,0.03)" : "none",
      transition: "all 0.2s",
      overflow: "hidden",
    }}>
      {[
        { top: -1, left: -1, borderTop: `2px solid ${focused ? "#6EE7B7" : "rgba(110,231,183,0.3)"}`, borderLeft: `2px solid ${focused ? "#6EE7B7" : "rgba(110,231,183,0.3)"}` },
        { top: -1, right: -1, borderTop: `2px solid ${focused ? "#6EE7B7" : "rgba(110,231,183,0.3)"}`, borderRight: `2px solid ${focused ? "#6EE7B7" : "rgba(110,231,183,0.3)"}` },
        { bottom: -1, left: -1, borderBottom: `2px solid ${focused ? "#6EE7B7" : "rgba(110,231,183,0.3)"}`, borderLeft: `2px solid ${focused ? "#6EE7B7" : "rgba(110,231,183,0.3)"}` },
        { bottom: -1, right: -1, borderBottom: `2px solid ${focused ? "#6EE7B7" : "rgba(110,231,183,0.3)"}`, borderRight: `2px solid ${focused ? "#6EE7B7" : "rgba(110,231,183,0.3)"}` },
      ].map((style, i) => (
        <div key={i} style={{ position: "absolute", width: 8, height: 8, transition: "all 0.2s", ...style }} />
      ))}
      {children}
    </div>
  </div>
);

/* ══════════════════════════════════════════
   SUCCESS TRANSMISSION CARD (responsive)
══════════════════════════════════════════ */
const TransmissionSuccess: React.FC = () => {
  const txId = useMemo(() => `TX-${Date.now().toString(36).toUpperCase().slice(-6)}`, []);
  const ts   = useMemo(() => new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC", []);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        border: "1px solid rgba(110,231,183,0.3)",
        borderRadius: 12,
        background: "rgba(0,20,15,0.7)",
        backdropFilter: "blur(16px)",
        padding: "clamp(20px, 5vw, 28px) clamp(16px, 5vw, 24px)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(110,231,183,0.012) 3px, rgba(110,231,183,0.012) 4px)",
        borderRadius: 12,
      }} />
      <div style={{
        position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
        background: "linear-gradient(90deg, transparent, #6EE7B7, transparent)",
      }} />

      <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        {[1, 2].map(i => (
          <motion.div key={i}
            animate={{ scale: [1, 1.8 + i * 0.4], opacity: [0.5, 0] }}
            transition={{ duration: 1.6, delay: i * 0.3, repeat: Infinity, ease: "easeOut" }}
            style={{
              position: "absolute", width: 40, height: 40, borderRadius: "50%",
              border: "1px solid #6EE7B7",
            }}
          />
        ))}
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(110,231,183,0.12)",
          border: "1.5px solid #6EE7B7",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 20px rgba(110,231,183,0.3)",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" strokeWidth="1.8" strokeLinecap="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </div>
      </div>

      <div style={{
        fontSize: "clamp(12px, 3.5vw, 13px)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
        color: "#6EE7B7", fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 6,
      }}>Signal Received</div>
      <div style={{ fontSize: "clamp(11px, 3vw, 12px)", color: "rgba(255,255,255,0.45)", fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 18 }}>
        Transmission acknowledged — response incoming
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: 8,
        background: "rgba(0,0,0,0.25)", borderRadius: 8,
        border: "1px solid rgba(110,231,183,0.1)", padding: "12px 16px",
      }}>
        {[
          { label: "TX ID", value: txId },
          { label: "STATUS", value: "200 OK" },
          { label: "TIMESTAMP", value: ts, full: true },
          { label: "DESTINATION", value: "CONFIRMED", full: false },
        ].map((row) => (
          <div key={row.label} style={{ gridColumn: row.full ? "1 / -1" : undefined }}>
            <div style={{ fontSize: "clamp(8px, 2.5vw, 9px)", letterSpacing: "0.14em", color: "rgba(110,231,183,0.4)", fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 2 }}>{row.label}</div>
            <div style={{ fontSize: "clamp(10px, 3vw, 11px)", color: "#6EE7B7", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, wordBreak: "break-all" }}>{row.value}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════
   CONTACT COMPONENT (Fully Responsive)
══════════════════════════════════════════ */
export const Contact: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08, rootMargin: "60px" });
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [status, setStatus]       = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [focused, setFocused]     = useState<string | null>(null);
  const [launching, setLaunching] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Spotlight (disable on mobile for performance)
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

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setLaunching(true);
    setTimeout(() => setLaunching(false), 1000);

    try {
      await emailjs.sendForm(
        "service_9so3zzh",
        "template_441ox9k",
        e.target as HTMLFormElement,
        "AL0EZnnziTZMPYKHg"
      );
      setStatus("success");
      setFormState({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 6000);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "clamp(8px, 2.5vw, 10px) clamp(12px, 3vw, 14px)",
    background: "transparent",
    outline: "none",
    border: "none",
    color: "rgba(255,255,255,0.9)",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "clamp(12px, 3.5vw, 13px)",
    caretColor: "#6EE7B7",
  };

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#03060F",
        padding: "clamp(3rem, 8vw, 5rem) clamp(1rem, 4vw, 1.5rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.18) !important; font-family: 'Plus Jakarta Sans', sans-serif; }
        textarea { resize: none; }
        :root { --spot-x: 50%; --spot-y: 50%; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin-slow { to { transform: rotate(360deg) } }
        @keyframes scanline {
          0%   { transform: translateY(-100%) }
          100% { transform: translateY(100vh) }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%) }
          100% { transform: translateX(200%)  }
        }
      `}</style>

      <StarfieldCanvas />

      {/* Spotlight - hidden on mobile */}
      {!isMobile && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: "radial-gradient(600px circle at var(--spot-x,50%) var(--spot-y,50%), rgba(110,231,183,0.05) 0%, transparent 65%)",
        }} />
      )}

      {/* Scanline sweep - hidden on mobile */}
      {!isMobile && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", left: 0, right: 0, height: 120,
            background: "linear-gradient(to bottom, transparent, rgba(110,231,183,0.018), transparent)",
            animation: "scanline 8s linear infinite",
          }} />
        </div>
      )}

      <div ref={ref} style={{ position: "relative", zIndex: 10, maxWidth: 560, margin: "0 auto", width: "100%" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "clamp(1.5rem, 5vw, 2.5rem)" }}
        >
          <div style={{ display: "inline-flex", position: "relative", marginBottom: 20 }}>
            <div style={{
              width: "clamp(48px, 12vw, 56px)", height: "clamp(48px, 12vw, 56px)", borderRadius: "50%",
              border: "1px solid rgba(110,231,183,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: "clamp(30px, 8vw, 36px)", height: "clamp(30px, 8vw, 36px)", borderRadius: "50%",
                background: "rgba(110,231,183,0.08)",
                border: "1.5px solid rgba(110,231,183,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="clamp(14px, 4vw, 16px)" height="clamp(14px, 4vw, 16px)" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.91 14a16 16 0 006.29 6.29l.86-.86a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
            </div>
            <div style={{
              position: "absolute", inset: 0,
              animation: "spin-slow 6s linear infinite",
            }}>
              <div style={{
                position: "absolute", top: -3, left: "50%", transform: "translateX(-50%)",
                width: 6, height: 6, borderRadius: "50%",
                background: "#6EE7B7",
                boxShadow: "0 0 8px #6EE7B7",
              }} />
            </div>
          </div>

          <div style={{
            fontSize: "clamp(9px, 3vw, 10px)", letterSpacing: "0.3em", textTransform: "uppercase",
            color: "rgba(110,231,183,0.5)", fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600, marginBottom: 10,
          }}>
            OPEN CHANNEL · FREQ 2.4GHz
          </div>

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
            Initiate Transmission
          </h2>

          <p style={{
            marginTop: 8, fontSize: "clamp(11px, 3vw, 12px)", color: "rgba(255,255,255,0.3)",
            fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.04em",
          }}>
            Messages are routed securely across the void
          </p>
        </motion.div>

        {/* Form / Success */}
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <TransmissionSuccess key="success" />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              exit={{ opacity: 0, y: -16 }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: "relative" }}
            >
              <LaunchBeam trigger={launching} />

              <div style={{
                border: "1px solid rgba(110,231,183,0.1)",
                borderRadius: 14,
                background: "rgba(2,8,20,0.6)",
                backdropFilter: "blur(20px)",
                padding: "clamp(20px, 5vw, 28px) clamp(16px, 5vw, 24px)",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 14,
                  background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(110,231,183,0.008) 3px, rgba(110,231,183,0.008) 4px)",
                }} />
                <div style={{
                  position: "absolute", top: 0, left: "25%", right: "25%", height: 1,
                  background: "linear-gradient(90deg, transparent, rgba(110,231,183,0.4), transparent)",
                }} />

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "clamp(16px, 4vw, 20px)" }}>

                  <HUDField label="Sender ID" coord="[00]" focused={focused === "name"}>
                    <input
                      type="text" id="name" name="name" required
                      placeholder="Your name"
                      value={formState.name}
                      onChange={handleChange}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused(null)}
                      style={inputStyle}
                    />
                  </HUDField>

                  <HUDField label="Return Vector" coord="[01]" focused={focused === "email"}>
                    <input
                      type="email" id="email" name="email" required
                      placeholder="your@email.com"
                      value={formState.email}
                      onChange={handleChange}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      style={inputStyle}
                    />
                  </HUDField>

                  <HUDField label="Transmission Payload" coord="[02]" focused={focused === "message"}>
                    <textarea
                      id="message" name="message" required rows={isMobile ? 4 : 5}
                      placeholder="Your message..."
                      value={formState.message}
                      onChange={handleChange}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      style={{ ...inputStyle, paddingTop: 10, paddingBottom: 10 }}
                    />
                    <div style={{
                      borderTop: "1px solid rgba(110,231,183,0.1)",
                      padding: "6px 8px 4px",
                      background: "rgba(0,0,0,0.2)",
                    }}>
                      <div style={{
                        fontSize: "clamp(8px, 2.5vw, 9px)", letterSpacing: "0.12em", color: "rgba(110,231,183,0.3)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        marginBottom: 3,
                      }}>
                        SIGNAL STRENGTH · {formState.message.length} CHARS
                      </div>
                      <SignalWaveform
                        active={focused === "message" || formState.message.length > 0}
                        messageLength={formState.message.length}
                      />
                    </div>
                  </HUDField>

                  <AnimatePresence>
                    {status === "error" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        style={{
                          fontSize: "clamp(11px, 3vw, 12px)", color: "#F97316",
                          background: "rgba(249,115,22,0.08)",
                          border: "1px solid rgba(249,115,22,0.25)",
                          borderRadius: 8, padding: "8px 12px",
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          display: "flex", alignItems: "center", gap: 8,
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        Transmission failed — check connection and retry
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={status === "submitting"}
                    whileHover={{ scale: isMobile ? 1 : 1.015 }}
                    whileTap={{ scale: 0.975 }}
                    style={{
                      position: "relative",
                      width: "100%", padding: "clamp(12px, 3.5vw, 13px) clamp(16px, 4vw, 20px)",
                      borderRadius: 10,
                      background: status === "submitting"
                        ? "rgba(110,231,183,0.06)"
                        : "linear-gradient(135deg, rgba(110,231,183,0.12), rgba(56,189,248,0.08))",
                      border: `1px solid ${status === "submitting" ? "rgba(110,231,183,0.2)" : "rgba(110,231,183,0.35)"}`,
                      backdropFilter: "blur(10px)",
                      color: "#6EE7B7",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "clamp(12px, 3.5vw, 13px)", fontWeight: 700,
                      letterSpacing: "0.12em", textTransform: "uppercase",
                      cursor: status === "submitting" ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                      overflow: "hidden",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(90deg, transparent 30%, rgba(110,231,183,0.06) 50%, transparent 70%)",
                      animation: status !== "submitting" ? "shimmer 3s ease-in-out infinite" : "none",
                    }} />
                    {status === "submitting" ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          style={{ width: 14, height: 14, border: "1.5px solid rgba(110,231,183,0.3)", borderTopColor: "#6EE7B7", borderRadius: "50%" }}
                        />
                        <span>Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        <span>Launch Transmission</span>
                      </>
                    )}
                  </motion.button>

                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Download CV / Mission Brief */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{ display: "flex", justifyContent: "center", marginTop: "clamp(16px, 4vw, 20px)" }}
        >
          <a
            href="/SITHUM UDAYANGA - CV.pdf"
            download
            style={{
              display: "flex", alignItems: "center", gap: "clamp(8px, 2.5vw, 10px)",
              padding: "clamp(8px, 2.5vw, 10px) clamp(16px, 4vw, 22px)", borderRadius: 99,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)",
              color: "rgba(255,255,255,0.4)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(10px, 3vw, 11px)", letterSpacing: "0.14em", textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.2s",
              touchAction: "manipulation",
            }}
            onMouseEnter={e => {
              if (isMobile) return;
              const el = e.currentTarget;
              el.style.borderColor = "rgba(110,231,183,0.35)";
              el.style.color = "#6EE7B7";
              el.style.background = "rgba(110,231,183,0.04)";
              el.style.boxShadow = "0 0 20px rgba(110,231,183,0.1)";
            }}
            onMouseLeave={e => {
              if (isMobile) return;
              const el = e.currentTarget;
              el.style.borderColor = "rgba(255,255,255,0.08)";
              el.style.color = "rgba(255,255,255,0.4)";
              el.style.background = "rgba(255,255,255,0.02)";
              el.style.boxShadow = "none";
            }}
          >
            <FileText size={isMobile ? 12 : 13} />
            Access Mission Brief
            <span style={{
              fontSize: "clamp(8px, 2.5vw, 9px)", letterSpacing: "0.1em",
              padding: "2px 6px", borderRadius: 4,
              background: "rgba(110,231,183,0.1)",
              border: "1px solid rgba(110,231,183,0.2)",
              color: "rgba(110,231,183,0.6)",
            }}>PDF</span>
          </a>
        </motion.div>

      </div>
    </section>
  );
};