<template>
    <div class="p-6 pt-10 max-w-screen-xl w-full mx-auto text-gray-900 dark:text-gray-100">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2 bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
        🔡 {{ $t("word_counter.title") }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">{{ $t("word_counter.subtitle") }}</p>
    </div>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Input Text Area -->
      <div class="flex-1">
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t("word_counter.enter_text") }}</label>
          <div class="flex items-center gap-2">
            <ToolButton
              variant="secondary"
              size="xs"
              :disabled="historyIndex === 0"
              @click="undo"
            >
              {{ $t('word_counter.undo') }}
            </ToolButton>
            <ToolButton
              variant="secondary"
              size="xs"
              :disabled="historyIndex === history.length - 1"
              @click="redo"
            >
              {{ $t('word_counter.redo') }}
            </ToolButton>
            <ToolButton
              variant="secondary"
              size="xs"
              @click="clear"
            >
              {{ $t("word_counter.clear") }}
            </ToolButton>
          </div>
        </div>
        <ToolInput
          v-model="text"
          type="textarea"
          :placeholder="$t('word_counter.placeholder')"
          :rows="25"
          :spellcheck="false"
        />
      </div>

      <!-- Result Panel -->
      <div class="flex-1">
        <div class="flex justify-between items-center mb-3">
          <span class="text-sm font-medium">{{ $t("word_counter.result") }}</span>
        </div>

        <div
          class="h-96 overflow-auto border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-900 p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm items-stretch">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow text-center flex flex-col justify-center">
            <div class="text-xl font-semibold text-sky-600 dark:text-sky-400">{{ wordCount }}</div>
            <div class="text-gray-600 dark:text-gray-400 mt-1">{{ $t("word_counter.words") }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow text-center flex flex-col justify-center">
            <div class="text-xl font-semibold text-green-600 dark:text-green-400">{{ characterCount }}</div>
            <div class="text-gray-600 dark:text-gray-400 mt-1">{{ $t("word_counter.characters") }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow text-center flex flex-col justify-center">
            <div class="text-xl font-semibold text-purple-600 dark:text-purple-400">{{ sentenceCount }}</div>
            <div class="text-gray-600 dark:text-gray-400 mt-1">{{ $t("word_counter.sentences") }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow text-center flex flex-col justify-center">
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
import ToolButton from "~/components/tool/ToolButton.vue";
import ToolInput from "~/components/tool/ToolInput.vue";

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
