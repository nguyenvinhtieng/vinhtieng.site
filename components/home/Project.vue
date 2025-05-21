<template>
  <section id="projects" class="py-12">
    <div class="max-w-6xl mx-auto px-6">
      <h2 class="text-4xl font-bold text-center mb-20 text-gray-900 dark:text-gray-100">
        Some Things I’ve Built
      </h2>

      <div
        v-for="(project, index) in PROJECTS"
        :key="index"
        class="mb-28 flex flex-col md:flex-row items-center gap-10"
        :class="{ 'md:flex-row-reverse': index % 2 !== 0 }"
      >
        <!-- Image -->
        <div class="w-full md:w-1/2 rounded-lg overflow-hidden">
          <NuxtImg
            :src="project.image || '/placeholder.svg'"
            :alt="project.name"
            :width="800"
            :height="450"
            class="w-full aspect-video object-cover rounded-lg border border-neutral-200 dark:border-neutral-700"
          />
        </div>

        <!-- Content -->
        <div class="w-full md:w-1/2 relative">
          <p class="text-sm text-blue-500 mb-1 font-medium">Featured Project</p>
          <h3 class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            {{ project.name }}
          </h3>

          <p class="text-neutral-700 dark:text-neutral-200 text-sm leading-relaxed mb-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-neutral-100/50 dark:bg-neutral-800/50 backdrop-blur-md p-4">
            {{ project.description }}
          </p>

          <!-- Tech stack -->
          <ul class="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300 mb-4">
            <li
              v-for="(tech, i) in project.technologies"
              :key="i"
              class="bg-neutral-200 dark:bg-gray-800 px-2 py-1 rounded"
            >
              {{ tech }}
            </li>
          </ul>

          <!-- Links -->
          <div class="flex flex-wrap items-center gap-6 text-sm font-medium">
            <NuxtLink
              v-if="project.link?.github"
              :external="true"
              :href="project.link.github"
              target="_blank"
              class="text-blue-500 hover:underline flex gap-1 items-center"
            >
              View Code
              <NuxtIcon
                name="external"
                class="text-md text-inherit"
              />
            </NuxtLink>
            <NuxtLink
              v-if="project.link?.demo"
              :external="true"
              :href="project.link.demo"
              target="_blank"
              class="text-blue-500 hover:underline flex gap-1 items-center"
            >
              Live Demo
              <NuxtIcon
                name="external"
                class="text-md text-inherit"
              />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PROJECTS } from '~/data/projects'
</script>
