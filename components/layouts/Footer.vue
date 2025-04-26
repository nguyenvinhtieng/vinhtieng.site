<template>
  <footer class="text-gray-800 dark:text-gray-100 p-container z-10 relative border-t border-neutral-300 dark:border-neutral-800">
    <div
      class="flex flex-col items-center justify-center w-full py-6"
    >
      <div class="text-sm text-neutral-500 dark:text-neutral-200">
        &copy; {{ currentYear }} {{ $t('footer.copyright') }}
      </div>
      <div class="text-sm text-neutral-500 dark:text-neutral-400 space-x-2">
        <button
          v-for="locale in availableLocales"
          :key="locale.code"
          @click="switchLocale(locale.code)"
          class="hover:underline"
          :class="
            locale.code === currentLocale
              ? 'text-blue-600 font-semibold'
              : 'text-blue-500 cursor-alias'
          "
        >
          {{ locale.name }}
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale, locales, setLocale } = useI18n();

const currentLocale = computed(() => locale.value);
const availableLocales = computed(() =>
  locales.value.map((l: any) => ({
    code: l.code,
    name: l.name,
  }))
);

const switchLocale = async (code: string) => {
  if (code !== locale.value && ['en', 'vi'].includes(code)) {
    await setLocale(code as any);
  }
};

const currentYear = new Date().getFullYear();
</script>
