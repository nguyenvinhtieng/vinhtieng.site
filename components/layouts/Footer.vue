<template>
  <footer
    class="w-full border-t border-neutral-200 dark:border-neutral-900 bg-white/80 dark:bg-black/30 backdrop-blur-sm relative z-10"
  >
    <div class="p-container py-6 flex flex-col md:flex-row items-center justify-between text-gray-700 dark:text-gray-300">

      <!-- Left side -->
      <div class="text-sm flex items-center space-x-2">
        <span>&copy; {{ currentYear }} {{ $t("footer.copyright") }}</span>
      </div>

      <!-- Right side: Locale switcher -->
      <div class="flex items-center space-x-4 mt-4 md:mt-0">
        <div class="flex space-x-2">
          <button
            v-for="locale in availableLocales"
            :key="locale.code"
            @click="switchLocale(locale.code)"
            class="flex items-center space-x-1 text-sm hover:text-blue-600 transition-all font-medium"
            :class="locale.code === currentLocale ? 'text-blue-600' : 'text-neutral-500'"
          >
            <span v-if="locale.code === 'en'">🇺🇸</span>
            <span v-else-if="locale.code === 'vi'">🇻🇳</span>
            <span>{{ locale.name }}</span>
          </button>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import useCommonStore from "@/stores/common.store";

const commonStore = useCommonStore();
const { locale: currentLocale } = storeToRefs(commonStore);

const { locales, setLocale: setI18nLocale } = useI18n();

const availableLocales = computed(() =>
  locales.value.map((l: any) => ({
    code: l.code,
    name: l.name,
  }))
);

const switchLocale = async (code: string) => {
  if (code !== currentLocale.value && ["en", "vi"].includes(code)) {
    commonStore.setLocale(code as "en" | "vi");
    await setI18nLocale(code as any);
  }
};

watch(
  currentLocale,
  (newLocale) => {
    setI18nLocale(newLocale as any);
  },
  { immediate: true }
);

const currentYear = new Date().getFullYear();
</script>
