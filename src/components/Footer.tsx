import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-gray-900 text-light py-6 mt-16 text-center relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <p className="text-lg font-semibold mb-4">Connect with me</p>

        <div className="flex gap-6 mb-4">
          <a
            href="https://github.com/SithumUD"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light hover:text-accent transition-colors"
            aria-label="GitHub Profile"
          >
            <Github size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/sithum-udayanga-6301b4301?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BvXZgUwvZTZGS2JoKP6Qobg%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light hover:text-accent transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="mailto:sithumudayangaofficial@gmail.com"
            className="text-light hover:text-accent transition-colors"
            aria-label="Email Contact"
          >
            <Mail size={24} />
          </a>
        </div>

        <p className="text-sm opacity-75">&copy; {new Date().getFullYear()} Sithum Udayanga. All Rights Reserved.</p>
      </motion.div>

      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-accent text-light p-3 rounded-full shadow-lg hover:bg-accent-dark transition-all"
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} />
      </button>
    </footer>
  );
};
