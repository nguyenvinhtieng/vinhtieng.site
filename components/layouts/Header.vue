<template>
	<header class="border-b border-neutral-200 bg-white dark:bg-neutral-900/50 backdrop-blur-2xl fixed top-0 left-0 right-0 z-20 shadow-sm dark:border-neutral-900">
		<section class="p-container py-3 flex items-center justify-between">
			<Logo :width="65" />
			<!-- Desktop Nav -->
			<nav class="hidden md:flex items-center gap-2 text-sm font-medium text-gray-700">
				<NuxtLink
					v-for="header in headers"
					:key="header.title"
					:to="header.url"
					:target="header.type === 'external' ? '_blank' : undefined"
					:external="header.type === 'external'"
					class="flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 group  dark:hover:bg-neutral-800 dark:text-neutral-200 dark:hover:text-blue-500"
					active-class="text-blue-600 bg-blue-50 font-semibold dark:bg-neutral-800 dark:text-blue-600"
				>
					<NuxtIcon v-if="header.icon" :name="header.icon" class="text-md text-inherit" />
					<span>{{ header.title }}</span>
					<NuxtIcon
						v-if="header.type === 'external'"
						name="external"
						class="text-md opacity-60 text-inherit"
					/>
				</NuxtLink>
				<div class="flex items-center justify-center dark:hover:bg-neutral-800 dark:text-neutral-200 text-neutral-700 hover:bg-neutral-100 p-2 cursor-pointer rounded-full transition-all duration-200"
					@click="commonStore.toggleOpenSearchDialog(true)"
				>
					<NuxtIcon name="search" class="text-lg bg-w" />
				</div>
				<ThemeSwitch />
			</nav>

			<!-- Mobile Toggle -->
			<button @click="menuOpen = !menuOpen" class="md:hidden text-gray-700 hover:text-blue-600 transition" :aria-label="menuOpen ? 'Close menu' : 'Open menu'">
				<NuxtIcon :name="menuOpen ? 'x-mark' : 'bars-3'" class="text-lg" />
			</button>
		</section>

		<!-- Mobile Menu -->
		<div
			v-if="menuOpen"
			ref="menuRef"
			class="md:hidden border-t border-neutral-200 bg-white/30 shadow-md dark:border-neutral-700 dark:bg-neutral-900/10"
		>
			<div class="flex flex-col px-6 py-4 gap-4 text-sm font-medium text-gray-700 dark:text-neutral-200">
				<NuxtLink
					v-for="header in headers"
					:key="header.title"
					:to="header.url"
					:target="header.type === 'external' ? '_blank' : undefined"
					:external="header.type === 'external'"
					class="flex items-center gap-2 hover:text-blue-600 transition"
					active-class="text-blue-600 font-semibold"
					@click="menuOpen = false"
				>
					<NuxtIcon v-if="header.icon" :name="header.icon" class="text-md text-inherit" />
					<span>{{ header.title }}</span>
					<NuxtIcon
						v-if="header.type === 'external'"
						name="external"
						class="text-md opacity-60 text-inherit"
					/>
				</NuxtLink>

				<ThemeSwitch />
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onClickOutside } from '@vueuse/core';
import useCommonStore from "~/stores/common.store";
import { useI18n } from 'vue-i18n';
import { useLocalePath } from '#i18n';

const { t } = useI18n();
const localePath = useLocalePath();
const commonStore = useCommonStore();
const menuOpen = ref(false);
const menuRef = ref(null);

onClickOutside(menuRef, () => {
  menuOpen.value = false;
});

const headers = computed(() => [
  { title: t('header.home'), url: localePath('/'), type: 'link', icon: 'home' },
  { title: t('header.blog'), url: localePath('/blog'), type: 'link', icon: 'document' },
  { title: t('header.tool'), url: localePath('/tool'), type: 'link', icon: 'document' },
  { title: t('header.github'), url: 'https://github.com/nguyenvinhtieng/vinhtieng.site', type: 'external', icon: 'github' },
]);
</script>
