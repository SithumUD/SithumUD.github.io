import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FileSymlink as Html5, Rss as Css3, Subscript as Javascript, Repeat as ReactIcon, Database, Server } from 'lucide-react';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaGithub, FaDocker, FaJava, FaDatabase } from 'react-icons/fa';
import { SiAndroid, SiMysql, SiFirebase, SiSpringboot, SiKotlin, SiAdobe } from 'react-icons/si';

const technologies = [
  { icon: FaJava, name: 'Enterprise Application Development' },
  { icon: SiAndroid, name: 'Android App Development' },
  { icon: FaJs, name: 'Web Development' },
  { icon: FaDatabase, name: 'Database Management' },
  { icon: FaReact, name: 'UI/UX Design' },
  { icon: FaGithub, name: 'Version Control & Git' },
  
];

export const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      ref={ref}
      className="min-h-[50vh] py-16 px-4"
    >
      <div className="max-w-container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-8"
        >
          <div>
  <h2 className="text-3xl font-heading font-bold mb-6">About Me</h2>
  <p className="text-lg leading-relaxed">
    👋 Hi! I'm <strong>Sithum</strong>, a passionate <strong>full-stack developer</strong> and <strong>android mobile app creator</strong> who loves building intuitive and high-performance applications.  
    <br /><br />
    💡 Skilled in <strong>Java, React.js, Spring Boot, and Android development</strong>, I specialize in creating scalable desktop, web and mobile solutions. From <strong>POS systems</strong> to <strong>tour rental platforms</strong> and <strong>music streaming apps</strong>, I enjoy tackling challenges and delivering impactful software.  
    <br /><br />
    🚀 I thrive on writing clean, efficient code, optimizing performance, and staying ahead of the latest tech trends. My goal is to craft seamless user experiences and innovative solutions that make a difference.  
    <br /><br />
    ✨ Let’s connect and build something amazing together!  
  </p>
</div>



          <div className="grid grid-cols-3 gap-4">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex flex-col items-center justify-center p-4 bg-secondary/10 dark:bg-secondary/20 rounded-lg hover:bg-accent/20 transition-colors group"
              >
                <div className="flex justify-center items-center">
  <tech.icon size={32} className="mb-2 group-hover:text-accent" />
</div>
                <span className="text-sm font-medium text-center">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};