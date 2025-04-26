<template>
  <main class="min-h-screen text-gray-800 dark:text-gray-100">
    <Hero />
    <About />
    <Experience />
    <Project />
  </main>
</template>

<script setup lang="ts">
import Hero from '~/components/home/Hero.vue'
import About from '~/components/home/About.vue'
import Experience from '~/components/home/Experience.vue';
import Project from '~/components/home/Project.vue';

</script>

