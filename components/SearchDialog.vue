<template>
  <div
    v-if="isOpenSearchDialog"
    class="fixed inset-0 z-50 flex items-start justify-center pt-20"
  >
    <span
      class="absolute inset-0 bg-black/40 dark:bg-white/20"
      @click="commonStore.toggleOpenSearchDialog(false)"
    ></span>
    <div class="bg-white rounded-xl shadow-xl w-full max-w-xl p-4 z-10 dark:bg-neutral-900 mx-2">
      <input
        v-model="searchTerm"
        ref="inputRef"
        class="w-full border border-neutral-200 p-2 rounded focus:border-neutral-300 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:focus:border-neutral-700 dark:text-neutral-200"
        type="text"
        :placeholder="$t('search.placeholder')"
        @keydown.esc="commonStore.toggleOpenSearchDialog(false)"
      />
      <div class="mt-4 max-h-60 overflow-y-auto">
        <div
          v-for="file in filtered"
          :key="file.id"
          tabindex="0"
          class="py-2 cursor-pointer hover:bg-gray-100 px-2 rounded block border-b border-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800 dark:text-neutral-300 "
          @click="navigateTo(file.id)"
          @keydown.enter="navigateTo(file.id)"
        >
          <p>{{ file.title }}</p>
          <div
            v-if="file.titles.length"
            class="flex flex-wrap gap-1 text-xs text-neutral-400 dark:text-neutral-500"
          >
            <span v-for="(title, index) in file.titles" :key="title">
              <span>
                {{ title }} {{ index < file.titles.length - 1 ? ">" : "" }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { useRouter } from "vue-router";
import useCommonStore from "~/stores/common.store";
import { useAsyncData } from "#app";
import { queryCollectionSearchSections } from "#imports";
import { useLocalePath } from '#i18n';
import { shuffleArray } from "@/utils/array"

const localePath = useLocalePath()
const commonStore = useCommonStore();
const { isOpenSearchDialog } = storeToRefs(commonStore);
const searchTerm = ref("");
const inputRef = ref<HTMLInputElement | null>(null);
const router = useRouter();

watch(isOpenSearchDialog, (open) => {
  if (open) {
    nextTick(() => inputRef.value?.focus());
  } else {
    searchTerm.value = "";
  }
});

// Fetch data
const { data } = await useAsyncData("search", () =>
  queryCollectionSearchSections("blog")
);

const filtered = computed(() => {
  const term = searchTerm.value.toLowerCase().trim();
  if (!term) {
    return shuffleArray([...(data.value || [])]).slice(0, 7);
  }

  return (
    data.value?.filter(
      (file) =>
        file.title.toLowerCase().includes(term) ||
        file.content.toLowerCase().includes(term)
    ) || []
  );
});

const navigateTo = (path: string) => {
  commonStore.toggleOpenSearchDialog(false);
  const hash = path.split("#")[1];
  router.push({
    path: localePath(path.split("#")[0]),
    hash: hash ? `#${hash}` : undefined,
  })
};

// Keyboard shortcut: Ctrl+K or Cmd+K
const handleKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    commonStore.toggleOpenSearchDialog(true);
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>
<style scoped>
@reference "@/assets/css/main.css";

[tabindex="0"]:focus {
  @apply outline-none;
}
</style>