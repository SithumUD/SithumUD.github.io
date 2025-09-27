export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;  // Add this line to include the category
  liveUrl?: string;
  githubUrl: string;
}

export interface Skill {
  name: string;
  percentage: number;
  category: 'Frontend' | 'Backend' | 'Mobile' | 'Database';
}