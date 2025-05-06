<template>
  <ClientOnly>
    <section
      class="fixed inset-0 z-0 min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden text-gray-800 dark:text-white bg-white dark:bg-black transition-colors duration-500 select-none pointer-none"
    >
      <!-- Background Animations -->
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute inset-0 animate-gradient bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-black dark:via-gray-900 dark:to-black transition-colors duration-500"
        ></div>
        <div
          class="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-blob"
        ></div>
        <div
          class="absolute top-1/3 -right-20 w-80 h-80 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"
        ></div>
        <div
          class="absolute bottom-20 left-1/4 w-72 h-72 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"
        ></div>
      </div>

      <!-- Floating Tech Stack -->

      <div class="pointer-events-none absolute inset-0">
        <div
          v-for="(tech, index) in floatingTechs"
          :key="index"
          class="absolute animate-float-tech"
          :style="`
				  left: ${tech.x}%;
				  top: ${tech.y}%;
				  animation-duration: ${tech.duration}s;
				  animation-delay: ${tech.delay}s;
				  opacity: ${tech.opacity};
			  `"
        >
          <img
            v-if="techsImg[tech.name]"
            :src="techsImg[tech.name]"
            class="h-4 m-0 border-none"
            alt="language icon"
            height="16"
            :title="tech.name"
          />
        </div>
      </div>
    </section>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed } from "vue";

const techsImg: Record<string, string> = {
  typescript: '/images/icons/typescript.svg',
	javascript: '/images/icons/javascript.svg',
	html: '/images/icons/html.svg',
	css: '/images/icons/css.svg',
	bash: '/images/icons/bash.svg',
	json: '/images/icons/json.svg',
	dockerfile: '/images/icons/dockerfile.svg',
  babel: '/images/icons/babel.svg',
  gopher: '/images/icons/gopher.svg',
  php: '/images/icons/php.svg',
  jenkins: '/images/icons/jenkins.svg',
  vite: '/images/icons/vite.svg',
  nginx: '/images/icons/nginx.svg',
  laravel: '/images/icons/laravel.svg',
  ubuntu: '/images/icons/ubuntu.svg',
  linux: '/images/icons/linux.svg',
  aws: '/images/icons/aws.svg',
  postgresql: '/images/icons/postgresql.svg',
  mongodb: '/images/icons/mongodb.svg',
  firebase: '/images/icons/firebase.svg',
  sass: '/images/icons/sass.svg',
  webpack: '/images/icons/webpack.svg',
  'visual-studio-code': '/images/icons/visual-studio-code.svg',
  github: '/images/icons/github.svg',
  git: '/images/icons/git.svg',
  nextjs: '/images/icons/nextjs.svg',
  nuxt: '/images/icons/nuxt.svg',
  nodejs: '/images/icons/nodejs.svg',
  tailwindcss: '/images/icons/tailwindcss.svg',
  react: '/images/icons/react.svg',
  vue: '/images/icons/vue.svg',
}

const floatingTechs = computed(() => {
  const techs: {
    name: string;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
  }[] = [];
  Object.keys(techsImg).forEach((tech) => {
    techs.push({
      name: tech,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.floor(Math.random() * 3) + 5,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.3 + 0.1,
    });
  });
  return techs;
});
</script>

<style scoped>
@keyframes gradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
@keyframes blob {
  0%,
  100% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
@keyframes blink {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: rgba(59, 130, 246, 0.7);
  }
}
@keyframes float-tech {
  0%,
  100% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  25% {
    transform: translateY(-15px) translateX(10px) rotate(5deg);
  }
  50% {
    transform: translateY(0) translateX(-10px) rotate(0deg);
  }
  75% {
    transform: translateY(15px) translateX(5px) rotate(-5deg);
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
}
.animate-blob {
  animation: blob 10s infinite alternate;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
.animate-typing {
  animation: typing 3.5s steps(40, end), blink 0.75s step-end infinite;
}
.animate-float-tech {
  animation: float-tech 8s ease-in-out infinite;
}
</style>
