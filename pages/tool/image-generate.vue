<template>
  <div class="p-6 pt-10 max-w-screen-lg mx-auto text-gray-900 dark:text-gray-100">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2 bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
        🖼️ {{ $t('image_generator.title') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">{{ $t('image_generator.subtitle') }}</p>
    </div>

    <div
      class="flex flex-col gap-6 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <!-- Form -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Width -->
        <div>
          <ToolInput
            v-model.number="form.width"
            type="number"
            :label="$t('image_generator.width')"
            placeholder="e.g. 1920"
            :min="1"
            @blur="handleGenerate"
            @keydown.enter="handleGenerate"
          />
        </div>

        <!-- Height -->
        <div>
          <ToolInput
            v-model.number="form.height"
            type="number"
            :label="$t('image_generator.height')"
            placeholder="e.g. 1080"
            :min="1"
            @blur="handleGenerate"
            @keydown.enter="handleGenerate"
          />
        </div>

        <!-- Type -->
        <div>
          <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">{{ $t('image_generator.image_type') }}</label>
          <select
            v-model="form.type"
            @change="handleGenerate"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
          >
            <option
              v-for="option in fileTypeOptions"
              :key="option.value"
              :value="option.value"
            >{{ option.label }}</option>
          </select>
        </div>

        <!-- Capacity -->
        <div>
          <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">{{ $t('image_generator.capacity') }}</label>
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2 flex-wrap">
              <select
                v-model="capacityMode"
                @change="handleGenerate"
                class="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-28 text-gray-900 dark:text-gray-100"
              >
                <option value="auto">{{ $t('image_generator.auto') }}</option>
                <option value="custom">{{ $t('image_generator.custom') }}</option>
              </select>

              <div
                class="flex items-center gap-2 transition-all duration-200"
                :class="{ 'opacity-0 pointer-events-none': capacityMode === 'auto' }"
              >
                <div class="w-24">
                  <ToolInput
                    v-model.number="form.capacity"
                    type="number"
                    placeholder="e.g. 30"
                    :min="capacityMode === 'custom' ? minCapacityInUnit : 1"
                    :max="capacityMode === 'custom' ? maxCapacityInUnit : undefined"
                    size="sm"
                    :has-error="capacityMode === 'custom' && !!capacityError"
                    @blur="handleGenerate"
                  />
                </div>
                <select
                  v-model="form.capacityUnit"
                  @change="handleGenerate"
                  class="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-24 text-gray-900 dark:text-gray-100"
                >
                  <option
                    v-for="option in unitOptions"
                    :key="option.value"
                    :value="option.value"
                  >{{ option.label }}</option>
                </select>
              </div>
            </div>
            <div v-if="capacityMode === 'custom'" class="text-xs ml-0" :class="capacityError ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'">
              <span v-if="capacityError">{{ capacityError }}</span>
              <span v-else>{{ $t('image_generator.range') }}: {{ minCapacityDisplay }} - {{ maxCapacityDisplay }} {{ form.capacityUnit }}</span>
            </div>
          </div>
        </div>

        <!-- Add text color and bg color field -->
        <div>
          <ToolInput
            v-model="form.bgColor"
            type="color"
            :label="$t('image_generator.background_color')"
            @change="handleGenerate"
          />
        </div>

        <div>
          <ToolInput
            v-model="form.textColor"
            type="color"
            :label="$t('image_generator.text_color')"
            @change="handleGenerate"
          />
        </div>
      </div>

      <!-- Result -->
      <div v-if="previewUrl" class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div class="flex items-center justify-center gap-2 mb-4">
          <ToolButton
            variant="success"
            size="sm"
            @click="handleDownload"
          >
            {{ $t('image_generator.download_image') }}
          </ToolButton>
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
import { onMounted, ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { SITE } from "~/constants/common";
import { IMAGE_TYPE, UNIT, UNIT_CONVERT } from "~/constants/tools/image-generate";
import ToolButton from "~/components/tool/ToolButton.vue";
import ToolInput from "~/components/tool/ToolInput.vue";

const { t } = useI18n();

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
    { name: 'twitter:image', content: `${SITE}/images/tools/image-generator.jpg` },
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
const { generateImage, downloadImage, getMinCapacity, getMaxCapacity } = useImageGenerator()
const capacityError = ref<string>("");
const minCapacityBytes = ref<number>(0);
const maxCapacityBytes = ref<number>(getMaxCapacity());

// Convert bytes to display unit
const formatCapacity = (bytes: number, unit: string) => {
  if (unit === UNIT.MB) {
    return (bytes / UNIT_CONVERT[UNIT.MB]).toFixed(2);
  }
  return Math.ceil(bytes).toString();
};

const minCapacityDisplay = computed(() => {
  return formatCapacity(minCapacityBytes.value, form.value.capacityUnit);
});

const maxCapacityDisplay = computed(() => {
  return formatCapacity(maxCapacityBytes.value, form.value.capacityUnit);
});

// Min and max in current unit for input validation
const minCapacityInUnit = computed(() => {
  return parseFloat(minCapacityDisplay.value);
});

const maxCapacityInUnit = computed(() => {
  return parseFloat(maxCapacityDisplay.value);
});

// Update min capacity when dimensions or type change
const updateMinCapacity = async () => {
  if (capacityMode.value === 'custom') {
    try {
      minCapacityBytes.value = await getMinCapacity({
        width: form.value.width,
        height: form.value.height,
        type: form.value.type,
        bgColor: form.value.bgColor,
        textColor: form.value.textColor,
      });
    } catch (error) {
      console.error('Failed to calculate min capacity:', error);
      minCapacityBytes.value = 1;
    }
  }
};

// Watch capacity and validate
watch([() => form.value.capacity, () => form.value.capacityUnit, capacityMode], () => {
  if (capacityMode.value === 'custom' && form.value.capacity !== undefined && form.value.capacity !== null && !isNaN(form.value.capacity)) {
    const capacityInBytes = form.value.capacity * UNIT_CONVERT[form.value.capacityUnit];
    if (capacityInBytes < minCapacityBytes.value) {
      capacityError.value = `${t('image_generator.minimum')}: ${minCapacityDisplay.value} ${form.value.capacityUnit}`;
    } else if (capacityInBytes > maxCapacityBytes.value) {
      capacityError.value = `${t('image_generator.maximum')}: ${maxCapacityDisplay.value} ${form.value.capacityUnit}`;
    } else {
      capacityError.value = "";
    }
  } else {
    capacityError.value = "";
  }
});

// Watch dimensions and type to update min capacity
watch([() => form.value.width, () => form.value.height, () => form.value.type, () => form.value.bgColor, () => form.value.textColor, capacityMode], () => {
  if (capacityMode.value === 'custom') {
    updateMinCapacity();
  }
}, { immediate: false });

// Update min capacity when switching to custom mode
watch(capacityMode, async (newMode) => {
  if (newMode === 'custom') {
    await updateMinCapacity();
  }
});


async function handleGenerate() {
  if (capacityMode.value === 'custom' && capacityError.value) {
    return; // Don't generate if there's a validation error
  }

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


onMounted(async () => {
  if (capacityMode.value === 'custom') {
    await updateMinCapacity();
  }
  handleGenerate();
});
</script>
