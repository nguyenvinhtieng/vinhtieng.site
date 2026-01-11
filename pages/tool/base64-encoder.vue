<template>
  <div class="p-6 pt-10 max-w-screen-xl w-full mx-auto text-gray-900 dark:text-gray-100 relative">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2 bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
        🔁 {{ $t('base64_encoder.title') }}
      </h1>
      <p class="text-gray-700 dark:text-gray-300">{{ $t('base64_encoder.subtitle') }}</p>
    </div>

    <div class="mb-6 flex justify-center">
      <ToolButton
        :variant="mode === 'encode' ? 'primary' : 'secondary'"
        size="sm"
        @click="mode = 'encode'"
      >
        {{ $t('base64_encoder.encode') }}
      </ToolButton>
      <ToolButton
        :variant="mode === 'decode' ? 'primary' : 'secondary'"
        size="sm"
        @click="mode = 'decode'"
        class="ml-2"
      >
        {{ $t('base64_encoder.decode') }}
      </ToolButton>
    </div>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Input Area -->
      <div class="flex-1">
        <ToolInput
          v-model="input"
          type="textarea"
          :label="$t('base64_encoder.input_text')"
          :placeholder="mode === 'encode' ? $t('base64_encoder.placeholder_encode') : $t('base64_encoder.placeholder_decode')"
          :rows="15"
          spellcheck
        />
      </div>

      <!-- Output Area -->
      <div class="flex-1 relative">
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ $t('base64_encoder.result') }} ({{ mode === 'encode' ? $t('base64_encoder.result_encode') : $t('base64_encoder.result_decode') }})
          </label>
          <div class="flex gap-2">
            <ToolButton
              variant="primary"
              size="xs"
              :disabled="!result"
              @click="copyToClipboard"
            >
              <template #icon>
                <NuxtIcon name="content-copy" />
              </template>
              {{ copied ? $t("json_format.copied") : $t("json_format.copy") }}
            </ToolButton>
            <ToolButton
              variant="secondary"
              size="xs"
              @click="input = ''"
            >
              {{ $t('base64_encoder.clear') }}
            </ToolButton>
          </div>
        </div>
        <ToolInput
          :model-value="result"
          type="textarea"
          :rows="15"
          readonly
          :placeholder="mode === 'encode' ? $t('base64_encoder.placeholder_result_encode') : $t('base64_encoder.placeholder_result_decode')"
          :error="error"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#app';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { SITE } from '~/constants/common';
import ToolButton from '~/components/tool/ToolButton.vue';
import ToolInput from '~/components/tool/ToolInput.vue';

const { t } = useI18n();
const input = ref('');
const mode = ref<'encode' | 'decode'>('encode');
const error = ref('');

useHead({
  title: 'Free Online Base64 Encoder | Encode Text to Base64 Easily',
  meta: [
    {
      name: 'description',
      content:
        'Encode your text to Base64 easily with our free online tool. Paste text, encode instantly, and copy the result in one click.',
    },
    {
      name: 'keywords',
      content:
        'base64 encoder, online base64 tool, encode to base64, free encoder, developer tools, online text encoder',
    },
    // Open Graph
    { property: 'og:title', content: 'Free Online Base64 Encoder' },
    {
      property: 'og:description',
      content:
        'Paste your text and encode it to Base64 instantly. Free, fast, and easy-to-use developer tool.',
    },
    {
      property: 'description:vi',
      content:
        'Dán văn bản và mã hóa sang Base64 ngay lập tức. Công cụ dành cho lập trình viên, miễn phí và dễ sử dụng.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${SITE}/tool/base64-encoder` },
    { property: 'og:image', content: `${SITE}/images/tools/base64-encoder.webp` },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Free Online Base64 Encoder' },
    {
      name: 'twitter:description',
      content:
        'Quickly encode text to Base64 with our free online tool. Includes copy to clipboard support.',
    },
    { name: 'twitter:image', content: `${SITE}/images/tools/base64-encoder.webp` },
  ],
  link: [{ rel: 'canonical', href: `${SITE}/tool/base64-encoder` }],
});

const result = computed(() => {
  try {
    error.value = '';
    if (!input.value) return '';
    
    if (mode.value === 'encode') {
      return btoa(unescape(encodeURIComponent(input.value)));
    } else {
      // Decode mode
      if (!input.value.trim()) return '';
      return decodeURIComponent(escape(atob(input.value)));
    }
  } catch (e) {
    error.value = mode.value === 'decode' 
      ? t('base64_encoder.invalid_base64')
      : t('base64_encoder.encode_error');
    return '';
  }
});

const copied = ref<boolean>(false);
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(result.value);
    copied.value = true;

    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {}
};
</script>
