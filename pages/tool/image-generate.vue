<template>
  <div class="p-6 max-w-screen-lg mx-auto text-gray-900 dark:text-gray-100">
    <h1 class="text-3xl font-bold mb-8 text-center">
      🖼️ Generate Image
    </h1>

    <div
      class="flex flex-col gap-6 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <!-- Form -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Width -->
        <div>
          <label class="block mb-1 font-semibold">Width (px)</label>
          <input
            v-model.number="form.width"
            type="number"
            min="1"
            placeholder="e.g. 1920"
            @blur="handleGenerate"
            @keydown.enter="handleGenerate"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Height -->
        <div>
          <label class="block mb-1 font-semibold">Height (px)</label>
          <input
            v-model.number="form.height"
            type="number"
            min="1"
            placeholder="e.g. 1080"
            @blur="handleGenerate"
            @keydown.enter="handleGenerate"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Capacity -->
        <div>
          <label class="block mb-1 font-semibold">Capacity</label>
          <div class="flex items-center gap-3 min-h-[42px]">
            <div class="flex items-center gap-2 flex-wrap">
              <select
                v-model="capacityMode"
                @change="handleGenerate"
                class="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-28"
              >
                <option value="auto">Auto</option>
                <option value="custom">Custom</option>
              </select>

              <div
                class="flex items-center gap-2 transition-all duration-200"
                :class="{ 'opacity-0 pointer-events-none': capacityMode === 'auto' }"
              >
                <input
                  v-model.number="form.capacity"
                  type="number"
                  min="1"
                  placeholder="e.g. 30"
                  @blur="handleGenerate"
                  @keydown.enter="handleGenerate"
                  class="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
                />
                <select
                  v-model="form.capacityUnit"
                  @change="handleGenerate"
                  class="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
                >
                  <option
                    v-for="option in unitOptions"
                    :key="option.value"
                    :value="option.value"
                  >{{ option.label }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Type -->
        <div>
          <label class="block mb-1 font-semibold">Image Type</label>
          <select
            v-model="form.type"
            @change="handleGenerate"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option
              v-for="option in fileTypeOptions"
              :key="option.value"
              :value="option.value"
            >{{ option.label }}</option>
          </select>
        </div>

        <!-- Add text color and bg color field -->
        <div>
          <label class="block mb-1 font-semibold">Background Color</label>
          <input
            v-model="form.bgColor"
            type="color"
            @change="handleGenerate"
            class="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block mb-1 font-semibold">Text Color</label>
          <input
            v-model="form.textColor"
            type="color"
            @change="handleGenerate"
            class="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Result -->
      <div v-if="previewUrl" class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div class="flex items-center gap-2 relative">
          <div class="mt-4 text-center">
            <button
              @click="handleDownload"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Download
            </button>
          </div>
        </div>

        <div class="mt-4 text-center">
          <img
            :src="previewUrl"
            alt="Generated"
            class="mx-auto rounded-xl shadow-md max-h-96 border border-gray-300 dark:border-gray-700"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from "#app";
import { useImageGenerator } from "~/composables/useImageGenerator";
import { onMounted, ref } from "vue";
import { SITE } from "~/constants/common";
import { IMAGE_TYPE, UNIT, UNIT_CONVERT } from "~/constants/tools/image-generate";

useHead({
  title: 'Free Online Image Generator | Generate Test Images with Custom Size',
  meta: [
    {
      name: 'description',
      content:
        'Generate test images with custom width, height, and file size. Support PNG, JPG, JPEG, GIF formats. Perfect for developers and designers.',
    },
    {
      name: 'keywords',
      content:
        'image generator, test image, placeholder image, custom size image, developer tools, online image tool, png generator, jpg generator',
    },
    // Open Graph
    { property: 'og:title', content: 'Free Online Image Generator' },
    {
      property: 'og:description',
      content:
        'Generate custom test images with specified dimensions and file size. Support multiple formats for development and testing.',
    },
    {
      property: 'description:vi',
      content:
        'Tạo hình ảnh thử nghiệm với kích thước tùy chỉnh. Hỗ trợ nhiều định dạng cho phát triển và kiểm thử.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${SITE}/tool/image-generate` },
    { property: 'og:image', content: `${SITE}/images/tools/image-generator.webp` },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Free Online Image Generator' },
    {
      name: 'twitter:description',
      content:
        'Generate test images with custom dimensions and file size. Support PNG, JPG, JPEG, GIF formats for development.',
    },
    { name: 'twitter:image', content: `${SITE}/images/tools/image-generator.webp` },
  ],
  link: [{ rel: 'canonical', href: `${SITE}/tool/image-generate` }],
});

const form = ref({
  width: 1280,
  height: 720,
  capacity: 30,
  capacityUnit: UNIT.MB,
  type: IMAGE_TYPE.PNG,
  textColor: '#111827',
  bgColor: '#E5E7EB',
});

const fileTypeOptions = ref([
  { label: "PNG", value: IMAGE_TYPE.PNG },
  { label: "JPG", value: IMAGE_TYPE.JPG },
  { label: "SVG", value: IMAGE_TYPE.SVG },
  { label: "WEBP", value: IMAGE_TYPE.WEBP },
]);

const unitOptions = ref([
  { label: "MB", value: UNIT.MB },
  { label: "Byte", value: UNIT.BYTE },
]);

const capacityMode = ref<"auto" | "custom">("auto");
let blobCache: Blob | null = null
const previewUrl = ref<string | null>(null)
const { generateImage, downloadImage } = useImageGenerator()


async function handleGenerate() {
  const bytes =
    capacityMode.value === 'custom'
      ? form.value.capacity * UNIT_CONVERT[form.value.capacityUnit]
      : 0

  const blob = await generateImage({
    width: form.value.width,
    height: form.value.height,
    type: form.value.type,
    capacity: bytes,
    textColor: form.value.textColor,
    bgColor: form.value.bgColor,
  })

  blobCache = blob
  previewUrl.value = URL.createObjectURL(blob)
}

async function handleDownload() {
  if (!blobCache) return
  const capacitySuffix = form.value.capacity ? `_${form.value.capacity}${form.value.capacityUnit}` : ''
  const name = `${form.value.width}x${form.value.height}${capacityMode.value === 'custom' ? capacitySuffix : ''}.${form.value.type}`
  await downloadImage(blobCache, name)
}


onMounted(() => {
  handleGenerate();
});
</script>
