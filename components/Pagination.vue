<template>
  <nav class="flex justify-center mt-4" v-if="totalPages > 1">
    <ul class="inline-flex items-center gap-1">
      <li>
        <button
          :class="cn('w-10 rounded border border-neutral-200 aspect-square hover:bg-neutral-100 cursor-pointer disabled:bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:disabled:bg-neutral-700 dark:text-neutral-400', {
			'cursor-not-allowed': currentPage === 1,
		  })"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          &laquo;
        </button>
      </li>

      <li v-for="page in visiblePages" :key="page">
        <button
          class="w-10 rounded border border-neutral-200 aspect-square dark:border-neutral-800"
          :class="{
            'bg-blue-500 text-white cursor-not-allowed': page === currentPage,
            'hover:bg-gray-100 cursor-pointer dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200': page !== currentPage,
          }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </li>

      <li>
        <button
			:class="cn('w-10 rounded border border-neutral-200 aspect-square hover:bg-neutral-100 cursor-pointer disabled:bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:disabled:bg-neutral-600 dark:text-neutral-400', {
			'cursor-not-allowed': currentPage === totalPages,
		  })"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          &raquo;
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { cn } from "@/utils/cn";
import { computed, defineProps, defineEmits } from "vue";

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
