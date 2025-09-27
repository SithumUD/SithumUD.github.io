import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaGithub, FaJava, FaDatabase } from 'react-icons/fa';
import { SiAndroid, SiMysql, SiFirebase, SiSpringboot, SiSharp} from 'react-icons/si';

interface Skill {
  name: string;
  icon: React.ElementType;
  category: string;
  description: string;
}

const skills: Skill[] = [
  {
    name: 'Java',
    icon: FaJava,
    category: 'Backend',
    description: 'Object-oriented programming language for backend and mobile applications'
  },
  {
    name: 'C#',
    icon: SiSharp,
    category: 'Backend',
    description: 'Object-oriented programming language for backend applications, particularly for web and desktop apps'
  },
  {
    name: 'Spring Boot',
    icon: SiSpringboot,
    category: 'Backend',
    description: 'Framework for building Java-based backend applications'
  },
  {
    name: 'HTML5',
    icon: FaHtml5,
    category: 'Frontend',
    description: 'Markup language used to structure content on the web'
  },
  {
    name: 'CSS3',
    icon: FaCss3Alt,
    category: 'Frontend',
    description: 'Style sheet language used for describing the presentation of web pages'
  },
  {
    name: 'JavaScript',
    icon: FaJs,
    category: 'Frontend',
    description: 'Programming language for web development and dynamic content'
  },
  {
    name: 'React.js',
    icon: FaReact,
    category: 'Frontend',
    description: 'JavaScript library for building user interfaces, especially single-page applications'
  },
  {
    name: 'Android',
    icon: SiAndroid,
    category: 'Mobile',
    description: 'Mobile operating system and development framework for building Android apps'
  },
  {
    name: 'MySQL',
    icon: SiMysql,
    category: 'Database',
    description: 'Relational database management system'
  },
  {
    name: 'Firebase',
    icon: SiFirebase,
    category: 'Database',
    description: 'Backend-as-a-service platform for mobile and web applications'
  },
  {
    name: 'Git',
    icon: FaGithub,
    category: 'Version control',
    description: 'Version control system for tracking changes in source code during software development'
  },
  {
    name: 'Postman',
    icon: FaDatabase,  // You can change the icon if you prefer a different one.
    category: 'API Testing',
    description: 'Tool for testing APIs, making requests, and inspecting responses'
  },
  
];


const categories = Array.from(new Set(skills.map(skill => skill.category)));

export const Skills = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-16 px-4 bg-secondary/5" id="skills">
      <div className="max-w-container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl font-heading font-bold mb-12 text-center"
        >
          Technical Skills
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 100
                }}
                className="group relative bg-white dark:bg-secondary p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 bg-accent/10 rounded-full group-hover:bg-accent/20 transition-colors">
                    <Icon size={24} className="text-accent" />
                  </div>
                  <h3 className="font-heading font-semibold">{skill.name}</h3>
                  <span className="text-xs px-2 py-1 bg-secondary/10 dark:bg-secondary/30 rounded-full">
                    {skill.category}
                  </span>
                </div>
                
                <div className="absolute inset-0 bg-white dark:bg-secondary rounded-xl p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-sm text-center">{skill.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-sm text-secondary dark:text-light/70"
        >
          <p>Hover over skills to learn more</p>
        </motion.div>
      </div>
    </section>
  );
};