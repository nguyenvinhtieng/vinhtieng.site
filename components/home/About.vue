<template>
  <section
    id="about"
    class="relative flex flex-col md:flex-row items-center justify-center px-8 py-20 space-y-12 md:space-y-0 md:space-x-16 overflow-hidden text-gray-800 dark:text-white bg-white dark:bg-black transition-colors duration-500"
  >
    <!-- Background Animation Layer -->
    <div class="absolute inset-0 overflow-hidden mr-0">
      <div
        class="absolute inset-0 animate-gradient bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-black dark:via-gray-900 dark:to-black transition-colors duration-500"
      ></div>
      <div
        class="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-blob"
      ></div>
      <div
        class="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"
      ></div>
    </div>

    <!-- Avatar -->
    <div class="flex-shrink-0 relative z-10 animate-fade-in-up delay-200">
      <div
        class="relative w-72 h-72 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-blue-300 dark:border-blue-500"
      >
        <NuxtImg
          src="/images/home/avatar.webp"
          alt="About Tieng Nguyen"
          class="object-cover w-full h-full"
          width="500"
          height="500"
        />
      </div>
    </div>

    <!-- Content -->
    <div
      class="flex flex-col items-start max-w-2xl relative z-10 animate-fade-in-up delay-400"
    >
      <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
        About Me
      </h2>
      <div
        class="space-y-5 text-lg md:text-xl text-gray-600 dark:text-neutral-300"
      >
        <p>
          Hi, I'm
          <span class="font-semibold text-blue-500">Tieng Nguyen</span> — a
          frontend developer who believes that great design starts with great
          code. I transform ideas into fast, fluid, and intuitive web
          experiences.
        </p>
        <p>
          With a mind wired for design and a heart beating in code, I craft web
          products that are fast, intuitive, and unforgettable.
        </p>
      </div>

      <!-- Extra Element -->
      <div class="mt-8 flex flex-col space-y-4">
        <div
          class="text-center text-sm text-gray-400 dark:text-neutral-500 uppercase tracking-wider"
        >
          Pushing Boundaries. Crafting Legends.
        </div>
        <div class="flex justify-center space-x-8 mt-2">
          <div class="flex flex-col items-center">
            <div class="text-2xl font-bold text-blue-500">3+</div>
            <div class="text-sm text-gray-500 dark:text-neutral-400 text-center">
              Years Experience
            </div>
          </div>
          <div class="flex flex-col items-center">
            <div class="text-2xl font-bold text-blue-500">30+</div>
            <div class="text-sm text-gray-500 dark:text-neutral-400 text-center">
              Projects Delivered
            </div>
          </div>
          <div class="flex flex-col items-center">
            <div class="text-2xl font-bold text-blue-500">999+</div>
            <div class="text-sm text-gray-500 dark:text-neutral-400 text-center">
              Coffee Cups
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

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
  50% {
    transform: translate(30px, -30px) scale(1.1);
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
</style>
