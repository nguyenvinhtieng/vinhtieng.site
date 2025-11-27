<template>
  <div class="p-6 max-w-screen-xl w-full mx-auto text-gray-900 dark:text-gray-100">
    <h1 class="text-3xl font-bold mb-6 text-center">
      🧹 {{ $t("json_format.title") }}
    </h1>

    <div class="flex flex-col lg:flex-row gap-6">

      <!-- Input -->
      <div class="flex-1">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium">{{ $t("json_format.paste_json") }}</span>
          <button @click="clear"
            class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer">
            {{ $t("json_format.clear") }}
          </button>
        </div>

        <textarea
          v-model="rawText"
          spellcheck="false"
          :placeholder="$t('json_format.paste_placeholder')"
          class="w-full h-96 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-mono placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition resize-none"
        ></textarea>
      </div>

      <!-- Output -->
      <div class="flex-1">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium">{{ $t("json_format.formatted_json") }}</span>

          <div class="space-x-2">
            <button
              :disabled="blocks.length === 0"
              @click="copyAll"
              class="text-xs px-2 py-1 bg-sky-500 text-white rounded hover:bg-sky-600 transition cursor-pointer disabled:pointer-none disabled:bg-gray-400">
              {{ copied ? $t("json_format.copied") : $t("json_format.copy") }}
            </button>

            <button
              :disabled="blocks.length === 0"
              @click="downloadAll"
              class="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer disabled:pointer-none disabled:bg-gray-400">
              {{ $t("json_format.download_json") }}
            </button>
          </div>
        </div>

        <div
          v-if="blocks.length"
          ref="outputContainer"
          class="h-96 overflow-auto border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-900 p-4 space-y-3"
        >
          <button
            @click="toggleFullScreen"
            class="ml-auto block text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer"
            title="Full Screen">
            Toggle Full Screen
          </button>
          <!-- Render blocks -->
          <div>
            <div v-for="(b, idx) in blocks" :key="idx">
              <!-- Plain text block -->
              <p v-if="b.type === 'text'"
                class="whitespace-pre-wrap text-sm font-mono">
                {{ b.content }}
              </p>

              <!-- JSON block with collapse -->
              <div v-else class="border border-neutral-100 rounded bg-white dark:bg-gray-800 p-2">
                  <VueJsonPretty
                    :data="b.content as string"
                    :deep="Infinity"
                    :showLine="true"
                    :showIcon="true"
                    :showDoubleQuotes="false"
                    :showLength="true"
                  />
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="text-gray-400 dark:text-gray-500 h-96 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg"
        >
          {{ $t("json_format.no_result") }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
interface Block {
  type: "text" | "json";
  content: string | object;
}
const rawText = ref("");
const blocks = ref<Block[]>([]);
const copied = ref(false);
const outputContainer = ref<HTMLElement | null>(null);
const isFullScreen = ref(false);

const parseBlocks = (input: string) => {
  const result: any[] = [];
  let i = 0;

  while (i < input.length) {
    // Find JSON start
    if (input[i] === '{' || input[i] === '[') {

      const start = i;
      const isArray = input[i] === '[';
      const openChar = isArray ? '[' : '{';
      const closeChar = isArray ? ']' : '}';

      let depth = 0;
      let j = i;

      // Traverse to the corresponding closing bracket
      while (j < input.length) {
        if (input[j] === openChar) depth++;
        if (input[j] === closeChar) depth--;

        j++;

        if (depth === 0) break;
      }

      const jsonStr = input.slice(start, j);

      // Before JSON (text)
      if (start > 0) {
        const beforeText = input.slice(0, start);
        if (beforeText.trim() !== "")
          result.push({ type: "text", content: beforeText });
      }

      // Parse JSON block
      try {
        result.push({
          type: "json",
          content: JSON.parse(jsonStr),
        });
      } catch {
        result.push({
          type: "text",
          content: jsonStr,
        });
      }

      // Remove processed part & reset input
      input = input.slice(j);
      i = 0;
      continue;
    }

    i++;
  }

  // Remaining text at the end
  if (input.trim() !== "") {
    result.push({ type: "text", content: input });
  }

  return result;
};

watch(rawText, (val) => {
  blocks.value = parseBlocks(val);
});

const makeOutputString = () => {
  return blocks.value
    .map((b) =>
      b.type === "text"
        ? b.content
        : JSON.stringify(b.content, null, 2)
    )
    .join("");
};

const copyAll = () => {
  navigator.clipboard.writeText(makeOutputString()).then(() => {
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  });
};

const downloadAll = () => {
  const blob = new Blob([makeOutputString()], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "formatted.txt";
  a.click();
  URL.revokeObjectURL(a.href);
};

const clear = () => {
  rawText.value = "";
  blocks.value = [];
};


const toggleFullScreen = () => {
  if (!outputContainer.value) return;

  if (!isFullScreen.value) {
    outputContainer.value.style.position = "fixed";
    outputContainer.value.style.left = "0";
    outputContainer.value.style.right = "0";
    outputContainer.value.style.bottom = "0";
    outputContainer.value.style.zIndex = "1000";
    outputContainer.value.style.height = "calc(100vh - 64px)";
  } else {
    outputContainer.value.style = "";
  }

  isFullScreen.value = !isFullScreen.value;
};
</script>
