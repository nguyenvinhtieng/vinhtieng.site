<template>
	<span
	 :class="cn('bg-neutral-100 text-neutral-600 font-semibold px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer hover:bg-neutral-200 transition dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 duration-200 ease-in-out border border-neutral-200 dark:border-neutral-700', {
		'text-xs px-2 py-1': size === 'sm',
		'text-base px-4 py-2': size === 'lg',
		'text-sm px-3 py-1': size === 'md',
		'!bg-blue-500 !text-white': isActive,
	 })"
  >
  <Icon name="mdi:tag-multiple" class="w-4 h-4 mr-1" />
	<span class="font-medium">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">

import { cn } from '@/utils/cn';
import type { PropType } from 'vue';

defineProps({
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    default: 'md',
  },
  label: {
	type: String,
	required: true,
  },
  isActive: {
	type: Boolean,
	default: false,
  },
});
</script>