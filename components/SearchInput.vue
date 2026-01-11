<template>
  <div
    @click="openShortcutModal"
    :class="
      cn(
        'relative w-full border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 flex items-center focus:ring-2 focus:ring-sky-500 cursor-pointer transition-all text-gray-900 dark:text-gray-100',
        {
          'text-sm px-4 py-2': size === 'md',
          'text-lg px-6 py-3': size === 'lg',
          'text-xs px-2 py-1': size === 'sm',
        }
      )
    "
  >
    <p class="flex-1 text-neutral-600 dark:text-neutral-400 truncate pr-12">
      {{ $t("search.placeholder") }}
    </p>
    <button
      class="absolute inset-y-0 right-0 flex items-center gap-1 px-3 text-neutral-600 dark:text-neutral-400"
    >
      <NuxtIcon name="window" class="text-lg" />
      +
      <span class="font-mono text-xs">K</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { cn } from "@/utils/cn";

import type { PropType } from "vue";
import useCommonStore from "~/stores/common.store";

const commonStore = useCommonStore();

defineProps({
  size: {
    type: String as PropType<"sm" | "md" | "lg">,
    default: "md",
  },
});

const openShortcutModal = () => {
  commonStore.toggleOpenSearchDialog();
};
</script>
