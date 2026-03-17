export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
}

export interface Project {
  name: string;
  technologies: string;
  link?: string;
  bullets: string[];
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  location: string;
  year: string;
  gpa?: string;
  extra?: string;
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary: string;
  skills: SkillCategory[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certifications: string[];
}
