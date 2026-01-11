<template>
  <div :class="containerClasses">
    <label v-if="label" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div v-if="type === 'textarea'" class="relative flex-1 flex flex-col">
      <textarea
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        :class="textareaClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeydown"
        :spellcheck="spellcheck"
      />
      <div v-if="showCharacterCount && maxLength" class="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
        {{ characterCount }} / {{ maxLength }}
      </div>
    </div>

    <input
      v-else
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :min="min"
      :max="max"
      :step="step"
      :class="inputClasses"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      @keydown="handleKeydown"
      :spellcheck="spellcheck"
    />

    <p v-if="error && error.trim()" class="mt-1 text-xs text-red-500 dark:text-red-400 break-words">{{ error }}</p>
    <p v-if="helperText && !error" class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ helperText }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '~/utils/cn';

interface Props {
  modelValue: string | number;
  type?: 'text' | 'textarea' | 'number' | 'password' | 'email' | 'url' | 'color';
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  spellcheck?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  class?: string;
  hasError?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  rows: 10,
  spellcheck: false,
  showCharacterCount: false,
  size: 'md',
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  'blur': [event: FocusEvent];
  'focus': [event: FocusEvent];
  'keydown': [event: KeyboardEvent];
  'keydown.enter': [event: KeyboardEvent];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  if (props.type === 'number') {
    const numValue = parseFloat(target.value);
    emit('update:modelValue', isNaN(numValue) ? 0 : numValue);
  } else if (props.type === 'color') {
    emit('update:modelValue', target.value);
  } else {
    emit('update:modelValue', target.value);
  }
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};

const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
};

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event);
  if (event.key === 'Enter') {
    emit('keydown.enter', event);
  }
};

const characterCount = computed(() => {
  if (typeof props.modelValue === 'string') {
    return props.modelValue.length;
  }
  return 0;
});

const containerClasses = computed(() => {
  return cn('flex flex-col', props.class);
});

const baseClasses = 'w-full rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border-gray-300 dark:border-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

const textareaClasses = computed(() => {
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-4 py-2.5',
  };

  return cn(
    baseClasses,
    'font-mono resize-none flex-1',
    sizeClasses[props.size],
    (props.error || props.hasError) && 'border-red-500 dark:border-red-500 focus:ring-red-500',
    props.readonly && 'bg-gray-100 dark:bg-gray-900 cursor-default'
  );
});

const inputClasses = computed(() => {
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-4 py-2.5',
  };

  const typeClasses = {
    text: '',
    number: '',
    password: 'font-mono',
    email: '',
    url: '',
    color: 'h-10 p-1 cursor-pointer resize-none',
  };

  return cn(
    baseClasses,
    'resize-none',
    sizeClasses[props.size],
    typeClasses[props.type],
    (props.error || props.hasError) && 'border-red-500 dark:border-red-500 focus:ring-red-500',
    props.readonly && 'bg-gray-100 dark:bg-gray-900 cursor-default'
  );
});
</script>
