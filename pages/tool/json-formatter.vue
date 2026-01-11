<template>
  <div class="p-6 pt-10 max-w-screen-xl w-full mx-auto text-gray-900 dark:text-gray-100">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2 bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
        🧹 {{ $t("json_format.title") }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">{{ $t("json_format.subtitle") }}</p>
    </div>

    <div class="flex flex-col lg:flex-row gap-6">

      <!-- Input -->
      <div class="flex-1 flex flex-col">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t("json_format.paste_json") }}</span>
          <ToolButton
            variant="secondary"
            size="xs"
            @click="clear"
          >
            {{ $t("json_format.clear") }}
          </ToolButton>
        </div>

        <ToolInput
          v-model="rawText"
          type="textarea"
          :placeholder="$t('json_format.paste_placeholder')"
          :rows="25"
          :spellcheck="false"
          class="flex-1"
        />
      </div>

      <!-- Output -->
      <div class="flex-1 flex flex-col">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t("json_format.formatted_json") }}</span>

          <div class="flex gap-2">
            <ToolButton
              variant="primary"
              size="xs"
              :disabled="blocks.length === 0"
              @click="copyAll"
            >
              <template #icon>
                <NuxtIcon name="content-copy" />
              </template>
              {{ copied ? $t("json_format.copied") : $t("json_format.copy") }}
            </ToolButton>

            <ToolButton
              variant="success"
              size="xs"
              :disabled="blocks.length === 0"
              @click="downloadAll"
            >
              {{ $t("json_format.download_json") }}
            </ToolButton>

            <ToolButton
              v-if="blocks.length > 0"
              variant="secondary"
              size="xs"
              @click="toggleFullScreen"
              :title="isFullScreen ? $t('json_format.exit_full_screen') : $t('json_format.full_screen')"
            >
              {{ isFullScreen ? $t('json_format.exit_full_screen') : $t('json_format.full_screen') }}
            </ToolButton>
          </div>
        </div>

        <div
          v-if="blocks.length"
          ref="outputContainer"
          :class="[
            'flex-1 overflow-auto border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-900 p-4 space-y-3 relative',
            isFullScreen ? 'pb-20' : ''
          ]"
        >
          <!-- Full Screen Exit Button (only visible when in fullscreen) -->
          <div
            v-if="isFullScreen"
            class="absolute top-4 right-4 z-10"
          >
            <ToolButton
              variant="danger"
              size="sm"
              @click="toggleFullScreen"
              :title="$t('json_format.exit_full_screen')"
            >
              {{ $t('json_format.exit_full_screen') }}
            </ToolButton>
          </div>

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
          class="flex-1 text-gray-400 dark:text-gray-500 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg"
        >
          {{ $t("json_format.no_result") }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import ToolButton from "~/components/tool/ToolButton.vue";
import ToolInput from "~/components/tool/ToolInput.vue";

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
    // Enter fullscreen
    outputContainer.value.style.position = "fixed";
    outputContainer.value.style.left = "0";
    outputContainer.value.style.right = "0";
    outputContainer.value.style.top = "56px"; // Header height (pt-14 = 3.5rem = 56px)
    outputContainer.value.style.bottom = "0";
    outputContainer.value.style.zIndex = "1000";
    outputContainer.value.style.height = "calc(100vh - 56px)";
    outputContainer.value.style.width = "100vw";
    outputContainer.value.style.borderRadius = "0";
    outputContainer.value.style.margin = "0";
    outputContainer.value.style.overflow = "auto";
  } else {
    // Exit fullscreen
    outputContainer.value.style.position = "";
    outputContainer.value.style.left = "";
    outputContainer.value.style.right = "";
    outputContainer.value.style.top = "";
    outputContainer.value.style.bottom = "";
    outputContainer.value.style.zIndex = "";
    outputContainer.value.style.height = "";
    outputContainer.value.style.width = "";
    outputContainer.value.style.borderRadius = "";
    outputContainer.value.style.margin = "";
    outputContainer.value.style.overflow = "";
  }

  isFullScreen.value = !isFullScreen.value;
};

// Handle ESC key to exit fullscreen
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isFullScreen.value) {
    toggleFullScreen();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
