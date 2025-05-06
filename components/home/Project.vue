<template>
  <section
    id="projects"
    class="relative flex flex-col items-center justify-center px-6 py-20 space-y-16 overflow-hidden text-gray-800 dark:text-white bg-white dark:bg-black transition-colors duration-500"
  >
    <!-- Title -->
    <div class="relative z-10 mb-10">
      <h2
        class="text-4xl md:text-5xl font-extrabold tracking-tight text-center"
      >
        Projects
      </h2>
    </div>

    <!-- Projects Grid -->
    <div
      class="relative z-10 w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <div
        v-for="(project, index) in projects"
        :key="index"
        class="group relative bg-white/90 dark:bg-neutral-900/70 rounded-xl shadow-md border border-gray-200 dark:border-neutral-900 overflow-hidden transform transition duration-300 hover:scale-[1.03] hover:shadow-xl animate-fadeInUp"
        style="
          animation-delay: calc(0.1s * var(--i));
          animation-fill-mode: both;
        "
        :style="`--i:${index}`"
      >
        <div class="w-full overflow-hidden">
          <NuxtImg
            :src="project.image || '/placeholder.svg'"
            :alt="project.name + ' image'"
            class="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-110"
            width="500"
            height="281"
            sizes="(max-width: 768px) 288px, 384px"
            format="webp"
            quality="80"
            loading="lazy"
          />
        </div>
        <div class="p-4 flex flex-col space-y-3">
          <h3 class="text-lg font-bold text-blue-600 dark:text-blue-400">
            {{ project.name }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-neutral-300 line-clamp-3">
            {{ project.description }}
          </p>
          <!-- Tech Tags -->
          <div class="flex flex-wrap gap-1">
            <span
              v-for="(tech, idx) in project.technologies"
              :key="idx"
              class="px-4 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-blue-100 text-xs rounded-full"
            >
              {{ tech }}
            </span>
          </div>
          <!-- Action Buttons -->
          <div class="flex space-x-3 pt-2">
            <a
              v-if="project.demo"
              :href="project.demo"
              target="_blank"
              class="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Live
            </a>
            <a
              v-if="project.github"
              :href="project.github"
              target="_blank"
              class="text-xs font-semibold text-gray-600 hover:underline dark:text-neutral-300"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const projects = [
  {
    name: "Middo",
    description:
      "A next-generation communication platform featuring web chat, video calls, and real-time AI translation, designed for seamless global collaboration.",
    technologies: ["Next.js", "NestJS", "MongoDB", "ElectronJS"],
    image: "/images/home/projects/middo.webp",
    demo: "https://middo.app",
  },
  {
    name: "Code Space",
    description:
      "An online code editor offering AI-powered code suggestions and starter templates for Vue, React, and more — crafted for developers to build faster and smarter.",
    technologies: ["NextJS", "ExpressJS"],
    image: "/images/home/projects/code-space.webp",
    demo: "https://code-space.site",
  },
  {
    name: "My Personal Blog",
    description:
      "A personal tech blog focused on web development insights, built with Nuxt Content and optimized for readability and performance.",
    technologies: ["Nuxt Content"],
    image: "/images/home/projects/my-blog.webp",
    demo: "https://vinhtieng.site",
    github: "https://github.com/nguyenvinhtieng/vinhtieng.site",
  },
  {
    name: "Light Chemical",
    description:
      "A professional corporate website developed for a chemical company, focusing on clean UI design and strong brand presentation.",
    technologies: ["HTML", "CSS"],
    image: "/images/home/projects/light-chemical.webp",
    demo: "https://www.lightchemical.co.jp/",
  },
  {
    name: "Nihon JG",
    description:
      "A sleek, responsive website designed for a Japanese medical company, delivering a trustworthy and modern user experience.",
    technologies: ["HTML", "CSS"],
    image: "/images/home/projects/nihon.webp",
    demo: "https://www.nihon-generic.co.jp/",
  },
  {
    name: "And many more...",
    description:
      "A growing collection of web apps, SaaS platforms, and digital experiences — continually pushing the boundaries of creativity and technology.",
    technologies: [],
    image: "/placeholder.svg",
    demo: "",
  },
];
</script>

<style scoped>
section {
  scroll-margin-top: 100px;
}

/* Animation: Fade In Up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out;
}
</style>
