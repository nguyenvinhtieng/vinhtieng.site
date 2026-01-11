<template>
  <NuxtLink
    :to="url"
    :class="cardClasses"
    :external="external"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden rounded-t-lg relative">
      <img
        :src="image"
        :alt="name"
        :class="imageClasses"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300" :class="{ 'opacity-100': isHovered }" />
      
      <!-- Badge/Icon overlay -->
      <div v-if="badge" class="absolute top-3 right-3 px-2 py-1 bg-sky-500 text-white text-xs font-semibold rounded-full shadow-lg">
        {{ badge }}
      </div>
    </div>
    
    <div class="p-5 flex flex-col flex-1">
      <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
        {{ name }}
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-1">
        {{ description }}
      </p>
      
      <div class="mt-4 flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <span class="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
          <NuxtIcon name="tag" class="text-xs animate-float-icon" />
          {{ category || 'Tool' }}
        </span>
        <span class="text-xs text-sky-600 dark:text-sky-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
          Try it
          <NuxtIcon name="external" class="text-xs transform group-hover:translate-x-0.5 transition-transform animate-float-icon" />
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { cn } from '~/utils/cn';

interface Props {
  name: string;
  description: string;
  url: string;
  image: string;
  badge?: string;
  category?: string;
  external?: boolean;
}

const props = defineProps<Props>();

const isHovered = ref(false);

const cardClasses = computed(() => {
  return cn(
    'group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col',
    'hover:border-sky-300 dark:hover:border-sky-700 hover:-translate-y-1',
    'focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2'
  );
});

const imageClasses = computed(() => {
  return cn(
    'w-full h-full object-cover transition-transform duration-500',
    isHovered.value && 'scale-110'
  );
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes float-icon {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-3px) rotate(5deg);
  }
  50% {
    transform: translateY(0px) rotate(0deg);
  }
  75% {
    transform: translateY(3px) rotate(-5deg);
  }
}

.animate-float-icon {
  animation: float-icon 4s ease-in-out infinite;
}
</style>
