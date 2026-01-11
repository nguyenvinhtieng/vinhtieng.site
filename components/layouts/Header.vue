<template>
	<header class="border-b border-neutral-200 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl fixed top-0 left-0 right-0 z-20 shadow-sm dark:border-neutral-800">
		<section class="p-container py-3 flex items-center justify-between">
			<Logo :width="65" />
			<!-- Desktop Nav -->
			<nav class="hidden md:flex items-center gap-1 text-sm font-medium text-gray-700">
				<NuxtLink
					v-for="header in headers"
					:key="header.title"
					:to="header.url"
					:target="header.type === 'external' ? '_blank' : undefined"
					:external="header.type === 'external'"
					class="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-sky-50 hover:text-sky-600 group dark:hover:bg-neutral-800 dark:text-neutral-200 dark:hover:text-sky-400"
					active-class="text-sky-600 bg-sky-50 font-semibold dark:bg-neutral-800 dark:text-sky-400"
				>
					<NuxtIcon v-if="header.icon" :name="header.icon" class="text-md text-inherit" />
					<span>{{ header.title }}</span>
					<NuxtIcon
						v-if="header.type === 'external'"
						name="external"
						class="text-md opacity-60 text-inherit"
					/>
				</NuxtLink>
        <NuxtLink
          :to="localePath('/game')"
          class="flex items-center justify-center w-9 h-9 dark:hover:bg-neutral-800 dark:text-neutral-200 text-neutral-700 hover:bg-sky-50 hover:text-sky-600 dark:hover:text-sky-400 rounded-lg transition-all duration-200"
          active-class="dark:bg-neutral-800 bg-sky-50 text-sky-600 dark:text-sky-400"
        >
          <NuxtIcon name="game" class="text-lg" />
        </NuxtLink>

				<button
					class="flex items-center justify-center w-9 h-9 dark:hover:bg-neutral-800 dark:text-neutral-200 text-neutral-700 hover:bg-sky-50 hover:text-sky-600 dark:hover:text-sky-400 rounded-lg transition-all duration-200"
					@click="commonStore.toggleOpenSearchDialog(true)"
					aria-label="Search"
				>
					<NuxtIcon name="search" class="text-lg" />
				</button>

				<ThemeSwitch />
			</nav>

			<!-- Mobile Toggle -->
			<div class="md:hidden flex items-center gap-2">
				<button
					class="flex items-center justify-center w-9 h-9 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200"
					@click="commonStore.toggleOpenSearchDialog(true)"
					aria-label="Search"
				>
					<NuxtIcon name="search" class="text-lg" />
				</button>
				<button
					ref="toggleButtonRef"
					@click="toggleMenu"
					class="flex items-center justify-center w-9 h-9 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200"
					:aria-label="menuOpen ? 'Close menu' : 'Open menu'"
					:aria-expanded="menuOpen"
				>
					<NuxtIcon :name="menuOpen ? 'x-mark' : 'bars-3'" class="text-lg transition-transform duration-200" :class="{ 'rotate-90': menuOpen }" />
				</button>
			</div>
		</section>

		<!-- Mobile Menu -->
		<Transition
			enter-active-class="transition ease-out duration-200"
			enter-from-class="opacity-0 -translate-y-2"
			enter-to-class="opacity-100 translate-y-0"
			leave-active-class="transition ease-in duration-150"
			leave-from-class="opacity-100 translate-y-0"
			leave-to-class="opacity-0 -translate-y-2"
		>
			<div
				v-if="menuOpen"
				ref="menuRef"
				class="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl shadow-lg"
			>
				<div class="p-container py-4 flex flex-col gap-1">
					<NuxtLink
						v-for="header in headers"
						:key="header.title"
						:to="header.url"
						:target="header.type === 'external' ? '_blank' : undefined"
						:external="header.type === 'external'"
						class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-neutral-800 dark:hover:text-sky-400 transition-all duration-200 text-gray-700 dark:text-neutral-200"
						active-class="text-sky-600 bg-sky-50 font-semibold dark:bg-neutral-800 dark:text-sky-400"
						@click="closeMenu"
					>
						<NuxtIcon v-if="header.icon" :name="header.icon" class="text-lg text-inherit" />
						<span class="font-medium">{{ header.title }}</span>
						<NuxtIcon
							v-if="header.type === 'external'"
							name="external"
							class="text-sm opacity-60 text-inherit ml-auto"
						/>
					</NuxtLink>
					
					<NuxtLink
						:to="localePath('/game')"
						class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-neutral-800 dark:hover:text-sky-400 transition-all duration-200 text-gray-700 dark:text-neutral-200"
						active-class="text-sky-600 bg-sky-50 font-semibold dark:bg-neutral-800 dark:text-sky-400"
						@click="closeMenu"
					>
						<NuxtIcon name="game" class="text-lg" />
						<span class="font-medium">{{ $t('header.game') }}</span>
					</NuxtLink>

					<div class="flex items-center justify-between px-4 py-3 mt-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
						<span class="text-sm font-medium text-gray-700 dark:text-neutral-200">{{ $t('header.theme') }}</span>
						<ThemeSwitch />
					</div>
				</div>
			</div>
		</Transition>
	</header>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useRoute } from 'vue-router';
import useCommonStore from "~/stores/common.store";
import { useI18n } from 'vue-i18n';
import { useLocalePath } from '#i18n';

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const commonStore = useCommonStore();
const menuOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);
const toggleButtonRef = ref<HTMLElement | null>(null);

const toggleMenu = () => {
	menuOpen.value = !menuOpen.value;
};

const closeMenu = () => {
	menuOpen.value = false;
};

// Close menu when clicking outside
onClickOutside([menuRef, toggleButtonRef], () => {
	if (menuOpen.value) {
		menuOpen.value = false;
	}
});

// Close menu on route change
watch(() => route.path, () => {
	if (menuOpen.value) {
		menuOpen.value = false;
	}
});

// Prevent body scroll when menu is open on mobile
watch(menuOpen, (isOpen) => {
	if (typeof window !== 'undefined') {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}
});

onBeforeUnmount(() => {
	if (typeof window !== 'undefined') {
		document.body.style.overflow = '';
	}
});

const headers = computed(() => [
  { title: t('header.home'), url: localePath('/'), type: 'link', icon: 'home' },
  { title: t('header.blog'), url: localePath('/blog'), type: 'link', icon: 'document' },
  { title: t('header.tool'), url: localePath('/tool'), type: 'link', icon: 'document' },
  { title: t('header.github'), url: 'https://github.com/nguyenvinhtieng/vinhtieng.site', type: 'external', icon: 'github' }
]);
</script>
