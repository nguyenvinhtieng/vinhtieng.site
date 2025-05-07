<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 h-screen text-gray-900 dark:text-gray-100 bg-white dark:bg-black">
    <!-- Markdown Input -->
    <div class="flex flex-col">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium">Markdown Input</span>
        <div class="space-x-2">
          <button @click="clear" class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            Clear
          </button>
          <button @click="copyMarkdown" class="text-xs px-2 py-1 bg-sky-500 text-white rounded hover:bg-sky-600 transition">
            Copy
          </button>
        </div>
      </div>
      <textarea
        v-model="markdown"
        class="flex-1 w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm resize-none font-mono outline-none focus:ring-2 focus:ring-sky-500"
      />
    </div>

    <!-- Markdown Preview -->
    <div class="flex flex-col">
      <span class="text-sm font-medium mb-3">Preview</span>
      <div
        class="flex-1 p-4 border border-gray-300 dark:border-gray-700 rounded-md overflow-auto prose dark:prose-invert bg-gray-50 dark:bg-gray-900 max-w-none"
        v-html="rendered"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { marked } from 'marked';
import { SITE } from '~/constants/common';
import { useHead } from '#app';

useHead({
  title: 'Free Online Markdown Viewer | Preview Markdown Instantly',
  meta: [
    {
      name: 'description',
      content:
        'View and preview your Markdown instantly with our free online Markdown Viewer. Clean interface, real-time rendering, and easy to use.',
    },
    {
      name: 'keywords',
      content:
        'markdown viewer, markdown preview, online markdown editor, render markdown, developer tools, free markdown tool',
    },
    // Open Graph
    { property: 'og:title', content: 'Free Online Markdown Viewer' },
    {
      property: 'og:description',
      content:
        'Quickly render and preview Markdown online with this simple and fast tool. No login, no ads — just Markdown.',
    },
    {
      property: 'description:vi',
      content:
        'Xem trước và hiển thị Markdown một cách nhanh chóng bằng công cụ đơn giản và miễn phí. Không cần đăng nhập, không quảng cáo.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${SITE}/tool/markdown-viewer` },
    { property: 'og:image', content: `${SITE}/images/tool/markdown-viewer.webp` },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Free Online Markdown Viewer' },
    {
      name: 'twitter:description',
      content:
        'Preview your markdown instantly with this clean, fast, and 100% free online tool.',
    },
    { name: 'twitter:image', content: `${SITE}/images/tools/markdown-viewer.webp` },
  ],
  link: [
    { rel: 'canonical', href: `${SITE}/tools/markdown-viewer` },
  ],
});
const markdown = ref(`# Markdown Preview

- Minimal layout
- No fancy headers
- Just pure markdown viewer
`);

const rendered = computed(() => marked.parse(markdown.value));

const copyMarkdown = async () => {
  try {
    await navigator.clipboard.writeText(markdown.value);
    alert('Copied!');
  } catch {
    alert('Failed to copy.');
  }
};

const clear = () => {
  markdown.value = '';
};
</script>
