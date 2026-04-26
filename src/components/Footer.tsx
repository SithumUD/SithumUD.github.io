import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUp, Sparkles } from "lucide-react";

export const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show/hide scroll-to-top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full overflow-hidden" style={{ background: "#03060F" }}>
      {/* Subtle top glow border (matching Hero's aurora but very subtle) */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, #6EE7B7, #38BDF8, #C4B5FD, #F97316, transparent)",
          backgroundSize: "200% 100%",
          animation: "aurora 8s linear infinite",
          opacity: 0.3,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center"
        >
          {/* Decorative sparkle */}
          <Sparkles size={18} className="mb-3" style={{ color: "#6EE7B7", opacity: 0.6 }} />

          <p
            className="text-sm font-semibold tracking-wider uppercase mb-4"
            style={{
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.15em",
            }}
          >
            Connect with me
          </p>

          {/* Social links – glass‑morphic pill */}
          <div className="flex gap-4 mb-5">
            {[
              {
                href: "https://github.com/SithumUD",
                icon: Github,
                label: "GitHub",
                color: "#e2e8f0",
              },
              {
                href: "https://www.linkedin.com/in/sithum-udayanga-6301b4301",
                icon: Linkedin,
                label: "LinkedIn",
                color: "#38BDF8",
              },
              {
                href: "mailto:sithumudayangaofficial@gmail.com",
                icon: Mail,
                label: "Email",
                color: "#6EE7B7",
              },
            ].map(({ href, icon: Icon, label, color }) => (
              <motion.a
                key={label}
                href={href}
                target={label !== "Email" ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.5)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${color}60`;
                  e.currentTarget.style.color = color;
                  e.currentTarget.style.background = `${color}15`;
                  e.currentTarget.style.boxShadow = `0 0 12px ${color}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Icon size={17} />
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <p
            className="text-xs"
            style={{
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.05em",
            }}
          >
            &copy; {new Date().getFullYear()} Sithum Udayanga. All Rights Reserved.
          </p>
        </motion.div>
      </div>

      {/* Scroll to top button – glass‑morphic, appears on scroll */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-xl transition-all duration-200 group"
          style={{
            background: "rgba(8,14,28,0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(110,231,183,0.3)",
            color: "#6EE7B7",
          }}
          whileHover={{ y: -3, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
          {/* Subtle glow on hover */}
          <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/5 transition-all" />
        </motion.button>
      )}

      <style>{`
        @keyframes aurora {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
      `}</style>
    </footer>
  );
};