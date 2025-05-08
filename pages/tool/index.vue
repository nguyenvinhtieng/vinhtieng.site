<template>
  <div class="p-6 max-w-screen-xl w-full mx-auto text-gray-900 dark:text-gray-100">
    <h2 class="text-2xl font-semibold mb-6 text-center">🛠️ Developer Tools</h2>

    <div class="mb-6 max-w-md mx-auto">
      <input
        v-model="search"
        type="text"
        placeholder="Search tools..."
        class="w-full px-4 py-2 rounded-md border bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 border-neutral-200 dark:border-neutral-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
      />
    </div>

    <div v-if="filteredTools.length > 0" class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="tool in filteredTools"
        :key="tool.name"
        :to="tool.url"
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
      >
        <div class="aspect-video bg-gray-100 dark:bg-gray-800">
          <img
            :src="tool.image"
            :alt="tool.name"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="p-4">
          <h3 class="text-base font-semibold mb-1 truncate">{{ tool.name }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {{ tool.description }}
          </p>
        </div>
      </NuxtLink>
    </div>

    <div v-else class="text-center text-gray-500 dark:text-gray-400 mt-12">
      😢 No tools found with "<strong>{{ search }}</strong>"
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useLocalePath } from '#i18n';

const localePath = useLocalePath();
const search = ref('');

const tools = [
  {
    name: 'JSON Formatter',
    description: 'Format and beautify JSON data',
    url: localePath('/tool/json-formatter'),
    image: '/images/tools/json-format.webp',
  },
  {
    name: 'Base64 Encoder',
    description: 'Encode data to Base64 format',
    url: localePath('/tool/base64-encoder'),
    image: '/images/tools/base64-encoder.webp',
  },
  {
    name: 'Markdown Viewer',
    description: 'Preview markdown content',
    url: localePath('/tool/markdown-viewer'),
    image: '/images/tools/markdown-viewer.webp',
  },
  {
    name: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs',
    url: localePath('/tool/word-counter'),
    image: '/images/tools/word-counter.webp',
  }
];

const filteredTools = computed(() =>
  tools.filter((tool) => tool.name.toLowerCase().includes(search.value.toLowerCase()))
);
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
