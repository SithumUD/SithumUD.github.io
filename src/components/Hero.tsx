import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import {
  Github, Linkedin, Mail, FileText, ArrowRight, Sparkles,
  Code2, Layers, Smartphone, Terminal, Zap, Star,
  ThumbsUp, Users, Clock, Award, TrendingUp, Trophy,
} from "lucide-react";
import HireMeModal from "./HireMeModal";

/* ══════════════════════════════════════════
   STARFIELD CANVAS
══════════════════════════════════════════ */
const StarfieldCanvas = ({ mx, my }: { mx: number; my: number }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);

  const stars = useMemo(() => Array.from({ length: 200 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.3 + 0.2,
    a: Math.random() * 0.65 + 0.15,
    ts: 0.004 + Math.random() * 0.009,
    to: Math.random() * Math.PI * 2,
    col: Math.random() > 0.85 ? (Math.random() > 0.5 ? "#93C5FD" : "#C4B5FD") : "#ffffff",
  })), []);

  const shots = useRef(Array.from({ length: 5 }, () => ({
    x: 0, y: 0, vx: 0, vy: 0, alpha: 0, active: false, age: 0,
  })));

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let t = 0;

    const spawn = (s: typeof shots.current[0]) => {
      s.x = Math.random() * 0.65; s.y = Math.random() * 0.35;
      const ang = 0.55 + Math.random() * 0.35;
      const spd = 0.0045 + Math.random() * 0.005;
      s.vx = Math.cos(ang) * spd; s.vy = Math.sin(ang) * spd;
      s.alpha = 1; s.active = true; s.age = 0;
    };

    shots.current.forEach((s, i) =>
      setTimeout(() => spawn(s), i * 1600 + Math.random() * 2200));

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

      // Nebulae
      [
        { x: 0.15, y: 0.22, r: 0.3, c: "rgba(110,231,183,0.028)" },
        { x: 0.8,  y: 0.68, r: 0.26, c: "rgba(147,197,253,0.026)" },
        { x: 0.55, y: 0.1,  r: 0.22, c: "rgba(196,181,253,0.024)" },
        { x: 0.32, y: 0.82, r: 0.18, c: "rgba(249,115,22,0.018)" },
      ].forEach(n => {
        const gx = n.x * W + Math.sin(t * 0.0004 + n.x * 5) * 22 - px * 0.35;
        const gy = n.y * H + Math.cos(t * 0.0003 + n.y * 5) * 14 - py * 0.35;
        const gr = n.r * Math.max(W, H);
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        g.addColorStop(0, n.c); g.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      });

      // Stars
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
        ctx.fillStyle = sg; ctx.beginPath();
        ctx.arc(sx, sy, s.r * 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      // Shooting stars
      shots.current.forEach(s => {
        if (!s.active) return;
        s.x += s.vx; s.y += s.vy; s.age++;
        s.alpha = Math.max(0, 1 - s.age / 52);
        if (s.age > 58 || s.x > 1.1 || s.y > 1.1) {
          s.active = false;
          setTimeout(() => spawn(s), 2800 + Math.random() * 3500);
        }
        const x1 = s.x * W, y1 = s.y * H;
        const x0 = x1 - s.vx * W * 10, y0 = y1 - s.vy * H * 10;
        const g = ctx.createLinearGradient(x0, y0, x1, y1);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(0.5, `rgba(190,225,255,${s.alpha * 0.45})`);
        g.addColorStop(1, `rgba(255,255,255,${s.alpha})`);
        ctx.save();
        ctx.strokeStyle = g; ctx.lineWidth = 1.4;
        ctx.shadowBlur = 6; ctx.shadowColor = "rgba(147,197,253,0.9)";
        ctx.globalAlpha = s.alpha;
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

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />;
};

/* ══════════════════════════════════════════
   ACHIEVEMENT CARD
══════════════════════════════════════════ */
const AchCard = ({
  icon: Icon, title, value, sub, color, delay, side, floatDur, floatAmt,
}: {
  icon: any; title: string; value: string; sub: string;
  color: string; delay: number; side: "left" | "right";
  floatDur: number; floatAmt: number;
}) => {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.65, type: "spring", stiffness: 80, damping: 14 }}
    >
      <motion.div
        animate={{ y: [0, floatAmt, 0] }}
        transition={{ duration: floatDur, repeat: Infinity, ease: "easeInOut" }}
        onHoverStart={() => setHov(true)}
        onHoverEnd={() => setHov(false)}
        whileHover={{ scale: 1.07 }}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-default select-none relative overflow-hidden"
        style={{
          width: 210,
          background: hov ? `linear-gradient(135deg,${color}16,${color}08)` : "rgba(8,14,28,0.82)",
          border: `1px solid ${hov ? color + "50" : color + "22"}`,
          backdropFilter: "blur(18px)",
          boxShadow: hov ? `0 8px 30px ${color}28` : "0 4px 18px rgba(0,0,0,0.45)",
          transition: "all 0.28s ease",
        }}
      >
        {/* icon */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}15`, border: `1.5px solid ${color}38` }}>
          <Icon size={15} style={{ color }} />
        </div>
        {/* text */}
        <div className="flex flex-col min-w-0">
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{title}</span>
          <span style={{ color, fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1rem", lineHeight: 1.2 }}>{value}</span>
          <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.6rem", letterSpacing: "0.05em" }}>{sub}</span>
        </div>
        {/* shimmer on hover */}
        <AnimatePresence>
          {hov && (
            <motion.div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="absolute inset-0"
                style={{ background: `linear-gradient(100deg,transparent 30%,${color}18 50%,transparent 70%)` }}
                initial={{ x: "-100%" }} animate={{ x: "160%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════
   HOOKS & SMALL COMPONENTS
══════════════════════════════════════════ */
const useTypewriter = (words: string[], spd = 75, del = 45, pause = 2200) => {
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

const TiltAvatar = ({ children }: { children: React.ReactNode }) => {
  const r = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sy = useSpring(ry, { stiffness: 180, damping: 18 });
  return (
    <motion.div ref={r}
      onMouseMove={e => { if (!r.current) return; const b = r.current.getBoundingClientRect(); rx.set(-((e.clientY - b.top) / b.height - 0.5) * 22); ry.set(((e.clientX - b.left) / b.width - 0.5) * 22); }}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
      style={{ rotateX: sx, rotateY: sy, transformStyle: "preserve-3d", perspective: 900 }}
      className="cursor-pointer w-full h-full flex items-center justify-center">
      {children}
    </motion.div>
  );
};

const MagBtn = ({ children, onClick, solid, href, dl }: { children: React.ReactNode; onClick?: () => void; solid?: boolean; href?: string; dl?: boolean | string }) => {
  const r = useRef<HTMLElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 280, damping: 22 });
  const sy = useSpring(my, { stiffness: 280, damping: 22 });
  const mv = (e: React.MouseEvent) => { if (!r.current) return; const b = r.current.getBoundingClientRect(); mx.set((e.clientX - (b.left + b.width / 2)) * 0.25); my.set((e.clientY - (b.top + b.height / 2)) * 0.25); };
  const lv = () => { mx.set(0); my.set(0); };
  const solidSt: React.CSSProperties = { background: "linear-gradient(135deg,#6EE7B7,#38BDF8)", boxShadow: "0 0 32px rgba(110,231,183,0.4)", color: "#050D1A" };
  const outSt: React.CSSProperties = { border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)" };
  const cls = "relative flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm tracking-wide overflow-hidden group select-none";
  const p: any = { style: { x: sx, y: sy, ...(solid ? solidSt : outSt) }, onMouseMove: mv, onMouseLeave: lv, whileTap: { scale: 0.96 }, whileHover: { scale: 1.04 } };
  const inner = <>{children}<span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all rounded-2xl" /></>;
  if (href) return <motion.a ref={r as React.Ref<HTMLAnchorElement>} href={href} download={dl} className={cls} {...p}>{inner}</motion.a>;
  return <motion.button ref={r as React.Ref<HTMLButtonElement>} onClick={onClick} className={cls} {...p}>{inner}</motion.button>;
};

const SC = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.4 } } };
const FU = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as any } } };

/* Card data */
const L_CARDS = [
  { icon: ThumbsUp, title: "Client Satisfaction", value: "100%",  sub: "All rated 5 stars",      color: "#6EE7B7", floatDur: 4.5, floatAmt: -8  },
  { icon: Trophy,   title: "Projects Completed", value: "20+",    sub: "Across 8 countries",     color: "#FCD34D", floatDur: 5.2, floatAmt: 7   },
  { icon: TrendingUp, title: "Repeat Clients",   value: "85%",    sub: "Come back for more",     color: "#C4B5FD", floatDur: 4.8, floatAmt: -6  },
];
const R_CARDS = [
  { icon: Users,  title: "Happy Clients",    value: "10+",    sub: "Worldwide freelance",        color: "#38BDF8", floatDur: 5.0, floatAmt: -7  },
  { icon: Clock,  title: "On-Time Delivery", value: "100%",   sub: "Never missed a deadline",   color: "#F97316", floatDur: 4.6, floatAmt: 8   },
  { icon: Award,  title: "Platform Rating",  value: "★★★★★", sub: "Fiverr & Upwork",            color: "#86EFAC", floatDur: 5.4, floatAmt: -5  },
];

/* ══════════════════════════════════════════
   HERO
══════════════════════════════════════════ */
export const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const typed = useTypewriter(["Software Engineer", "Full-Stack Developer", "Mobile Developer", "UI Architect"]);

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

  const orbItems = [
    { icon: Code2,      color: "#6EE7B7", angle: 270 },
    { icon: Layers,     color: "#93C5FD", angle: 0   },
    { icon: Smartphone, color: "#C4B5FD", angle: 90  },
    { icon: Terminal,   color: "#FCD34D", angle: 180 },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        .hr * { box-sizing: border-box; }
        .hr { font-family: 'Plus Jakarta Sans', sans-serif; }
        .fsyne { font-family: 'Syne', sans-serif; }
        .gt {
          background: linear-gradient(135deg,#6EE7B7 0%,#38BDF8 50%,#C4B5FD 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .spin { animation: spin 5s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .cblink { animation: cb 1s step-end infinite; }
        @keyframes cb { 50%{opacity:0} }
        .pdot { position: relative; }
        .pdot::after {
          content:''; position:absolute; inset:-4px; border-radius:50%;
          border:2px solid #6EE7B7; animation:pr 2.3s ease-out infinite;
        }
        @keyframes pr { 0%{opacity:.9;transform:scale(1)} 100%{opacity:0;transform:scale(2.4)} }
        .scard { position:relative; overflow:hidden; transition:transform .3s ease,box-shadow .3s ease; }
        .scard::after {
          content:''; position:absolute; top:0; left:-120%; width:60%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent);
        }
        .scard:hover::after { left:160%; transition:left .55s ease; }
        .scard:hover { transform:translateY(-5px); box-shadow:0 12px 30px rgba(110,231,183,.12)!important; }
        .tpill { transition:transform .22s ease; cursor:default; }
        .tpill:hover { transform:translateY(-3px) scale(1.07); }
        .gh { position:relative; display:inline-block; cursor:default; }
        .gc1,.gc2 { position:absolute; inset:0; opacity:0; pointer-events:none; }
        .gh:hover .gc1 { opacity:.65; color:#6EE7B7; clip-path:polygon(0 18%,100% 18%,100% 38%,0 38%); animation:ga .36s steps(2) infinite; }
        .gh:hover .gc2 { opacity:.65; color:#93C5FD; clip-path:polygon(0 62%,100% 62%,100% 78%,0 78%); animation:gb .36s steps(2) infinite; }
        @keyframes ga{0%{transform:translate(-3px,1px)}100%{transform:translate(3px,-1px)}}
        @keyframes gb{0%{transform:translate(3px,-2px)}100%{transform:translate(-3px,2px)}}
        .aurora {
          position:absolute; top:0; left:0; right:0; height:2px; z-index:5;
          background:linear-gradient(90deg,transparent,#6EE7B7,#38BDF8,#C4B5FD,#F97316,transparent);
          background-size:200% 100%; animation:aur 4s linear infinite;
        }
        @keyframes aur{0%{background-position:0% 0%}100%{background-position:200% 0%}}
        .otw { animation: otwf 3.5s ease-in-out infinite; }
        @keyframes otwf{0%,100%{transform:translateY(-50%) translateX(0)}50%{transform:translateY(-50%) translateX(-5px)}}
      `}</style>

      {/* Click ripples */}
      {ripples.map(r => (
        <motion.div key={r.id} className="pointer-events-none fixed rounded-full"
          style={{ left: r.x - 1, top: r.y - 1, width: 2, height: 2, border: "1.5px solid rgba(110,231,183,0.55)", zIndex: 9999 }}
          initial={{ scale: 0, opacity: 1 }} animate={{ scale: 95, opacity: 0 }}
          transition={{ duration: 0.88, ease: "easeOut" }} />
      ))}

      <section onClick={onClick} className="hr relative w-full overflow-hidden"
        style={{ minHeight: "100vh", background: "#03060F" }}>

        {/* Aurora */}
        <div className="aurora" />

        {/* Stars */}
        <StarfieldCanvas mx={mouse.x} my={mouse.y} />

        {/* Spotlight */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2,
          background: `radial-gradient(650px circle at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(110,231,183,0.05) 0%,transparent 65%)` }} />

        {/* ══ LEFT CARDS — fixed, vertically centered ══ */}
        <div className="absolute hidden xl:flex flex-col justify-center gap-5 pointer-events-auto"
          style={{ left: 24, top: 0, bottom: 0, zIndex: 30, width: 220 }}>
          {L_CARDS.map((c, i) => (
            <AchCard key={c.title} {...c} delay={1.1 + i * 0.2} side="left" />
          ))}
        </div>

        {/* ══ RIGHT CARDS — fixed, vertically centered ══ */}
        <div className="absolute hidden xl:flex flex-col justify-center gap-5 pointer-events-auto"
          style={{ right: 24, top: 0, bottom: 0, zIndex: 30, width: 220 }}>
          {R_CARDS.map((c, i) => (
            <AchCard key={c.title} {...c} delay={1.2 + i * 0.2} side="right" />
          ))}
        </div>

        {/* ══ CENTER COLUMN ══ */}
        <div className="relative flex flex-col items-center justify-center text-center px-4 py-16"
          style={{ minHeight: "100vh", zIndex: 20 }}>

          {/* Status chip */}
          <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(110,231,183,0.07)", border: "1px solid rgba(110,231,183,0.22)", backdropFilter: "blur(14px)" }}>
            <span className="pdot relative w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#6EE7B7", boxShadow: "0 0 8px #6EE7B7" }} />
            <span className="fsyne text-xs font-bold tracking-widest uppercase" style={{ color: "#6EE7B7", letterSpacing: ".16em" }}>
              Available for opportunities
            </span>
            <Zap size={11} style={{ color: "#FCD34D" }} />
          </motion.div>

          {/* Avatar + orbit */}
          <motion.div initial={{ scale: 0.65, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.75, type: "spring", stiffness: 110 }}
            className="relative flex-shrink-0 mb-5" style={{ width: 260, height: 260 }}>

            {/* Dashed orbit ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div style={{ width: 234, height: 234, borderRadius: "50%", border: "1px dashed rgba(110,231,183,0.15)" }} />
            </div>

            {/* Orbit icons */}
            {orbItems.map((o, i) => {
              const R = 117, rad = (o.angle * Math.PI) / 180;
              const cx = 130 + R * Math.cos(rad), cy = 130 + R * Math.sin(rad);
              return (
                <motion.div key={i}
                  className="absolute flex items-center justify-center rounded-xl"
                  style={{ width: 36, height: 36, left: cx - 18, top: cy - 18, background: `${o.color}16`, border: `1.5px solid ${o.color}45`, color: o.color, backdropFilter: "blur(8px)", zIndex: 22 }}
                  animate={{ y: [0, -6, 0], boxShadow: [`0 0 0px ${o.color}00`, `0 0 14px ${o.color}55`, `0 0 0px ${o.color}00`] }}
                  transition={{ duration: 2.8, delay: i * 0.65, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.5, boxShadow: `0 0 22px ${o.color}66` }}>
                  <o.icon size={14} />
                </motion.div>
              );
            })}

            {/* 3D tilt avatar */}
            <TiltAvatar>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="spin absolute rounded-full flex items-center justify-center"
                  style={{ width: 164, height: 164, background: "conic-gradient(from 0deg,#6EE7B7,#38BDF8,#C4B5FD,#F97316,#6EE7B7)", padding: 3 }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#03060F" }} />
                </div>
                <div className="absolute rounded-full pointer-events-none"
                  style={{ width: 156, height: 156, boxShadow: "0 0 55px rgba(110,231,183,0.2),inset 0 0 30px rgba(110,231,183,0.07)" }} />
                <img src="profile-image-modified.png" alt="Sithum Udayanga"
                  className="absolute rounded-full object-cover object-top select-none"
                  style={{ width: 152, height: 152, border: "3px solid #03060F" }} />
              </div>
            </TiltAvatar>
          </motion.div>

          {/* Text block */}
          <motion.div variants={SC} initial="hidden" animate="show"
            className="flex flex-col items-center w-full max-w-xl">

            {/* Name */}
            <motion.h1 variants={FU} className="fsyne font-extrabold tracking-tight mb-2 leading-none"
              style={{ fontSize: "clamp(2.4rem,7vw,4.5rem)", color: "white" }}>
              <span className="gh mr-2">Sithum<span className="gc1" aria-hidden>Sithum</span><span className="gc2" aria-hidden>Sithum</span></span>
              <span className="gt">Udayanga</span>
            </motion.h1>

            {/* Typewriter */}
            <motion.div variants={FU} className="fsyne font-bold mb-4"
              style={{ fontSize: "clamp(0.95rem,2.2vw,1.3rem)", color: "rgba(255,255,255,0.42)", minHeight: "1.8rem" }}>
              <span style={{ color: "#6EE7B7" }}>{"< "}</span>
              <span style={{ color: "rgba(255,255,255,0.88)" }}>{typed}</span>
              <span className="cblink" style={{ color: "#6EE7B7" }}>▌</span>
              <span style={{ color: "#6EE7B7" }}>{" />"}</span>
            </motion.div>

            {/* Bio */}
            <motion.p variants={FU} className="leading-relaxed mb-5 max-w-md"
              style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.82rem,1.7vw,0.95rem)" }}>
              Bringing ideas to life through{" "}
              <span style={{ color: "rgba(255,255,255,0.82)", fontWeight: 600 }}>expertly crafted solutions</span>{" "}
              that blend design, development, and functionality.
            </motion.p>

            {/* Tech pills */}
            <motion.div variants={FU} className="flex flex-wrap justify-center gap-1.5 mb-5">
              {[
                { l: "React", c: "#6EE7B7" }, { l: "Next.js", c: "#e2e8f0" },
                { l: "TypeScript", c: "#38BDF8" }, { l: "React Native", c: "#C4B5FD" },
                { l: "Node.js", c: "#86EFAC" }, { l: "Tailwind", c: "#7DD3FC" },
              ].map(({ l, c }) => (
                <span key={l} className="tpill text-xs font-semibold px-3 py-1 rounded-full select-none"
                  style={{ background: `${c}10`, border: `1px solid ${c}28`, color: c, letterSpacing: ".03em" }}>
                  {l}
                </span>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div variants={FU} className="flex gap-3 mb-6">
              {[
                { n: "3+", l: "Years", s: "Experience" },
                { n: "20+", l: "Projects", s: "Delivered" },
                { n: "10+", l: "Clients", s: "Worldwide" },
              ].map(({ n, l, s }) => (
                <div key={l} className="scard flex flex-col items-center px-5 py-3 rounded-2xl select-none"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(14px)", minWidth: 76 }}>
                  <span className="fsyne font-extrabold gt" style={{ fontSize: "1.6rem", lineHeight: 1 }}>{n}</span>
                  <span className="text-xs font-semibold mt-0.5" style={{ color: "rgba(255,255,255,0.62)" }}>{l}</span>
                  <span style={{ color: "rgba(255,255,255,0.25)", fontSize: ".6rem", letterSpacing: ".07em", textTransform: "uppercase" }}>{s}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={FU} className="flex flex-wrap justify-center gap-3 mb-6">
              <MagBtn solid onClick={() => setIsModalOpen(true)}>
                <Sparkles size={15} />
                Hire Me
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
                  <ArrowRight size={15} />
                </motion.span>
              </MagBtn>
              <MagBtn href="/SITHUM UDAYANGA - CV.pdf" dl>
                <FileText size={15} />
                Download CV
              </MagBtn>
            </motion.div>

            {/* Social */}
            <motion.div variants={FU} className="flex gap-3">
              {[
                { href: "https://github.com/SithumUD", icon: Github, label: "GitHub", c: "#e2e8f0" },
                { href: "https://www.linkedin.com/in/sithum-udayanga-6301b4301", icon: Linkedin, label: "LinkedIn", c: "#38BDF8" },
                { href: "mailto:sithumudayangaofficial@gmail.com", icon: Mail, label: "Email", c: "#6EE7B7" },
              ].map(({ href, icon: Icon, label, c }) => (
                <motion.a key={label} href={href}
                  target={label !== "Email" ? "_blank" : undefined} rel="noopener noreferrer"
                  aria-label={label} whileHover={{ scale: 1.18, y: -3 }} whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.42)", transition: "all .22s" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor=`${c}50`; el.style.color=c; el.style.background=`${c}10`; el.style.boxShadow=`0 0 18px ${c}28`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor="rgba(255,255,255,0.08)"; el.style.color="rgba(255,255,255,0.42)"; el.style.background="rgba(255,255,255,0.04)"; el.style.boxShadow="none"; }}>
                  <Icon size={17} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Open to Work badge */}
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}
          className="otw hidden lg:flex fixed right-5 flex-col items-center gap-2 pointer-events-none"
          style={{ top: "50%", transform: "translateY(-50%)", zIndex: 40 }}>
          <div className="w-px h-14" style={{ background: "linear-gradient(to bottom,transparent,rgba(110,231,183,0.28))" }} />
          <div className="px-3 py-5 rounded-2xl" style={{ background: "rgba(110,231,183,0.06)", border: "1px solid rgba(110,231,183,0.16)", backdropFilter: "blur(12px)", writingMode: "vertical-rl" }}>
            <span className="fsyne text-xs font-bold" style={{ color: "#6EE7B7", letterSpacing: ".18em" }}>Open to Work</span>
          </div>
          <Star size={11} style={{ color: "#FCD34D", opacity: 0.6 }} />
          <div className="w-px h-14" style={{ background: "linear-gradient(to top,transparent,rgba(110,231,183,0.28))" }} />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none" style={{ zIndex: 20 }}>
          <span className="fsyne" style={{ color: "rgba(255,255,255,0.16)", fontSize: ".55rem", letterSpacing: ".2em", textTransform: "uppercase" }}>scroll</span>
          <div className="relative w-px h-10 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div className="absolute w-full"
              style={{ height: "50%", background: "linear-gradient(to bottom,transparent,#6EE7B7,transparent)" }}
              animate={{ y: ["-60%", "160%"] }} transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }} />
          </div>
        </motion.div>

        <HireMeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </section>
    </>
  );
};