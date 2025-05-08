<template>
    <div class="p-6 max-w-screen-xl w-full mx-auto text-gray-900 dark:text-gray-100">
      <h1 class="text-3xl font-bold mb-6 text-center">🔡 {{ $t("word_counter.title") }}</h1>
  
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Input Text Area -->
        <div class="flex-1">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium">{{ $t("word_counter.enter_text") }}</span>
            <div class="flex items-center gap-2">
              <button @click="undo" :disabled="historyIndex === 0"
                class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 cursor-pointer dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition">
                {{ $t('word_counter.undo') }}
              </button>
              <button @click="redo" :disabled="historyIndex === history.length - 1"
                class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 cursor-pointer dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition">
                {{ $t('word_counter.redo') }}
              </button>
              <button @click="clear"
                class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer">
                {{ $t("word_counter.clear") }}
              </button>
            </div>
          </div>
          <textarea v-model="text" spellcheck="false" :placeholder="$t('word_counter.placeholder')"
            class="w-full h-96 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition resize-none"></textarea>
        </div>
  
        <!-- Result Panel -->
        <div class="flex-1">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium">{{ $t("word_counter.result") }}</span>
          </div>
  
          <div
            class="h-96 overflow-auto border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-900 p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow text-center">
              <div class="text-xl font-semibold text-sky-600 dark:text-sky-400">{{ wordCount }}</div>
              <div class="text-gray-600 dark:text-gray-400 mt-1">{{ $t("word_counter.words") }}</div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow text-center">
              <div class="text-xl font-semibold text-green-600 dark:text-green-400">{{ characterCount }}</div>
              <div class="text-gray-600 dark:text-gray-400 mt-1">{{ $t("word_counter.characters") }}</div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow text-center">
              <div class="text-xl font-semibold text-purple-600 dark:text-purple-400">{{ sentenceCount }}</div>
              <div class="text-gray-600 dark:text-gray-400 mt-1">{{ $t("word_counter.sentences") }}</div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow text-center">
              <div class="text-xl font-semibold text-pink-600 dark:text-pink-400">{{ paragraphCount }}</div>
              <div class="text-gray-600 dark:text-gray-400 mt-1">{{ $t("word_counter.paragraphs") }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useHead } from "#app";
  import { ref, computed, watch } from "vue";
  import { SITE } from "~/constants/common";
  
  useHead({
    title: 'Free Online Word Counter | Count Words, Characters & More',
    meta: [
      {
        name: 'description',
        content:
          'Easily count words, characters, sentences, and paragraphs with our free online word counter. Ideal for writers, students, and content creators.',
      },
      {
        name: 'keywords',
        content:
          'word counter, character counter, sentence counter, paragraph counter, online text tool, free word counter, writing tools, content analysis',
      },
      // Open Graph
      { property: 'og:title', content: 'Free Online Word Counter' },
      {
        property: 'og:description',
        content:
          'Quickly count words, characters, and more. Perfect for writers, bloggers, and students. No signup needed.',
      },
      {
        property: 'description:vi',
        content:
          'Đếm số từ, ký tự, câu và đoạn văn dễ dàng với công cụ miễn phí trực tuyến. Hoàn hảo cho người viết và học sinh.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `${SITE}/tool/word-counter` },
      { property: 'og:image', content: `${SITE}/images/tools/word-counter.webp` },
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Free Online Word Counter' },
      {
        name: 'twitter:description',
        content:
          'Get accurate word and character counts instantly. No ads, no tracking – just a clean, fast tool.',
      },
      { name: 'twitter:image', content: `${SITE}/images/tools/word-counter.webp` },
    ],
    link: [
      { rel: 'canonical', href: `${SITE}/tool/word-counter` },
    ],
  });
  
  const text = ref("");
  const history = ref<string[]>([""]); // stores history states
  const historyIndex = ref(0);
  
  const copied = ref(false);
  
  // Watch the text and update history (debounced)
  let skipNextHistoryPush = false;
  
  watch(text, (newText) => {
    if (skipNextHistoryPush) {
      skipNextHistoryPush = false;
      return;
    }
  
    // Only push if it's a real change
    if (newText !== history.value[historyIndex.value]) {
      history.value = history.value.slice(0, historyIndex.value + 1);
      history.value.push(newText);
      historyIndex.value++;
    }
  });
  
  // Undo action
  const undo = () => {
    if (historyIndex.value > 0) {
      historyIndex.value--;
      skipNextHistoryPush = true;
      text.value = history.value[historyIndex.value];
    }
  };
  
  // Redo action
  const redo = () => {
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++;
      skipNextHistoryPush = true;
      text.value = history.value[historyIndex.value];
    }
  };
  
  // Computed properties
  const wordCount = computed(() => {
    return text.value.trim().split(/\s+/).filter(Boolean).length;
  });
  
  const characterCount = computed(() => {
    return text.value.length;
  });
  
  const sentenceCount = computed(() => {
    return text.value.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  });
  
  const paragraphCount = computed(() => {
    return text.value.split(/\n+/).filter(p => p.trim().length > 0).length;
  });
  
  const clear = () => {
    text.value = "";
    copied.value = false;
  };
  </script>
  