<template>
  <main>
    <Header />
    <main
      class="min-h-screen flex flex-col pt-14 bg-gradient-to-br from-white to-slate-100 dark:from-neutral-950 dark:to-neutral-900 z-10">
      <div class="flex-1 md:mb-8 mb-4 relative z-10">
        <div class="flex items-center justify-center text-center">
          <!-- Error Content -->
          <div class="z-10 px-8 py-10  bg-opacity-75 rounded-lg max-w-md">
            <h1 class="text-6xl font-bold text-red-500">{{ error.statusCode }}</h1>
            <p class="mt-4 text-xl text-gray-700 dark:text-gray-300">
              {{ error.statusCode === 404 ? 'Oops! Page Not Found.' : 'Something went wrong.' }}
            </p>
            <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">{{ error.message }}</p>

            <NuxtLink :to="localePath('/')"
              class="block mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300">
              Go Back Home
            </NuxtLink>
          </div>
        </div>
      </div>
      <Footer />
    </main>
    <Background />
    <SearchDialog />
  </main>
</template>
<script setup lang="ts">
import Header from '@/components/layouts/Header.vue'
import Footer from '@/components/layouts/Footer.vue'
import SearchDialog from '~/components/SearchDialog.vue';
import Background from '~/components/home/Background.vue';
import type { NuxtError } from '#app'
import { useLocalePath } from '#i18n';
const localePath = useLocalePath()

const props = defineProps({
  error: Object as () => NuxtError
})

</script>
