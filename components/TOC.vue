<template>
	<nav class="text-sm text-neutral-600" v-if="displayToc.length > 6">
		<p
			v-for="(toc, index) in displayToc"
			:key="index"
			@click="handleScrollTo(toc[1].id)"
			:class="cn(
				'block py-[2px] cursor-pointer transition-colors truncate',
				{
					'ml-0 text-[14px] font-semibold mt-2': toc[0] === 'h1',
					'ml-2 text-[14px] mt-0': toc[0] === 'h2',
					'ml-6 text-[14px] mt-0': toc[0] === 'h3',
					'text-blue-500 dark:text-blue-400': activeId === toc[1].id,
					'hover:text-blue-500': activeId !== toc[1].id,
				}
			)"
		>
			{{ toc[2] }}
		</p>
	</nav>
</template>

<script setup lang="ts">
import type { MinimalElement, MinimalNode } from '@nuxt/content';
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { cn } from '~/utils/cn';

const props = defineProps<{
	items: MinimalNode[];
}>();

const displayToc = computed<MinimalElement[]>(() =>
	props.items.filter((item): item is MinimalElement =>
		['h1', 'h2', 'h3'].includes(item[0])
	)
);
console.log(displayToc.value);
const activeId = ref<string | null>(null);

const handleScrollTo = (id: string | unknown) => {
	if (typeof id !== 'string') return;
	const element = document.getElementById(id);
	if (element) {
		element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		history.pushState(null, '', `#${id}`);
	}
};

// Intersection observer logic
let observer: IntersectionObserver | null = null;

onMounted(() => {
	const headings = displayToc.value
		.map((item: MinimalElement) => {
			return document.getElementById(String((item as MinimalElement)[1].id));
		})
		.filter(Boolean) as HTMLElement[];

	if (!headings.length) return;

	observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					activeId.value = entry.target.id;
					break;
				}
			}
		},
		{
			rootMargin: '-60% 0px -35% 0px',
			threshold: 0.1,
		}
	);

	headings.forEach((el) => observer!.observe(el));
});

onBeforeUnmount(() => {
	if (observer) observer.disconnect();
});
</script>