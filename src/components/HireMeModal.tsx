import { motion } from "framer-motion";
import { Mail, PhoneCall, MessageCircle, X } from "lucide-react";

interface HireMeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HireMeModal: React.FC<HireMeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg max-w-sm text-center relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">Hire Me</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Get in touch via phone, WhatsApp, or email.
        </p>

        {/* Contact Options */}
        <div className="flex flex-col gap-4">
          <a
            href="tel:+123456789"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            <PhoneCall size={20} /> +94 70 257 5370
          </a>
          <a
            href="https://wa.me/94702575370"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            <MessageCircle size={20} /> WhatsApp
          </a>
          <a
            href="mailto:sithumudayangaofficial@gmail.com"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition"
          >
            <Mail size={20} /> Email Me
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default HireMeModal;
