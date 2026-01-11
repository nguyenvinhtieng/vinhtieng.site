<template>
  <div class="min-h-screen text-gray-800 dark:text-gray-100 relative z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pb-16">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 mb-6">
          <NuxtIcon name="window" class="text-4xl text-sky-500 dark:text-sky-400 animate-float" />
        </div>
        
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-gray-900 dark:text-gray-100">
          🛠️ {{ $t('tool_list.title') }}
        </h1>
        
        <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          {{ $t('tool_list.subtitle') }}
        </p>

        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto mb-8">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <NuxtIcon name="search" class="text-gray-400 dark:text-gray-500 text-xl animate-pulse" />
            </div>
            <input
              v-model="search"
              type="text"
              :placeholder="$t('tool_list.search_placeholder')"
              class="w-full pl-12 pr-10 py-3 text-base rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <div v-if="search" class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                @click="search = ''"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Clear search"
              >
                <NuxtIcon name="x-mark" class="text-lg" />
              </button>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="flex flex-wrap justify-center gap-6 text-gray-600 dark:text-gray-400">
          <div class="flex items-center gap-2">
            <span class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ tools.length }}</span>
            <span class="text-sm">{{ $t('tool_list.tools') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-2xl font-bold text-gray-900 dark:text-gray-100">100%</span>
            <span class="text-sm">{{ $t('tool_list.free') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ $t('tool_list.no_signup') }}</span>
          </div>
        </div>
      </div>

      <!-- Tools Grid -->
      <div v-if="filteredTools.length > 0" class="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <ToolCard
          v-for="tool in filteredTools"
          :key="tool.name"
          :name="tool.name"
          :description="tool.description"
          :url="tool.url"
          :image="tool.image"
          :category="tool.category"
          :badge="tool.badge"
        />
      </div>

      <div v-else class="text-center py-20">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full mb-6">
          <NuxtIcon name="search" class="text-4xl text-gray-400 animate-bounce" />
        </div>
        <h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {{ $t('tool_list.no_tools_found') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ $t('tool_list.no_tools_found_desc') }} "<strong class="text-gray-900 dark:text-gray-100">{{ search }}</strong>"
        </p>
        <button
          @click="search = ''"
          class="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
        >
          {{ $t('tool_list.clear_search') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useLocalePath, useI18n } from '#i18n';
import ToolCard from '~/components/tool/ToolCard.vue';

const localePath = useLocalePath();
const { t } = useI18n();
const search = ref('');

const tools = computed(() => [
  {
    name: t('tool_list.tools_data.json_formatter.name'),
    description: t('tool_list.tools_data.json_formatter.description'),
    url: localePath('/tool/json-formatter'),
    image: '/images/tools/json-format.webp',
    category: t('tool_list.tools_data.json_formatter.category'),
    badge: t('tool_list.badge_popular'),
  },
  {
    name: t('tool_list.tools_data.base64_encoder.name'),
    description: t('tool_list.tools_data.base64_encoder.description'),
    url: localePath('/tool/base64-encoder'),
    image: '/images/tools/base64-encoder.webp',
    category: t('tool_list.tools_data.base64_encoder.category'),
  },
  {
    name: t('tool_list.tools_data.markdown_viewer.name'),
    description: t('tool_list.tools_data.markdown_viewer.description'),
    url: localePath('/tool/markdown-viewer'),
    image: '/images/tools/markdown-viewer.webp',
    category: t('tool_list.tools_data.markdown_viewer.category'),
  },
  {
    name: t('tool_list.tools_data.word_counter.name'),
    description: t('tool_list.tools_data.word_counter.description'),
    url: localePath('/tool/word-counter'),
    image: '/images/tools/word-counter.webp',
    category: t('tool_list.tools_data.word_counter.category'),
  },
  {
    name: t('tool_list.tools_data.image_generator.name'),
    description: t('tool_list.tools_data.image_generator.description'),
    url: localePath('/tool/image-generate'),
    image: '/images/tools/image-generator.jpg',
    category: t('tool_list.tools_data.image_generator.category'),
  },
]);

const filteredTools = computed(() => {
  if (!search.value.trim()) return tools.value;
  
  const query = search.value.toLowerCase();
  return tools.value.filter(
    (tool) =>
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query)
  );
});
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
