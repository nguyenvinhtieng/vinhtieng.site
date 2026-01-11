<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-14 h-screen text-gray-900 dark:text-gray-100">
    <!-- Markdown Input -->
    <div class="flex flex-col">
      <div class="flex justify-between items-center mb-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('markdown_viewer.markdown_input') }}</label>
        <div class="flex gap-2">
          <ToolButton
            variant="secondary"
            size="xs"
            @click="clear"
          >
            {{ $t('markdown_viewer.clear') }}
          </ToolButton>
          <ToolButton
            variant="primary"
            size="xs"
            @click="copyMarkdown"
          >
            <template #icon>
              <NuxtIcon name="content-copy" />
            </template>
            {{ copied ? $t('markdown_viewer.copied') : $t('markdown_viewer.copy') }}
          </ToolButton>
        </div>
      </div>
      <div class="flex-1">
        <ToolInput
          v-model="markdown"
          type="textarea"
          :rows="20"
          :placeholder="$t('markdown_viewer.placeholder')"
          class="h-full"
        />
      </div>
    </div>

    <!-- Markdown Preview -->
    <div class="flex flex-col">
      <span class="text-sm font-medium mb-3">{{ $t('markdown_viewer.preview') }}</span>
      <div
        class="flex-1 p-4 border border-gray-300 dark:border-gray-700 rounded-md overflow-auto bg-gray-50 dark:bg-gray-900">
          <iframe ref="preview" class="w-full h-full border-none"
            :srcdoc="renderedWithStyles"></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { marked } from 'marked';
import { SITE } from '~/constants/common';
import { useHead } from '#app';
import { storeToRefs } from 'pinia';
import useCommonStore from '~/stores/common.store';
import ToolButton from '~/components/tool/ToolButton.vue';
import ToolInput from '~/components/tool/ToolInput.vue';

const commonStore = useCommonStore();
const { theme } = storeToRefs(commonStore);

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

const renderedWithStyles = computed(() => {
  const html = rendered.value;
  const isDark = theme.value === 'dark';
  
  const styles = isDark
    ? `
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Montserrat', sans-serif;
          background-color: #111827;
          color: #e5e7eb;
          padding: 1rem;
          line-height: 1.75;
        }
        h1 { font-size: 2.25rem; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; color: #f9fafb; }
        h2 { font-size: 1.875rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #f3f4f6; }
        h3 { font-size: 1.5rem; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.5rem; color: #f3f4f6; }
        h4 { font-size: 1.25rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; color: #e5e7eb; }
        p { margin-bottom: 1rem; color: #d1d5db; }
        ul, ol { margin-bottom: 1rem; padding-left: 1.5rem; color: #d1d5db; }
        li { margin-bottom: 0.25rem; }
        code { background-color: #374151; color: #60a5fa; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875em; }
        pre { background-color: #1f2937; color: #e5e7eb; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin-bottom: 1rem; }
        pre code { background-color: transparent; color: inherit; padding: 0; }
        blockquote { border-left: 4px solid #3b82f6; padding-left: 1rem; margin: 1rem 0; color: #9ca3af; }
        a { color: #60a5fa; text-decoration: underline; }
        table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        th, td { border: 1px solid #374151; padding: 0.5rem; }
        th { background-color: #1f2937; font-weight: 600; }
        hr { border-color: #374151; margin: 1.5rem 0; }
      </style>
    `
    : `
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Montserrat', sans-serif;
          background-color: #ffffff;
          color: #374151;
          padding: 1rem;
          line-height: 1.75;
        }
        h1 { font-size: 2.25rem; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; color: #111827; }
        h2 { font-size: 1.875rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #1f2937; }
        h3 { font-size: 1.5rem; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.5rem; color: #1f2937; }
        h4 { font-size: 1.25rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; color: #374151; }
        p { margin-bottom: 1rem; color: #4b5563; }
        ul, ol { margin-bottom: 1rem; padding-left: 1.5rem; color: #4b5563; }
        li { margin-bottom: 0.25rem; }
        code { background-color: #eff6ff; color: #2563eb; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875em; }
        pre { background-color: #1f2937; color: #ffffff; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin-bottom: 1rem; }
        pre code { background-color: transparent; color: inherit; padding: 0; }
        blockquote { border-left: 4px solid #3b82f6; padding-left: 1rem; margin: 1rem 0; color: #6b7280; background-color: #eff6ff; }
        a { color: #2563eb; text-decoration: underline; }
        table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        th, td { border: 1px solid #d1d5db; padding: 0.5rem; }
        th { background-color: #f9fafb; font-weight: 600; }
        hr { border-color: #d1d5db; margin: 1.5rem 0; }
      </style>
    `;
  
  return `<!DOCTYPE html><html><head>${styles}</head><body>${html}</body></html>`;
});

const copied = ref(false);
const copyMarkdown = async () => {
  try {
    await navigator.clipboard.writeText(markdown.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    // Silently fail
  }
};

const clear = () => {
  markdown.value = '';
};
</script>
