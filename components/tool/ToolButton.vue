<template>
  <button
    :disabled="disabled"
    :type="type"
    @click="handleClick"
    :class="buttonClasses"
    :title="title"
  >
    <slot name="icon">
      <NuxtIcon v-if="icon" :name="icon" class="text-sm" />
    </slot>
    <span v-if="$slots.default || label" class="ml-1.5">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '~/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
  label?: string;
  title?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'xs',
  disabled: false,
  type: 'button',
  loading: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};

const buttonClasses = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  const variantClasses = {
    primary: 'bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700 focus:ring-sky-500 shadow-sm hover:shadow',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow',
    success: 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500',
  };

  return cn(
    baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant],
    props.loading && 'opacity-75 cursor-wait'
  );
});
</script>
