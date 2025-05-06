import { defineStore } from "pinia";
import { onMounted, ref, watch } from "vue";
type Theme = "light" | "dark";
type Locale = "en" | "vi";

const useCommonStore = defineStore("common", () => {
  const isOpenSearchDialog = ref(false);
  const theme = ref<Theme>();
  const locale = ref<Locale>();

  const toggleOpenSearchDialog = (isOpen?: boolean) => {
    isOpenSearchDialog.value = isOpen ?? !isOpenSearchDialog.value;
  };

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
  };

  const setLocale = (newLocale: Locale) => {
    locale.value = newLocale;
  };

  onMounted(() => {
    const storedTheme = localStorage.getItem("theme") as Theme;
    const storedLocale = localStorage.getItem("locale") as Locale;

    if (storedTheme) {
      theme.value = storedTheme;
    } else {
      theme.value = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    document.documentElement.classList.toggle('dark', theme.value === "dark");

    if (storedLocale) {
      locale.value = storedLocale;
    } else {
      locale.value = "en";
    }

    watch(theme, (newTheme) => {
      if (!newTheme) return;
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle('dark', newTheme === "dark");
    });

    watch(locale, (newLocale) => {
      if (!newLocale) return;
      localStorage.setItem("locale", newLocale);
    });
  });

  return {
    isOpenSearchDialog,
    theme,
    locale,
    setTheme,
    toggleOpenSearchDialog,
    setLocale,
  };
});

export default useCommonStore;
