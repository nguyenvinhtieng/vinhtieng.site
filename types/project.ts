export interface ProjectItem {
    name: string;
    description: string;
    technologies: string[];
    image: string;
    link?: {
      github?: string;
      demo?: string;
    }
}
