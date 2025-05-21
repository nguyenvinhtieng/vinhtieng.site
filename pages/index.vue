<template>
  <main class="min-h-screen text-gray-800 dark:text-gray-100">
    <Hero />
    <About />
    <Experience />
    <Project />
    
     <NuxtLink
      to="/resume.pdf"
      target="_blank"
      external
      class="fixed bottom-6 right-6 z-50 flex items-center text-white font-semibold rounded-full shadow-xl transition-all duration-300 overflow-hidden group bg-gradient-to-r from-sky-400 to-blue-600 hover:to-indigo-600 hover:shadow-2xl"
    >
      <div
        class="flex items-center justify-center w-12 h-12 transition-all duration-300 bg-white/10 group-hover:bg-white/20"
      >
        <NuxtIcon
          name="document"
          class="text-xl transition-transform duration-300 group-hover:rotate-12"
        />
      </div>
      <span
        class="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-[150px] group-hover:ml-2 group-hover:mr-4"
      >
        Resume
      </span>
    </NuxtLink>
  </main>
</template>

<script setup lang="ts">
import Hero from '~/components/home/Hero.vue'
import About from '~/components/home/About.vue'
import Experience from '~/components/home/Experience.vue';
import Project from '~/components/home/Project.vue';

</script>

