<template>
  <section
    class="relative flex flex-col items-center justify-center px-6 text-center overflow-hidden text-gray-800 dark:text-white transition-colors duration-500"
  >
    <!-- Main Content -->
    <div class="relative z-10 flex flex-col items-center space-y-8 py-20">
      <!-- Avatar -->
      <div class="relative mb-4">
        <div
          class="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 dark:border-white/20 shadow-xl transition-colors duration-500"
        >
          <NuxtImg src="/images/home/avatar.webp" alt="Vinh Tieng" width="200" height="200"/>
        </div>
        <div
          class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-20 dark:opacity-30 animate-pulse"
        ></div>
      </div>

      <!-- Title -->
      <h1
        class="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 dark:from-white dark:via-blue-200 dark:to-white leading-tight"
      >
        Vinh Tieng
      </h1>

      <!-- Divider -->
      <div
        class="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
      ></div>

      <!-- Subtitle -->
      <h2
        class="text-xl md:text-2xl font-medium max-w-3xl text-gray-600 dark:text-neutral-300 "
        aria-label="Crafting beautiful, functional, and accessible web experiences"
      >
        Crafting
        <span class="text-blue-600 dark:text-blue-400">beautiful</span>,
        <span class="text-purple-600 dark:text-purple-400">functional</span>,
        and
        <span class="text-teal-600 dark:text-teal-400">accessible</span>
        web experiences that turn ideas into reality — helping brands and people
        shine online.
      </h2>

      <!-- Tagline -->
      <p
        class="flex justify-center text-base md:text-lg font-light text-gray-500 dark:text-neutral-400 max-w-2xl transition-colors duration-500"
      >
        <span
          class="overflow-hidden border-r-2 border-blue-400 animate-typing whitespace-nowrap"
          >Stop sleeping, start coding!</span
        >
      </p>

      <!-- Social Links -->
      <div class="flex space-x-5 mt-6">
        <NuxtLink
          v-for="(social, index) in socials"
          :key="index"
          :to="social.url"
          target="_blank"
          external
          class="text-gray-500 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-white transition-colors duration-300"
        >
          <NuxtIcon :name="social.icon" class="text-lg" />
          <span class="sr-only">{{ social.icon }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div
      class="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce z-10"
    >
      <span
        class="text-sm text-gray-500 dark:text-neutral-500 mb-2 transition-colors duration-500"
        >Scroll Down</span
      >
      <NuxtIcon
        name="angle-down"
        class="text-lg text-gray-500 dark:text-neutral-500 transition-colors duration-500"
      />
    </div>

  </section>
</template>

<script setup lang="ts">
import { SOCIAL } from "~/constants/common";
import {NuxtLink} from "#components";

const socials = [
  { icon: "github1", url: SOCIAL.GITHUB },
  { icon: "linkedin", url: SOCIAL.LINKEDIN },
  { icon: "mail", url: `mailto:${SOCIAL.EMAIL}` },
  { icon: "facebook", url: SOCIAL.FACEBOOK },
  { icon: "instagram", url: SOCIAL.INSTAGRAM },
];

</script>
