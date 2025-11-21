<template>
  <section
    id="about"
    class="relative flex flex-col md:flex-row items-center justify-center px-8 py-20 space-y-12 md:space-y-0 md:space-x-16 overflow-hidden text-gray-800 dark:text-white transition-colors duration-500"
  >
    <!-- Avatar -->
    <div class="flex-shrink-0 relative z-10 animate-fade-in-up delay-200">
      <div
        class="relative w-72 h-72 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-blue-300 dark:border-blue-500"
      >
        <NuxtImg
          src="/images/home/avatar.webp"
          alt="About Tieng Nguyen"
          title="About Tieng Nguyen"
          class="object-cover w-full h-full"
          width="500"
          height="500"
          sizes="(max-width: 768px) 288px, 384px"
          format="webp"
          quality="80"
          loading="lazy"
          priority
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
          <span class="font-semibold text-blue-500">Tieng Nguyen</span>, a
          web developer who focuses on building stable, clean, and reliable web
          interfaces. With a passion for coding and a keen eye for design, I strive to
          create seamless user experiences that leave a lasting impression.
        </p>
        <p>
          With a strong foundation in both front-end and back-end technologies, I
          specialize in crafting responsive and dynamic websites that adapt to
          various devices and screen sizes. My expertise lies in utilizing modern
          frameworks and tools to deliver high-quality solutions that meet client
          needs.
        </p>
      </div>

      <!-- Extra Element -->
      <div class="mt-8 flex flex-col space-y-4">
        <div
          class="text-center text-sm text-gray-400 dark:text-neutral-500 uppercase tracking-wider"
        >
          Beyond Limits. Building What Lasts.
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
