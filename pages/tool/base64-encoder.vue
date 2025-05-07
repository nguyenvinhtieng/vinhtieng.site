<template>
  <div class="p-6 max-w-screen-xl w-full mx-auto text-gray-900 dark:text-gray-100 relative">
    <h1 class="text-3xl font-bold mb-6 text-center">🔁 Base64 Converter</h1>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Input Area -->
      <div class="w-full">
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium">Input Text</label>
          <button
            @click="mode = mode === 'encode' ? 'decode' : 'encode'"
            class="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Switch to {{ mode === 'encode' ? 'Decode' : 'Encode' }}
          </button>
        </div>
        <textarea
          v-model="input"
          placeholder="Type or paste text here..."
          class="w-full h-64 px-4 py-2 rounded-md border bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border-gray-300 dark:border-gray-700 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <!-- Output Area -->
      <div class="w-full relative">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium">Result ({{ mode === 'encode' ? 'Base64' : 'Decoded' }})</span>
          <div class="space-x-2">
            <button
              @click="copyToClipboard"
              :disabled="!result"
              class="text-xs px-2 py-1 bg-sky-500 text-white rounded hover:bg-sky-600 transition cursor-pointer disabled:pointer-none disabled:bg-gray-400">
              {{ copied ? $t("json_format.copied") : $t("json_format.copy") }}
            </button>
          </div>
        </div>
        <textarea
          :value="result"
          readonly
          class="w-full h-64 px-4 py-2 rounded-md border bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 shadow-sm resize-none"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#app';
import { ref, computed } from 'vue';
import { SITE } from '~/constants/common';

const input = ref('');
const mode = ref<'encode' | 'decode'>('encode');

useHead({
  title: 'Free Online Base64 Encoder | Encode Text to Base64 Easily',
  meta: [
    {
      name: 'description',
      content:
        'Encode your text to Base64 easily with our free online tool. Paste text, encode instantly, and copy the result in one click.',
    },
    {
      name: 'keywords',
      content:
        'base64 encoder, online base64 tool, encode to base64, free encoder, developer tools, online text encoder',
    },
    // Open Graph
    { property: 'og:title', content: 'Free Online Base64 Encoder' },
    {
      property: 'og:description',
      content:
        'Paste your text and encode it to Base64 instantly. Free, fast, and easy-to-use developer tool.',
    },
    {
      property: 'description:vi',
      content:
        'Dán văn bản và mã hóa sang Base64 ngay lập tức. Công cụ dành cho lập trình viên, miễn phí và dễ sử dụng.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${SITE}/tool/base64-encoder` },
    { property: 'og:image', content: `${SITE}/images/tools/base64-encoder.webp` },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Free Online Base64 Encoder' },
    {
      name: 'twitter:description',
      content:
        'Quickly encode text to Base64 with our free online tool. Includes copy to clipboard support.',
    },
    { name: 'twitter:image', content: `${SITE}/images/tools/base64-encoder.webp` },
  ],
  link: [{ rel: 'canonical', href: `${SITE}/tool/base64-encoder` }],
});

const result = computed(() => {
  try {
    if (!input.value) return '';
    return mode.value === 'encode'
      ? btoa(unescape(encodeURIComponent(input.value)))
      : decodeURIComponent(escape(atob(input.value)));
  } catch {
    return '[Error decoding input]';
  }
});

const copied = ref<boolean>(false);
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(result.value);
    copied.value = true;

    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {}
};
</script>
