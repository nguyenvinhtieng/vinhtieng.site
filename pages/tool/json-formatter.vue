<template>
  <div
    class="p-6 max-w-screen-xl w-full mx-auto text-gray-900 dark:text-gray-100"
  >
    <h1 class="text-3xl font-bold mb-6 text-center">
      🧹 {{ $t("json_format.title") }}
    </h1>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Input JSON -->
      <div class="flex-1">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium">{{ $t("json_format.paste_json") }}</span>
          <div class="space-x-2">
            <button @click="clear" class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer">
              {{ $t("json_format.clear") }}
            </button>
          </div>
        </div>
        <textarea
          v-model="rawJson"
          spellcheck="false"
          :placeholder="$t('json_format.paste_placeholder')"
          class="w-full h-96 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-mono placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition resize-none"
        ></textarea>

        <p v-if="error" class="text-red-500 mt-2 text-sm">{{ error }}</p>
      </div>

      <!-- Output JSON -->
      <div class="flex-1">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium">{{ $t("json_format.formatted_json") }}</span>
          <div class="space-x-2">
            <button
              :disabled="!formatted"
              @click="copyToClipboard"
              class="text-xs px-2 py-1 bg-sky-500 text-white rounded hover:bg-sky-600 transition cursor-pointer disabled:pointer-none disabled:bg-gray-400">
              {{ copied ? $t("json_format.copied") : $t("json_format.copy") }}
            </button>

            <!-- download json -->
            <button
              :disabled="!formatted"
              @click="downloadJson"
              class="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer disabled:pointer-none disabled:bg-gray-400">
              {{ $t("json_format.download_json") }}
            </button>
            <!-- download yaml -->
            <button
              :disabled="!formatted"
              @click="downloadYaml"
              class="text-xs px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition cursor-pointer disabled:pointer-none disabled:bg-gray-400">
              {{ $t("json_format.export_yaml") }}
            </button>
          </div>
        </div>
        <div
          v-if="formatted"
          ref="outputContainer"
          class="h-96 overflow-auto border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-900 p-4 relative"
        >
          <!-- Add full screen button -->
          <button
            @click="toggleFullScreen"
            class="ml-auto block text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer disabled:pointer-none disabled:bg-gray-400"
            title="Full Screen"
          >
          Toggle Full screen
          </button>

          <!-- Formatted JSON -->
          <VueJsonPretty
            :data="formatted"
            :deep="Infinity"
            :showLine="true"
            :showIcon="true"
            :showDoubleQuotes="false"
            :showLength="true"
          />
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
import YAML from "yaml";
import { useI18n } from "vue-i18n";
import { SITE } from "~/constants/common";
import { useHead } from "#app";

useHead({
  title: 'Free Online JSON Formatter & Viewer | Beautify JSON Easily',
  meta: [
    {
      name: 'description',
      content:
        'Use our free online JSON formatter to easily beautify, validate, and view JSON data. Copy, download, or convert your JSON to YAML in one click.',
    },
    {
      name: 'keywords',
      content:
        'json formatter, json viewer, beautify json, format json online, convert json to yaml, online tools, free developer tools',
    },
    // Open Graph
    { property: 'og:title', content: 'Free Online JSON Formatter & Viewer' },
    {
      property: 'og:description',
      content:
        'Paste your JSON and instantly format it beautifully. Convert to YAML, download or copy to clipboard. 100% free.',
    },
    {
      property: 'description:vi',
      content:
        'Dán JSON của bạn và ngay lập tức định dạng nó một cách đẹp mắt. Chuyển đổi sang YAML, tải xuống hoặc sao chép vào clipboard. Hoàn toàn miễn phí.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${SITE}/tool/json-formatter` },
    { property: 'og:image', content: `${SITE}/images/tools/json-format.webp` },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Free Online JSON Formatter & Viewer' },
    {
      name: 'twitter:description',
      content:
        'Beautify and explore JSON instantly with this free online tool. Includes copy, download, and YAML export.',
    },
    { name: 'twitter:image', content: `${SITE}/images/tools/json-format.webp` },
  ],
  link: [
    { rel: 'canonical', href: `${SITE}/tool/json-formatter` },
  ],
});

const { t } = useI18n();

const rawJson = ref("");
const formatted = ref<any>(null);
const error = ref("");
const outputContainer = ref<HTMLElement | null>(null);

// Auto format on input
watch([rawJson], () => {
  try {
    error.value = "";
    const parsed = JSON.parse(rawJson.value);
    formatted.value = parsed;
  } catch (e: any) {
    formatted.value = null;
    error.value = t("json_format.invalid_json") + e.message;
  }
});

const clear = () => {
  rawJson.value = "";
  formatted.value = null;
  error.value = "";
};

const downloadFile = (
  content: string,
  filename: string,
  type = "text/plain"
) => {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

const downloadJson = () => {
  try {
    const jsonString = JSON.stringify(
      JSON.parse(rawJson.value),
      null,
      2
    );
    downloadFile(jsonString, "formatted.json", "application/json");
  } catch (e: any) {
  }
};

const downloadYaml = () => {
  try {
    const parsed = JSON.parse(rawJson.value);
    const yaml = YAML.stringify(parsed);
    downloadFile(yaml, "data.yaml", "text/yaml");
  } catch (e: any) {
  }
};
const copied = ref<boolean>(false);
// Copy to clipboard
const copyToClipboard = () => {
  const formattedJson = JSON.stringify(formatted.value, null, 2);
  navigator.clipboard
    .writeText(formattedJson)
    .then(() => {
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    })
    .catch();
};

const isFullScreen = ref<boolean>(false);
const toggleFullScreen = () => {
  if (!outputContainer.value) return;

  if (!isFullScreen.value) {
    outputContainer.value.style.position = "fixed";
    // outputContainer.value.style.top = "0";
    outputContainer.value.style.left = "0";
    outputContainer.value.style.right = "0";
    outputContainer.value.style.bottom = "0";
    outputContainer.value.style.zIndex = "1000";
    outputContainer.value.style.height = "calc(100vh - 64px)";
  } else {
    outputContainer.value.style.position = "";
    outputContainer.value.style.left = "";
    outputContainer.value.style.right = "";
    outputContainer.value.style.bottom = "";
    outputContainer.value.style.zIndex = "";
    outputContainer.value.style.height = ""; // h-96
  }
  isFullScreen.value = !isFullScreen.value;
};
</script>
