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
					<Icon v-if="header.icon" :name="header.icon" class="w-4 h-4 text-inherit" />
					<span>{{ header.title }}</span>
					<Icon
						v-if="header.type === 'external'"
						name="heroicons-solid:arrow-top-right-on-square"
						class="w-3.5 h-3.5 opacity-60 text-inherit"
					/>
				</NuxtLink>
				<div class="flex items-center justify-center dark:hover:bg-neutral-800 dark:text-neutral-200 text-neutral-700 hover:bg-neutral-100 p-2 cursor-pointer rounded-full transition-all duration-200"
					@click="commonStore.toggleOpenSearchDialog(true)"
				>
					<Icon name="mynaui:search" class="text-lg " />
				</div>
				<ThemeSwitch />
			</nav>

			<!-- Mobile Toggle -->
			<button @click="menuOpen = !menuOpen" class="md:hidden text-gray-700 hover:text-blue-600 transition">
				<Icon :name="menuOpen ? 'heroicons-solid:x-mark' : 'heroicons-solid:bars-3'" class="w-6 h-6" />
			</button>
		</section>

		<!-- Mobile Menu -->
		<div v-if="menuOpen" class="md:hidden border-t border-neutral-200 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-900">
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
					<Icon v-if="header.icon" :name="header.icon" class="w-4 h-4 text-inherit" />
					<span>{{ header.title }}</span>
					<Icon
						v-if="header.type === 'external'"
						name="heroicons-solid:arrow-top-right-on-square"
						class="w-3.5 h-3.5 opacity-60 text-inherit"
					/>
				</NuxtLink>

				<ThemeSwitch />
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Logo from '../Logo.vue';
import { NuxtLink } from '#components';
import { useI18n,  } from 'vue-i18n';
import { useLocalePath } from '#i18n';

const {t} = useI18n();
const localePath = useLocalePath()
import useCommonStore from "~/stores/common.store";

const commonStore = useCommonStore();

const menuOpen = ref(false);

const headers = computed(() => [
	{
		title: t('header.home'),
		url: localePath('/'),
		type: 'link',
		icon: 'heroicons-solid:home',
	},
	{
		title: t('header.blog'),
		url: localePath('/blog'),
		type: 'link',
		icon: 'heroicons-solid:document-text',
	},
	{
		title: t('header.github'),
		url: 'https://github.com/nguyenvinhtieng/vinhtieng.site',
		type: 'external',
		icon: 'mynaui:brand-github-solid',
	},
]);
</script>