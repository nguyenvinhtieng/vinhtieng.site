<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = defineProps<{
  type?: 'info' | 'warning' | 'error' | 'success'
}>()
</script>

<template>
  <div :class="cn('p-4 bg-neutral-100 rounded-md border-l-8 dark:text-neutral-600 my-4', {
    'border-blue-400 bg-blue-50 dark:bg-blue-200': props.type === 'info',
    'border-yellow-500 bg-amber-50 dark:bg-amber-200': props.type === 'warning',
    'border-red-500 bg-red-50 dark:bg-red-200': props.type === 'error',
    'border-green-500 bg-green-50 dark:bg-green-200': props.type === 'success',
  })">
    <slot mdc-unwrap="p" />
  </div>
</template>