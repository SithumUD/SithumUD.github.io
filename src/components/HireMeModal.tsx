import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, PhoneCall, MessageCircle, X } from "lucide-react";

interface HireMeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ══════════════════════════════════════════
   RADAR CANVAS — rotating sweep + blip dots (responsive)
══════════════════════════════════════════ */
const RadarCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const SIZE = isMobile ? 90 : 120;

  const blips = useRef([
    { a: 0.9,  r: 0.38, size: 2.2, fade: 0 },
    { a: 2.1,  r: 0.62, size: 1.6, fade: 0 },
    { a: 3.7,  r: 0.28, size: 2.8, fade: 0 },
    { a: 4.8,  r: 0.70, size: 1.8, fade: 0 },
    { a: 5.5,  r: 0.50, size: 2.0, fade: 0 },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = SIZE; canvas.height = SIZE;
    const cx = SIZE / 2, cy = SIZE / 2, maxR = SIZE / 2 - 4;
    let angle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);

      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(2,8,20,0.9)";
      ctx.fill();

      [0.33, 0.66, 1].forEach(f => {
        ctx.beginPath();
        ctx.arc(cx, cy, maxR * f, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(110,231,183,0.12)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      ctx.strokeStyle = "rgba(110,231,183,0.1)";
      ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(cx, cy - maxR); ctx.lineTo(cx, cy + maxR); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - maxR, cy); ctx.lineTo(cx + maxR, cy); ctx.stroke();

      for (let i = 0; i < 48; i++) {
        const a = angle - (i / 48) * (Math.PI * 0.65);
        const alpha = (1 - i / 48) * 0.18;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxR, a, a + 0.06);
        ctx.closePath();
        ctx.fillStyle = `rgba(110,231,183,${alpha})`;
        ctx.fill();
      }

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
      ctx.strokeStyle = "rgba(110,231,183,0.9)";
      ctx.lineWidth = 1.2;
      ctx.shadowColor = "#6EE7B7";
      ctx.shadowBlur = 5;
      ctx.stroke();
      ctx.restore();

      blips.current.forEach(b => {
        const bx = cx + Math.cos(b.a) * maxR * b.r;
        const by = cy + Math.sin(b.a) * maxR * b.r;
        const diff = ((angle - b.a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        if (diff < 0.15) b.fade = 1;
        else b.fade = Math.max(0, b.fade - 0.012);
        if (b.fade > 0) {
          ctx.save();
          ctx.globalAlpha = b.fade;
          ctx.shadowColor = "#6EE7B7";
          ctx.shadowBlur = 8;
          ctx.fillStyle = "#6EE7B7";
          ctx.beginPath();
          ctx.arc(bx, by, b.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(110,231,183,0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#6EE7B7";
      ctx.shadowColor = "#6EE7B7";
      ctx.shadowBlur = 6;
      ctx.fill();

      angle += 0.025;
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [SIZE]);

  return (
    <canvas
      ref={canvasRef}
      width={SIZE}
      height={SIZE}
      style={{ width: SIZE, height: SIZE, borderRadius: "50%", display: "block" }}
    />
  );
};

/* ══════════════════════════════════════════
   CONTACT CHANNEL ROW (fully responsive)
══════════════════════════════════════════ */
interface ChannelProps {
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  sub: string;
  color: string;
  channelId: string;
  target?: string;
}

const Channel: React.FC<ChannelProps> = ({ href, icon: Icon, label, sub, color, channelId, target }) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 480;
  return (
    <a
      href={href}
      target={target}
      rel={target ? "noopener noreferrer" : undefined}
      style={{
        display: "flex", alignItems: "center", gap: isMobile ? 8 : 12,
        padding: isMobile ? "8px 12px" : "11px 14px", borderRadius: 10,
        background: "rgba(255,255,255,0.025)",
        border: `1px solid rgba(255,255,255,0.07)`,
        textDecoration: "none",
        transition: "all 0.2s ease",
        position: "relative", overflow: "hidden",
        touchAction: "manipulation",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = `${color}10`;
        el.style.borderColor = `${color}45`;
        el.style.boxShadow = `0 0 18px ${color}18`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "rgba(255,255,255,0.025)";
        el.style.borderColor = "rgba(255,255,255,0.07)";
        el.style.boxShadow = "none";
      }}
    >
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 2,
        background: `linear-gradient(to bottom, transparent, ${color}80, transparent)`,
      }} />

      <div style={{
        width: isMobile ? 32 : 36, height: isMobile ? 32 : 36, borderRadius: 9, flexShrink: 0,
        background: `${color}12`,
        border: `1.5px solid ${color}35`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color,
      }}>
        <Icon size={isMobile ? 14 : 16} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: isMobile ? "clamp(11px, 3.5vw, 12.5px)" : 12.5, fontWeight: 600,
          color: "rgba(255,255,255,0.82)",
          fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.2,
          wordBreak: "break-word",
        }}>{label}</div>
        <div style={{
          fontSize: isMobile ? "clamp(8px, 2.5vw, 10px)" : 10,
          color: "rgba(255,255,255,0.3)",
          fontFamily: "'Plus Jakarta Sans', sans-serif", marginTop: 1,
        }}>{sub}</div>
      </div>

      <div style={{
        fontSize: isMobile ? "clamp(7px, 2vw, 8.5px)" : 8.5, letterSpacing: "0.12em", textTransform: "uppercase",
        color: `${color}70`, fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 700, whiteSpace: "nowrap",
        padding: "2px 6px", borderRadius: 4,
        background: `${color}10`,
        border: `1px solid ${color}25`,
      }}>
        {channelId}
      </div>
    </a>
  );
};

/* ══════════════════════════════════════════
   HIRE ME MODAL (Fully Responsive)
══════════════════════════════════════════ */
const HireMeModal: React.FC<HireMeModalProps> = ({ isOpen, onClose }) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const isSmallMobile = typeof window !== "undefined" && window.innerWidth < 480;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        @keyframes blink-modal { 50% { opacity: 0 } }
        @keyframes aur-modal {
          0%   { background-position: 0%   0% }
          100% { background-position: 200% 0% }
        }
        @keyframes scanline-modal {
          0%   { transform: translateY(-100%) }
          100% { transform: translateY(500%)  }
        }
      `}</style>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              style={{
                position: "fixed", inset: 0, zIndex: 50,
                background: "rgba(2,5,14,0.88)",
                backdropFilter: "blur(10px)",
              }}
            />

            {/* Modal */}
            <div style={{
              position: "fixed", inset: 0, zIndex: 51,
              display: "flex", alignItems: "center", justifyContent: "center",
              pointerEvents: "none", padding: "clamp(12px, 4vw, 16px)",
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.88, y: 24 }}
                transition={{ type: "spring", damping: 26, stiffness: 280 }}
                style={{
                  width: "100%", maxWidth: isSmallMobile ? "95%" : 440,
                  pointerEvents: "auto",
                  position: "relative",
                }}
              >
                <div style={{
                  position: "relative",
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "rgba(5,10,24,0.97)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(110,231,183,0.18)",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(110,231,183,0.08), 0 0 40px rgba(110,231,183,0.06)",
                }}>

                  {/* Aurora top line */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 1.5,
                    background: "linear-gradient(90deg,transparent,#6EE7B7,#38BDF8,#C4B5FD,#F97316,transparent)",
                    backgroundSize: "200% 100%",
                    animation: "aur-modal 4s linear infinite",
                  }} />

                  {/* Scanline sweep - hidden on small mobile for performance */}
                  {!isSmallMobile && (
                    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 2, borderRadius: 16 }}>
                      <div style={{
                        position: "absolute", left: 0, right: 0, height: 80,
                        background: "linear-gradient(to bottom, transparent, rgba(110,231,183,0.015), transparent)",
                        animation: "scanline-modal 6s linear infinite",
                      }} />
                    </div>
                  )}

                  {/* HUD corner brackets */}
                  {[
                    { top: 8, left: 8,  borderTop: "1px solid", borderLeft: "1px solid"  },
                    { top: 8, right: 8, borderTop: "1px solid", borderRight: "1px solid" },
                  ].map((s, i) => (
                    <div key={i} style={{
                      position: "absolute", width: "clamp(10px, 4vw, 14px)", height: "clamp(10px, 4vw, 14px)",
                      borderColor: "rgba(110,231,183,0.25)", zIndex: 5, ...s,
                    }} />
                  ))}

                  {/* Close button */}
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    style={{
                      position: "absolute", top: "clamp(10px, 3vw, 14px)", right: "clamp(10px, 3vw, 14px)", zIndex: 10,
                      width: "clamp(28px, 8vw, 30px)", height: "clamp(28px, 8vw, 30px)", borderRadius: 8,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.4)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.18s",
                      touchAction: "manipulation",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "rgba(110,231,183,0.4)";
                      el.style.color = "#6EE7B7";
                      el.style.background = "rgba(110,231,183,0.08)";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "rgba(255,255,255,0.1)";
                      el.style.color = "rgba(255,255,255,0.4)";
                      el.style.background = "rgba(255,255,255,0.04)";
                    }}
                  >
                    <X size={isMobile ? 12 : 14} />
                  </motion.button>

                  <div style={{
                    padding: `clamp(20px, 6vw, 28px) clamp(16px, 5vw, 24px) clamp(20px, 5vw, 24px)`,
                    position: "relative", zIndex: 3,
                  }}>

                    {/* Header row: radar + title (responsive flex) */}
                    <div style={{
                      display: "flex",
                      flexDirection: isSmallMobile ? "column" : "row",
                      alignItems: isSmallMobile ? "center" : "center",
                      gap: isSmallMobile ? 16 : 18,
                      marginBottom: "clamp(18px, 5vw, 22px)",
                    }}>
                      {/* Radar */}
                      <div style={{ flexShrink: 0 }}>
                        <RadarCanvas />
                      </div>

                      {/* Title block */}
                      <div style={{ textAlign: isSmallMobile ? "center" : "left" }}>
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          background: "rgba(110,231,183,0.06)",
                          border: "1px solid rgba(110,231,183,0.15)",
                          borderRadius: 99, padding: "3px 10px",
                          marginBottom: 8,
                        }}>
                          <span style={{
                            width: 4, height: 4, borderRadius: "50%",
                            background: "#6EE7B7", boxShadow: "0 0 5px #6EE7B7",
                            display: "inline-block",
                            animation: "blink-modal 1.8s step-end infinite",
                          }} />
                          <span style={{
                            fontSize: "clamp(7px, 2.5vw, 8.5px)", letterSpacing: "0.2em", textTransform: "uppercase",
                            color: "rgba(110,231,183,0.6)",
                            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
                          }}>
                            CONTACT ESTABLISHED
                          </span>
                        </div>

                        <h2 style={{
                          fontFamily: "'Syne', sans-serif",
                          fontSize: "clamp(18px, 5vw, 22px)", fontWeight: 800,
                          letterSpacing: "-0.02em",
                          background: "linear-gradient(135deg,#6EE7B7,#38BDF8,#C4B5FD)",
                          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          margin: "0 0 4px",
                          lineHeight: 1.2,
                        }}>
                          Initiate Mission
                        </h2>

                        <p style={{
                          fontSize: "clamp(10px, 3vw, 11.5px)", color: "rgba(255,255,255,0.35)",
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          margin: 0, lineHeight: 1.4,
                        }}>
                          Select a comm channel to begin.<br />
                          Response time: <span style={{ color: "rgba(110,231,183,0.6)" }}>&lt; 24 hrs</span>
                        </p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 10, marginBottom: 14,
                    }}>
                      <div style={{ flex: 1, height: 1, background: "linear-gradient(to right,transparent,rgba(110,231,183,0.15))" }} />
                      <span style={{
                        fontSize: "clamp(7px, 2.5vw, 8px)", letterSpacing: "0.2em", textTransform: "uppercase",
                        color: "rgba(110,231,183,0.25)", fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 700,
                      }}>COMM CHANNELS</span>
                      <div style={{ flex: 1, height: 1, background: "linear-gradient(to left,transparent,rgba(110,231,183,0.15))" }} />
                    </div>

                    {/* Channels */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(8px, 2.5vw, 12px)" }}>
                      <Channel
                        href="tel:+94702575370"
                        icon={PhoneCall}
                        label="+94 70 257 5370"
                        sub="Voice call — direct line"
                        color="#38BDF8"
                        channelId="CH-01"
                      />
                      <Channel
                        href="https://wa.me/94702575370"
                        icon={MessageCircle}
                        label="WhatsApp"
                        sub="Instant messaging — fastest response"
                        color="#6EE7B7"
                        channelId="CH-02"
                        target="_blank"
                      />
                      <Channel
                        href="mailto:sithumudayangaofficial@gmail.com"
                        icon={Mail}
                        label="Email"
                        sub="sithumudayangaofficial@gmail.com"
                        color="#C4B5FD"
                        channelId="CH-03"
                      />
                    </div>

                    {/* Footer note */}
                    <div style={{
                      marginTop: "clamp(14px, 4vw, 16px)",
                      padding: "clamp(6px, 2vw, 8px) clamp(8px, 3vw, 12px)",
                      borderRadius: 8,
                      background: "rgba(110,231,183,0.03)",
                      border: "1px solid rgba(110,231,183,0.07)",
                      display: "flex", alignItems: "center", gap: 8,
                      flexWrap: "wrap",
                    }}>
                      <span style={{
                        width: 4, height: 4, borderRadius: "50%",
                        background: "#6EE7B7", boxShadow: "0 0 5px #6EE7B7",
                        flexShrink: 0, display: "inline-block",
                        animation: "blink-modal 2.2s step-end infinite",
                      }} />
                      <span style={{
                        fontSize: "clamp(9px, 2.5vw, 10px)", color: "rgba(255,255,255,0.22)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        letterSpacing: "0.03em",
                        lineHeight: 1.4,
                      }}>
                        All channels encrypted · Mission details kept confidential
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default HireMeModal;