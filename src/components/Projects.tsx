import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github } from 'lucide-react';
import type { Project } from '../types';

const projects: Project[] = [
  {
    id: 1,
    title: 'POS and Inventory Management System',
    description: 'A system to manage point of sale and inventory efficiently.',
    image: 'pos.png',
    technologies: ['Java', 'Spring Boot', 'React.js', 'Tailwind CSS', 'Jwt Auth', 'MySQL'],
    category: 'web application',
    //liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/SithumUD/pos-system.git',
  },
  {
    id: 2,
    title: 'Hotel Website',
    description: 'A website for hotel booking with a user-friendly interface.',
    image: 'jjvilla-thumb-pic.png',
    technologies: ['React.js', 'HTML', 'Tailwind CSS', 'JavaScript'],
    category: 'web application',
    liveUrl: 'https://jjvilla.netlify.app/',
    githubUrl: 'https://github.com/SithumUD/jjvilla-hotel.git',
  },
  {
    id: 3,
    title: 'Tour Booking Website',
    description: 'A platform for renting tours and booking activities online.',
    image: 'tourbooking.png',
    technologies: ['Java', 'Spring Boot', 'React.js', 'Tailwind CSS', 'Boostrap', 'MySQL'],
    category: 'web application',
    //liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/SithumUD/EAD2-CW.git',
  },
  {
    id: 4,
    title: 'Podcast and Music Listening App',
    description: 'An app to listen to podcasts and music on the go.',
    image: 'melomind.png',
    technologies: ['Java', 'Kotlin', 'Android Studio', 'Firebase'],
    category: 'android application',
    //liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/SithumUD/Melomind-Android-App.git',
  },
  {
    id: 5,
    title: 'Tip Calculator',
    description: 'A simple app to calculate tips and split the bill.',
    image: 'tiptap-project.png',
    technologies: ['Java', 'Android Studio'],
    category: 'android application',
    //liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/SithumUD/TipTap-Tip-Calculator-.git',
  },
  {
    id: 6,
    title: 'Weather Dashboard',
    description: 'A dashboard displaying weather forecasts for different cities.',
    image: '/weatherx.png',
    technologies: ['React.js', 'OpenWeather API', 'Tailwind CSS', 'JavaScript'],
    category: 'web application',
    liveUrl: 'https://weatherxxxx.netlify.app/',
    githubUrl: 'https://github.com/SithumUD/weather-x.git',
  },
  {
    id: 7,
    title: 'Hangman Game Website',
    description: 'Interactive Hangman Game – Test Your Word Skills with a Fun and Responsive Interface Built with React.',
    image: '/hangman.png',
    technologies: ['React.js', 'HTML', 'Tailwind CSS', 'Javascript'],
    category: 'web application',
    liveUrl: 'https://hangword.netlify.app/',
    githubUrl: 'https://github.com/SithumUD/hangman-game.git',
  },
  {
    id: 8,
    title: 'To-Do List Website',
    description: 'A simple and intuitive to-do list web application built with modern technologies for task management.',
    image: '/taskflow.png',
    technologies: ['React', 'HTML', 'Tailwind CSS', 'Javascript'],
    category: 'web application',
    liveUrl: 'https://taskflor.netlify.app/',
    githubUrl: 'https://github.com/SithumUD/Todo-List-Website.git',
  },
  {
    id: 9,
    title: 'Interview Preparation Website',
    description: 'Job and interview preparation website offering practice questions, progress tracking, and a smooth UI built with React.js.',
    image: '/jobprep.png',
    technologies: ['React Js', 'Tailwind CSS', 'Firebase'],
    category: 'web application',
    liveUrl: 'https://jobprepp.netlify.app/',
    githubUrl: 'https://github.com/SithumUD/question-bank-web.git',
  },
];

export const Projects = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-16 px-4" id="projects">
      <div className="max-w-container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl font-heading font-bold mb-8 text-center"
        >
          Featured Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-secondary rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform flex flex-col"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover object-center"
                loading="lazy"
              />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-heading font-semibold mb-2">{project.title}</h3>
                {/* Display the category */}
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {project.category}
                </span>
                <p className="text-sm mb-4 text-gray-600 dark:text-gray-300 mt-auto">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                  {project.technologies.map(tech => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs rounded-full bg-accent/10 text-accent"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {/* Push the demo and source code links to the bottom */}
                <div className="mt-auto flex gap-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:text-accent transition-colors"
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  )}
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-accent transition-colors"
                  >
                    <Github size={16} />
                    Source Code
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};