import type { ProjectItem } from "~/types/project";

export const PROJECTS: ProjectItem[] = [
  {
    name: "Code Space",
    description:
      "Code Space is an advanced online code editor designed for developers. It features AI-powered code suggestions, fast startup templates for Vue, React, and more — helping you prototype and build projects with maximum speed and efficiency.",
    technologies: ["Next.js", "Express.js"],
    image: "/images/home/projects/code-space.webp",
    link: {
      demo: "https://code-space.site",
    }
  },
  {
    name: "My Personal Blog",
    description:
      "A modern developer blog built with Nuxt Content. It shares practical web development tutorials, project write-ups, and performance optimization tips — all presented with clean design and fast loading for a better reading experience.",
    technologies: ["Nuxt Content", "Vue 3"],
    image: "/images/home/projects/my-blog.webp",
    link: {
      demo: "https://vinhtieng.site",
      github: "https://github.com/nguyenvinhtieng/vinhtieng.site",
    }
  },
  {
    name: "Translate I18n",
    description:
      "Translate I18n is a Visual Studio Code extension that helps developers translate i18n strings, JSON files, and language resources effortlessly. It streamlines localization tasks, saving time and reducing manual effort.",
    technologies: ["VSCode Extension"],
    image: "/images/home/projects/translate-i18n.webp",
    link: {
      demo: "https://marketplace.visualstudio.com/items?itemName=NguyenVinhTieng.translate-i18n",
    }
  },
  {
    name: "Easy Git CLI",
    description:
      "Easy Git CLI is a powerful command-line tool built with Node.js to enhance your Git workflow. Features include removing unused branches, searching commits by message, and comparing diffs between commits — all with simple commands.",
    technologies: ["Node.js", "Git"],
    image: "/images/home/projects/git-cli-tool.webp",
    link: {
      demo: "https://www.npmjs.com/package/@vinhtieng123/easy-git",
    }
  }
];
