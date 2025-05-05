<template>
  <section
    id="experience"
    class="relative flex flex-col items-center justify-center px-8 py-20 space-y-16 overflow-hidden text-gray-800 dark:text-white bg-white dark:bg-black transition-colors duration-500"
  >
    <!-- Title -->
    <div class="relative z-10 mb-10">
      <h2
        class="text-4xl md:text-5xl font-extrabold tracking-tight text-center"
      >
        Work Experience
      </h2>
    </div>

    <!-- Timeline -->
    <div class="relative z-10 w-full max-w-5xl">
      <div class="relative">
        <div
          v-for="(job) in jobs"
          :key="job.duration"
          class="flex items-start mb-12"
        >
          <!-- Left Side: Timeline -->
          <div class="flex flex-col h-full items-center w-1/4">
            <div
              class="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-2"
            >
              {{ job.duration }}
            </div>
            <div
              class="w-4 h-4 bg-blue-500 dark:bg-blue-400 rounded-full border-4 border-white dark:border-black"
            ></div>
            <div
              class="w-px bg-gray-300 dark:bg-neutral-700 min-h-56 md:min-h-16 flex-1"
            ></div>
          </div>

          <!-- Right Side: Content -->
          <div class="w-3/4 pl-8">
            <div class="md:flex items-center space-x-4 mb-4">
              <div
                class="w-14 h-14 mb-2 md:md-0 rounded-full overflow-hidden shadow-md border border-neutral-200 bg-white"
              >
                <NuxtImg
                  :src="job.logo"
                  :alt="job.company + ' logo'"
                  class="w-full h-full object-cover p-2"
                  width="56"
                  height="56"
                />
              </div>
              <div>
                <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {{ job.company }}
                </h3>
                <div class="text-sm text-gray-500 dark:text-neutral-400">
                  {{ job.location }}
                </div>
              </div>
            </div>
            <div class="text-lg font-semibold mb-2">
              {{ job.position }}
            </div>
            <p class="text-gray-700 dark:text-neutral-300 leading-relaxed">
              {{ job.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const jobs = [
  {
    company: "Smilegate Vietnam",
    position: "Frontend Developer",
    duration: "Aug 2024 - Present",
    location: "Ho Chi Minh City, Vietnam",
    description:
      "Creating frontend features for gaming platforms and internal tools using Vue.js, focusing on performance and UX.",
    logo: "/images/home/smilegate.webp",
  },
  {
    company: "Dudaji",
    position: "Fullstack Developer",
    duration: "Dec 2023 - Aug 2024",
    location: "Ho Chi Minh City, Vietnam",
    description:
      "Built fullstack applications with Next.js, Electron for desktop apps, and designed backend services using NestJS.",
    logo: "/images/home/dudaji.webp",
  },
  {
    company: "VAND",
    position: "Frontend Developer",
    duration: "Aug 2023 - Nov 2023",
    location: "Ho Chi Minh City, Vietnam",
    description:
      "Developed frontend projects for various clients using Vue.js and Angular. Focused on delivering high-quality customer-facing applications.",
    logo: "/images/home/vand.webp",
  },
  {
    company: "Laichi",
    position: "Frontend Developer",
    duration: "Jun 2022 - Jul 2023",
    location: "Ho Chi Minh City, Vietnam",
    description:
      "Responsible for slicing HTML/CSS designs to pixel-perfect accuracy and implementing interactive UI elements using jQuery.",
    logo: "/images/home/laichi.webp",
  },
];
</script>

<style scoped>
section {
  scroll-margin-top: 100px;
}
</style>
