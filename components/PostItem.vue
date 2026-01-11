<template>
	<NuxtLink :to="`${localePath(post.path)}`"
	  class="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:border-sky-300 dark:hover:border-sky-700 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
	  <div class="relative overflow-hidden w-full aspect-video bg-gray-100 dark:bg-gray-800">
		<NuxtImg :src="post.image || '/images/blog/default.jpg'"
		  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" width="500"
		  height="281" :title="post.title" :alt="post.title" />
		<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
	  </div>
	  <div class="p-5 flex flex-col flex-1">
		<div class="flex flex-wrap items-center gap-2 mb-3">
		  <Tag v-for="tag in post.tags" :key="tag" :label="tag" size="sm" />
		</div>
		<div class="flex-1">
		  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mb-2 line-clamp-2">
			{{ post.title }}
		  </h3>
		  <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
			{{ post.description }}
		  </p>
		</div>
	  </div>
	</NuxtLink>
  </template>
  <script setup lang="ts">
  import type { BlogCollectionItem } from '@nuxt/content';
  import Tag from './Tag.vue';
  import { useLocalePath } from '#i18n';
  const localePath = useLocalePath()
  defineProps<{
	post: BlogCollectionItem;
  }>();
  
  </script>
  