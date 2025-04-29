<template>
  <footer
    class="text-gray-800 dark:text-gray-100 p-container z-10 relative border-t border-neutral-300 dark:border-neutral-800"
  >
    <div class="flex flex-col items-center justify-center w-full py-6">
      <div class="text-sm text-neutral-500 dark:text-neutral-200">
        &copy; {{ currentYear }} {{ $t("footer.copyright") }}
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
import { computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import useCommonStore from "@/stores/common.store";

// Store
const commonStore = useCommonStore();
const { locale: currentLocale } = storeToRefs(commonStore);

// I18n
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
    await setI18nLocale(code as any); // cập nhật luôn i18n runtime
  }
};

// Đồng bộ store.locale -> i18n.locale mỗi khi reload
watch(
  currentLocale,
  (newLocale) => {
    setI18nLocale(newLocale as any);
  },
  { immediate: true }
);

const currentYear = new Date().getFullYear();
</script>
