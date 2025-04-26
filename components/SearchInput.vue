<template>
  <div
    @click="openShortcutModal"
    :class="
      cn(
        'relative w-full max-w-md border-gray-300 rounded-lg shadow-sm flex focus:ring-2 cursor-pointer dark:border-white dark:shadow-neutral-800',
        {
          'text-sm px-4 py-2': size === 'md',
          'text-lg px-6 py-3': size === 'lg',
          'text-xs px-2 py-1': size === 'sm',
        }
      )
    "
  >
    <p class="flex-1 text-neutral-400 truncate pr-12">
      {{ $t("search.placeholder") }}
    </p>
    <button
      class="absolute inset-y-0 right-0 flex items-center gap-1 px-3 text-neutral-400"
    >
      <Icon name="ic:baseline-window" class="w-4 h-4" />
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
