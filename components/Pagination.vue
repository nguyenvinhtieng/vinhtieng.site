<template>
  <nav class="flex justify-center mt-8" v-if="totalPages > 1">
    <ul class="inline-flex items-center gap-2">
      <li>
        <button
          :class="cn(
            'flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-sm',
            {
              'cursor-not-allowed': currentPage === 1,
            }
          )"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
          aria-label="Previous page"
        >
          &laquo;
        </button>
      </li>

      <li v-for="page in visiblePages" :key="page">
        <button
          :class="cn(
            'flex items-center justify-center min-w-10 h-10 px-3 rounded-lg border font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-95',
            {
              'bg-sky-500 text-white border-sky-500 cursor-default shadow-md hover:shadow-md hover:scale-100': page === currentPage,
              'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 hover:border-sky-300 dark:hover:border-sky-700': page !== currentPage,
            }
          )"
          @click="goToPage(page)"
          :aria-label="`Go to page ${page}`"
          :aria-current="page === currentPage ? 'page' : undefined"
        >
          {{ page }}
        </button>
      </li>

      <li>
        <button
          :class="cn(
            'flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-sm',
            {
              'cursor-not-allowed': currentPage === totalPages,
            }
          )"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
          aria-label="Next page"
        >
          &raquo;
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { cn } from "@/utils/cn";
import { computed } from "vue";

const props = defineProps<{
  currentPage: number;
  totalItems: number;
  perPage: number;
  maxVisiblePages?: number;
}>();

const emit = defineEmits<{
  (e: "update:page", page: number): void;
}>();

const totalPages = computed(() => Math.ceil(props.totalItems / props.perPage));

const visiblePages = computed(() => {
  const max = props.maxVisiblePages ?? 5;
  const half = Math.floor(max / 2);
  let start = Math.max(1, props.currentPage - half);
  let end = Math.min(totalPages.value, start + max - 1);

  if (end - start < max - 1) {
    start = Math.max(1, end - max + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value || page === props.currentPage) return;
  emit("update:page", page);
}
</script>
