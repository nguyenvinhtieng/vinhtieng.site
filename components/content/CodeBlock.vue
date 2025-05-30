<template>
  <div
    class="border border-neutral-200 rounded-xl overflow-hidden my-6 shadow-sm dark:border-neutral-800"
  >
    <!-- Tab Bar -->
    <div
      class="bg-neutral-50 flex items-center justify-between px-4 py-1 text-sm font-medium text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
    >
      <div class="flex gap-2 overflow-auto">
        <button
          v-for="(file, index) in files"
          :key="index"
          @click="activeIndex = index"
          class="border rounded-md px-3 py-1 transition-all flex gap-1 justify-center items-center"
          :class="{
            'text-neutral-700 border-neutral-200 bg-white dark:text-neutral-300 dark:bg-neutral-800 dark:border-neutral-700': activeIndex === index,
            'text-neutral-500 border-transparent hover:border-neutral-200 cursor-pointer dark:hover:border-neutral-700 dark:hover:bg-neutral-800':
              activeIndex !== index,
          }"
        >
          <NuxtImg
            :src="icons[file.language] || '/images/icons/default.svg'"
            class="w-4 h-4 object-contain m-0 border-none rounded-none"
            alt="language icon"
            width="16"
            height="16"
            :title="file.language"
          />
          <span>{{ file.title }}</span>
        </button>
      </div>
      <!-- Copy Button -->
      <button
        @click="copyToClipboard"
        class="flex items-center gap-2 text-neutral-500 dark:text-neutral-300 hover:text-green-500 cursor-pointer transition-colors px-2 py-1 rounded-md hover:bg-gray-200 active:scale-95 dark:hover:bg-neutral-800"
      >
        <NuxtIcon name="content-copy" class="text-md" />
        <span class="inline">{{ copied ? "Copied!" : "Copy" }}</span>
      </button>
    </div>

    <!-- Code Display -->
    <pre class="text-sm overflow-auto my-0 p-0 bg-transparent"><code
		  ref="codeBlock"
		  :key="activeIndex"
		  :class="`language-${activeFile.language} p-0 w-full `"
		>{{ activeFile.content }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";

// Import highlight.js and support languages
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";
import json from "highlight.js/lib/languages/json";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import php from "highlight.js/lib/languages/php";
import java from "highlight.js/lib/languages/java";
import csharp from "highlight.js/lib/languages/csharp";
import gopher from "highlight.js/lib/languages/go";
import ini from "highlight.js/lib/languages/ini";
import yaml from "highlight.js/lib/languages/yaml";
import nginx from "highlight.js/lib/languages/nginx";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("css", css);
hljs.registerLanguage("html", html);
hljs.registerLanguage("json", json);
hljs.registerLanguage("dockerfile", dockerfile);
hljs.registerLanguage("php", php);
hljs.registerLanguage("java", java);
hljs.registerLanguage("csharp", csharp);
hljs.registerLanguage("go", gopher);
hljs.registerLanguage("ini", ini);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("nginx", nginx);

import "highlight.js/styles/vs2015.min.css";

interface FileBlock {
  title: string;
  language: string;
  content: string;
}
const icons: Record<string, string> = {
	typescript: '/images/icons/typescript.svg',
	python: '/images/icons/python.svg',
	javascript: '/images/icons/javascript.svg',
	html: '/images/icons/html.svg',
	css: '/images/icons/css.svg',
	bash: '/images/icons/bash.svg',
	json: '/images/icons/json.svg',
	dockerfile: '/images/icons/dockerfile.svg',
  babel: '/images/icons/babel.svg',
  gopher: '/images/icons/gopher.svg',
  php: '/images/icons/php.svg',
  java: '/images/icons/java.svg',
  csharp: '/images/icons/csharp.svg',
  jenkins: '/images/icons/jenkins.svg',
  vite: '/images/icons/vite.svg',
  nginx: '/images/icons/nginx.svg',
}

const props = defineProps<{
  files: FileBlock[];
}>();

const activeIndex = ref(0);
const activeFile = computed(() => props.files[activeIndex.value]);

const codeBlock = ref<HTMLElement | null>(null);
const copied = ref(false);
let timer: NodeJS.Timeout | null = null;

const highlightCode = () => {
  nextTick(() => {
    if (codeBlock.value) {
      hljs.highlightElement(codeBlock.value);
    }
  });
};

const fallbackCopyText = (text: string) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    document.execCommand("copy");
    copied.value = true;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      copied.value = false;
      timer = null;
    }, 1000);
  } catch (err) {
  }

  document.body.removeChild(textarea);
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(activeFile.value.content);
    copied.value = true;

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      copied.value = false;
      timer = null;
    }, 1000);
  } catch (err) {
    fallbackCopyText(activeFile.value.content);
  }
};



onMounted(highlightCode);
watch(() => activeFile.value.content, highlightCode);
</script>
