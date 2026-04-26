import { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ExternalLink, Github } from "lucide-react";

/* ══════════════════════════════════════════
   OPTIMIZED STARFIELD CANVAS (same as Skills)
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

  const stars = useMemo(() => Array.from({ length: 120 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.3 + 0.2,
    a: Math.random() * 0.65 + 0.15,
    ts: 0.004 + Math.random() * 0.009,
    to: Math.random() * Math.PI * 2,
    col: Math.random() > 0.85 ? (Math.random() > 0.5 ? "#93C5FD" : "#C4B5FD") : "#ffffff",
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
      const { x: mx, y: my } = mouseRef.current;
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
        g.addColorStop(0, n.c);
        g.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(gx, gy, gr, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      // Stars
      for (const s of stars) {
        const tw = Math.sin(t * s.ts + s.to) * 0.35 + 0.65;
        const sx = s.x * W + px * s.r * 0.5;
        const sy = s.y * H + py * s.r * 0.5;
        ctx.save();
        ctx.globalAlpha = s.a * tw;
        if (s.r > 1.0) {
          ctx.strokeStyle = s.col;
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = s.a * tw * 0.35;
          ctx.beginPath();
          ctx.moveTo(sx - s.r * 3, sy);
          ctx.lineTo(sx + s.r * 3, sy);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(sx, sy - s.r * 3);
          ctx.lineTo(sx, sy + s.r * 3);
          ctx.stroke();
          ctx.globalAlpha = s.a * tw;
        }
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.r * 2.2);
        sg.addColorStop(0, s.col);
        sg.addColorStop(1, "transparent");
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(sx, sy, s.r * 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      t++;
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf.current);
    };
  }, [stars]);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />;
};

/* ══════════════════════════════════════════
   PROJECT CARD (glass‑morphic, optimized)
══════════════════════════════════════════ */
const ProjectCard = ({ project, index, inView }: { project: any; index: number; inView: boolean }) => {
  // Assign a colour based on category
  const categoryColor =
    project.category === "web application"
      ? "#38BDF8"
      : project.category === "android application"
      ? "#C4B5FD"
      : "#6EE7B7";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
      style={{ willChange: "transform" }}
    >
      <div
        className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01] cursor-default"
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(14px)",
          border: `1px solid ${categoryColor}28`,
          boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
          transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = `${categoryColor}60`;
          e.currentTarget.style.boxShadow = `0 12px 30px ${categoryColor}20`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = `${categoryColor}28`;
          e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.25)";
        }}
      >
        {/* Image */}
        <div className="relative overflow-hidden h-48">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#03060F] via-transparent to-transparent opacity-60" />
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-xl font-bold mb-1" style={{ color: "rgba(255,255,255,0.92)" }}>
            {project.title}
          </h3>
          <span
            className="text-xs font-semibold uppercase tracking-wider mb-2 inline-block"
            style={{ color: categoryColor }}
          >
            {project.category}
          </span>
          <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
            {project.description}
          </p>

          {/* Tech stack pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech: string) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs rounded-full font-medium"
                style={{
                  background: `${categoryColor}15`,
                  border: `1px solid ${categoryColor}30`,
                  color: categoryColor,
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action links */}
          <div className="mt-auto flex gap-4 pt-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm transition-all hover:gap-2"
                style={{ color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = categoryColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              >
                <ExternalLink size={14} />
                Live Demo
              </a>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm transition-all hover:gap-2"
              style={{ color: "rgba(255,255,255,0.6)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = categoryColor)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
            >
              <Github size={14} />
              Source Code
            </a>
          </div>
        </div>

        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(100deg, transparent 30%, ${categoryColor}18 50%, transparent 70%)`,
              animation: "shimmer 0.6s ease-in-out forwards",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════
   PROJECTS DATA
══════════════════════════════════════════ */
const projectsData = [
  {
    id: 1,
    title: "POS and Inventory Management System",
    description: "A system to manage point of sale and inventory efficiently.",
    image: "pos.png",
    technologies: ["Java", "Spring Boot", "React.js", "Tailwind CSS", "Jwt Auth", "MySQL"],
    category: "web application",
    githubUrl: "https://github.com/SithumUD/pos-system.git",
  },
  {
    id: 2,
    title: "Hotel Website",
    description: "A website for hotel booking with a user-friendly interface.",
    image: "jjvilla-thumb-pic.png",
    technologies: ["React.js", "HTML", "Tailwind CSS", "JavaScript"],
    category: "web application",
    liveUrl: "https://jjvilla.netlify.app/",
    githubUrl: "https://github.com/SithumUD/jjvilla-hotel.git",
  },
  {
    id: 3,
    title: "Tour Booking Website",
    description: "A platform for renting tours and booking activities online.",
    image: "tourbooking.png",
    technologies: ["Java", "Spring Boot", "React.js", "Tailwind CSS", "Bootstrap", "MySQL"],
    category: "web application",
    githubUrl: "https://github.com/SithumUD/EAD2-CW.git",
  },
  {
    id: 4,
    title: "Podcast and Music Listening App",
    description: "An app to listen to podcasts and music on the go.",
    image: "melomind.png",
    technologies: ["Java", "Kotlin", "Android Studio", "Firebase"],
    category: "android application",
    githubUrl: "https://github.com/SithumUD/Melomind-Android-App.git",
  },
  {
    id: 5,
    title: "Tip Calculator",
    description: "A simple app to calculate tips and split the bill.",
    image: "tiptap-project.png",
    technologies: ["Java", "Android Studio"],
    category: "android application",
    githubUrl: "https://github.com/SithumUD/TipTap-Tip-Calculator-.git",
  },
  {
    id: 6,
    title: "Weather Dashboard",
    description: "A dashboard displaying weather forecasts for different cities.",
    image: "/weatherx.png",
    technologies: ["React.js", "OpenWeather API", "Tailwind CSS", "JavaScript"],
    category: "web application",
    liveUrl: "https://weatherxxxx.netlify.app/",
    githubUrl: "https://github.com/SithumUD/weather-x.git",
  },
  {
    id: 7,
    title: "Hangman Game Website",
    description: "Interactive Hangman Game – Test Your Word Skills with a Fun and Responsive Interface Built with React.",
    image: "/hangman.png",
    technologies: ["React.js", "HTML", "Tailwind CSS", "JavaScript"],
    category: "web application",
    liveUrl: "https://hangword.netlify.app/",
    githubUrl: "https://github.com/SithumUD/hangman-game.git",
  },
  {
    id: 8,
    title: "To-Do List Website",
    description: "A simple and intuitive to-do list web application built with modern technologies for task management.",
    image: "/taskflow.png",
    technologies: ["React", "HTML", "Tailwind CSS", "JavaScript"],
    category: "web application",
    liveUrl: "https://taskflor.netlify.app/",
    githubUrl: "https://github.com/SithumUD/Todo-List-Website.git",
  },
  {
    id: 9,
    title: "Interview Preparation Website",
    description: "Job and interview preparation website offering practice questions, progress tracking, and a smooth UI built with React.js.",
    image: "/jobprep.png",
    technologies: ["React Js", "Tailwind CSS", "Firebase"],
    category: "web application",
    liveUrl: "https://jobprepp.netlify.app/",
    githubUrl: "https://github.com/SithumUD/question-bank-web.git",
  },
];

/* ══════════════════════════════════════════
   PROJECTS COMPONENT
══════════════════════════════════════════ */
export const Projects = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1, rootMargin: "50px" });

  // Update spotlight gradient directly via CSS custom property (no React re‑renders)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty("--spotlight-x", `${x}%`);
      document.documentElement.style.setProperty("--spotlight-y", `${y}%`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative w-full overflow-hidden" style={{ background: "#03060F", padding: "5rem 1.5rem" }}>
      <StarfieldCanvas />

      {/* Spotlight – uses CSS variables, no React state */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: `radial-gradient(650px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(110,231,183,0.05) 0%, transparent 65%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto z-10">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-extrabold text-3xl sm:text-4xl text-center mb-12"
          style={{
            fontFamily: "'Syne', sans-serif",
            background: "linear-gradient(135deg,#6EE7B7 0%,#38BDF8 50%,#C4B5FD 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.02em",
          }}
        >
          Featured Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} inView={inView} />
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        :root {
          --spotlight-x: 50%;
          --spotlight-y: 50%;
        }
      `}</style>
    </section>
  );
};