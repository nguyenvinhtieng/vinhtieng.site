<template>
	<NuxtLink
		:to="`${localePath(post.path)}`"
		class="p-4 border border-neutral-100 rounded-lg shadow-sm bg-white cursor-pointer group dark:border-neutral-800 dark:bg-neutral-900"
	>
		<div class="flex items-center mb-2 overflow-hidden w-full rounded-lg">
			<NuxtImg
				:src="post.image || '/images/blog/default.jpg'"
				alt="Post Image"
				class="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-300"
				 width="500"
			/>
		</div>
		<div class="flex items-center mb-2 gap-2">
			<Tag
				v-for="tag in post.tags"
				:key="tag"
				:label="tag"
				size="sm"
			/>
		</div>
		<div>
			<h3 class="text-lg font-semibold text-gray-800 group-hover:text-blue-500 dark:text-neutral-300">
				{{ post.title }}
			</h3>
			<p class="text-sm text-gray-400 mt-1 line-clamp-3">
				{{ post.description }}
			</p>
		</div>
	</NuxtLink>
</template>
<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';
import { defineProps } from 'vue';
import Tag from './Tag.vue';
import { useLocalePath } from '#i18n';
const localePath = useLocalePath()
defineProps<{
  post: BlogCollectionItem;
}>();

</script>