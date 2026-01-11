<template>
	<nav v-if="displayToc.length > 0" class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4">
		<h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">
			{{ $t('blog_detail.table_of_contents') }}
		</h3>
		<div class="space-y-1">
			<button
				v-for="(toc, index) in displayToc"
				:key="index"
				@click="handleScrollTo(toc[1].id)"
				:class="cn(
					'block w-full text-left py-1.5 px-3 rounded-md cursor-pointer transition-all duration-200 truncate',
					{
						'text-sm font-semibold text-gray-900 dark:text-gray-100': toc[0] === 'h1',
						'text-sm text-gray-700 dark:text-gray-300 ml-3': toc[0] === 'h2',
						'text-xs text-gray-600 dark:text-gray-400 ml-6': toc[0] === 'h3',
						'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border-l-2 border-sky-500': activeId === toc[1].id,
						'hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-sky-600 dark:hover:text-sky-400': activeId !== toc[1].id,
					}
				)"
			>
				{{ getHeadingText(toc) }}
			</button>
		</div>
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

// Function to extract text from TOC item (handles inline code and nested elements)
const extractText = (node: MinimalNode | string): string => {
	if (typeof node === 'string') {
		return node;
	}
	
	if (Array.isArray(node)) {
		// If it's a code element like ["code", {}, "text"], extract the text
		if (node[0] === 'code' && node.length >= 3) {
			return String(node[2] || '');
		}
		
		// For other elements, extract text from children (starting from index 2)
		if (node.length > 2) {
			return node.slice(2).map(child => extractText(child)).join('');
		}
	}
	
	return '';
};

// Get text from heading element (MinimalElement format: [tag, props, ...children])
const getHeadingText = (toc: MinimalElement): string => {
	// Extract text from all children (from index 2 onwards)
	if (toc.length > 2) {
		return toc.slice(2).map(child => extractText(child)).join('');
	}
	return '';
};

const activeId = ref<string | null>(null);
let isScrolling = false;
let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

const handleScrollTo = (id: string | unknown) => {
	if (typeof id !== 'string') return;
	const element = document.getElementById(id);
	if (element) {
		// Set active immediately when clicked
		activeId.value = id;
		isScrolling = true;
		
		// Clear any existing timeout
		if (scrollTimeout) {
			clearTimeout(scrollTimeout);
		}
		
		element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		history.pushState(null, '', `#${id}`);
		
		// Allow observer to take over after scroll completes
		scrollTimeout = setTimeout(() => {
			isScrolling = false;
		}, 1000);
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
			// Ignore observer updates during programmatic scroll
			if (isScrolling) return;
			
			// Find the heading closest to the top of the viewport
			const intersectingEntries = entries.filter(e => e.isIntersecting);
			if (intersectingEntries.length === 0) return;
			
			// Sort by bounding rect top position (closest to top)
			intersectingEntries.sort((a, b) => {
				return a.boundingClientRect.top - b.boundingClientRect.top;
			});
			
			// Get the entry closest to top but still in viewport
			const topEntry = intersectingEntries.find(e => e.boundingClientRect.top >= 0) || intersectingEntries[0];
			activeId.value = topEntry.target.id;
		},
		{
			rootMargin: '-20% 0px -60% 0px',
			threshold: [0, 0.1, 0.5, 1],
		}
	);

	headings.forEach((el) => observer!.observe(el));
});

onBeforeUnmount(() => {
	if (observer) observer.disconnect();
	if (scrollTimeout) clearTimeout(scrollTimeout);
});
</script>