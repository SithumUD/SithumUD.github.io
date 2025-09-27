import { useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, FileText } from "lucide-react";
import HireMeModal from "./HireMeModal";

export const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="h-screen flex flex-col items-center justify-center text-center px-4">
      {/* Profile Image */}
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} className="mb-8">
        <img
          src="profile-image-modified.png"
          alt="Profile"
          className="w-60 h-60 rounded-full object-cover border-4 border-accent"
        />
      </motion.div>

      {/* Name */}
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold mb-4">
        Sithum Udayanga
      </motion.h1>

      {/* Animated Text */}
      <div className="h-16 mb-6">
        <TypeAnimation
          sequence={["Software Engineer", 2000, "Full-Stack Developer", 2000, "Mobile Developer", 2000]}
          wrapper="h2"
          speed={50}
          className="text-xl md:text-2xl text-accent font-heading"
          repeat={Infinity}
        />
      </div>

      {/* Bio */}
      <p className="text-lg mb-8 max-w-2xl">Bringing your ideas to life through expertly crafted solutions that blend design, development, and functionality.</p>

      {/* Social Icons */}
      <div className="flex gap-6">
        <a href="https://github.com/SithumUD" target="_blank" rel="noopener noreferrer" className="text-primary dark:text-light hover:text-accent transition-colors" aria-label="GitHub Profile">
          <Github size={24} />
        </a>
        <a href="https://www.linkedin.com/in/sithum-udayanga-6301b4301?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BvXZgUwvZTZGS2JoKP6Qobg%3D%3D" target="_blank" rel="noopener noreferrer" className="text-primary dark:text-light hover:text-accent transition-colors" aria-label="LinkedIn Profile">
          <Linkedin size={24} />
        </a>
        <a href="mailto:sithumudayangaofficial@gmail.com" className="text-primary dark:text-light hover:text-accent transition-colors" aria-label="Email Contact">
          <Mail size={24} />
        </a>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex justify-center gap-6">
        <a href="/SITHUM UDAYANGA - CV.pdf" download className="flex items-center gap-2 px-6 py-3 border border-gray-400 hover:border-accent rounded-md transition">
          <FileText size={20} /> Download CV
        </a>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-3 border border-gray-400 hover:border-accent rounded-md transition">
          <FileText size={20} /> Hire Me
        </button>
      </div>

      {/* Hire Me Modal */}
      <HireMeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Scroll Down Indicator */}
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8">
        <div className="w-6 h-10 border-2 border-primary dark:border-light rounded-full flex justify-center">
          <div className="w-2 h-2 bg-primary dark:bg-light rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
};
