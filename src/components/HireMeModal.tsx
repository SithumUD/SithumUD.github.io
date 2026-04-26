import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, PhoneCall, MessageCircle, X, Sparkles } from "lucide-react";

interface HireMeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HireMeModal: React.FC<HireMeModalProps> = ({ isOpen, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{
              background: "rgba(3, 6, 15, 0.85)",
              backdropFilter: "blur(8px)",
            }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-[90%] max-w-md pointer-events-auto"
            >
              <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "rgba(8, 14, 28, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(110, 231, 183, 0.2)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(110, 231, 183, 0.1)",
              }}
            >
              {/* Subtle top aurora line */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: "linear-gradient(90deg, transparent, #6EE7B7, #38BDF8, #C4B5FD, transparent)",
                }}
              />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg transition-all z-10"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                whileHover={{ scale: 1.1, color: "#6EE7B7", borderColor: "#6EE7B750" }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={18} />
              </button>

              <div className="p-6 text-center">
                {/* Sparkle icon */}
                <div className="flex justify-center mb-3">
                  <div
                    className="p-2 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, rgba(110,231,183,0.15), rgba(56,189,248,0.15))",
                      border: "1px solid rgba(110,231,183,0.3)",
                    }}
                  >
                    <Sparkles size={24} style={{ color: "#6EE7B7" }} />
                  </div>
                </div>

                <h2
                  className="text-2xl font-bold mb-2"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    background: "linear-gradient(135deg, #6EE7B7, #38BDF8, #C4B5FD)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Hire Me
                </h2>
                <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Let's bring your ideas to life. Reach out anytime.
                </p>

                {/* Contact Options */}
                <div className="flex flex-col gap-3">
                  <a
                    href="tel:+94702575370"
                    className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all group"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.8)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(56,189,248,0.05))";
                      e.currentTarget.style.borderColor = "#38BDF880";
                      e.currentTarget.style.color = "#38BDF8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                    }}
                  >
                    <PhoneCall size={18} />
                    <span>+94 70 257 5370</span>
                  </a>

                  <a
                    href="https://wa.me/94702575370"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all group"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.8)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(110,231,183,0.15), rgba(110,231,183,0.05))";
                      e.currentTarget.style.borderColor = "#6EE7B780";
                      e.currentTarget.style.color = "#6EE7B7";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                    }}
                  >
                    <MessageCircle size={18} />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href="mailto:sithumudayangaofficial@gmail.com"
                    className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all group"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.8)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(196,181,253,0.15), rgba(196,181,253,0.05))";
                      e.currentTarget.style.borderColor = "#C4B5FD80";
                      e.currentTarget.style.color = "#C4B5FD";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                    }}
                  >
                    <Mail size={18} />
                    <span>Email Me</span>
                  </a>
                </div>

                {/* Optional: note */}
                <p className="text-xs mt-5" style={{ color: "rgba(255,255,255,0.25)" }}>
                  I'll respond within 24 hours.
                </p>
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HireMeModal;