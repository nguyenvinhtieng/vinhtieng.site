<script setup lang="ts">
import { useAsyncData, useHead } from '#app'
import { queryCollection } from '#imports'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import moment from 'moment'
import { useLocalePath } from '#i18n';

const localePath = useLocalePath()

const slug = useRoute().params.slug

const { data: post } = await useAsyncData(`blog-${slug}`, () => {
  return queryCollection('blog').path(`/blog/${slug}`).first()
})


const { data: relatedPosts } = await useAsyncData(`related-posts-${slug}`, () => {
  let baseQuery = queryCollection("blog").where("published", "=", true);
  const NUM_RELATED_POSTS = 4
  if (post?.value?.tags?.length) {
    baseQuery = baseQuery.orWhere((group) => {
      post?.value?.tags.forEach((tag) => {
        group = group.where("tags", "LIKE", `%${tag}%`);
      });
      return group;
    });
  }
  return baseQuery
    .where('id', '<>', post.value?.id)
    .limit(NUM_RELATED_POSTS)
    .all()
})
const { data: posts } = await useAsyncData(`all-post`, () => {
  return queryCollection("blog").where("published", "=", true).all()
})

const relatedDisplayPosts = computed(() => {
  const related = relatedPosts.value || []
  const remain = 4 - related.length
  if (remain > 0) {
    const randomPosts = posts?.value?.filter((p) => {
      return !related.some((relatedPost) => relatedPost.id === p.id) && p.id !== post?.value?.id
    })
    const randomPostsToAdd = randomPosts?.slice(0, remain) || []
    return [...related, ...randomPostsToAdd]
  }
  return related
})

const formattedDate = computed(() => {
  if (post.value && post.value.date) {
    return moment(post.value.date).format('DD/MM/YYYY')
  }
  return ''
})

useHead({
  title: post.value?.title,
  meta: [
    { name: 'description', content: post.value?.description },
    { property: 'og:title', content: post.value?.title },
    { property: 'og:description', content: post.value?.description },
    { property: 'og:image', content: post.value?.image || '/images/blog/default.jpg' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:site_name', content: 'Vinh Tieng' },
    { property: 'og:title', content: post.value?.title },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: `https://vinhtieng.site/blog/${slug}` },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: post.value?.title },
    { name: 'twitter:description', content: post.value?.description },
    { name: 'twitter:image', content: post.value?.image }
  ],
  link: [
    { rel: 'canonical', href: `https://vinhtieng.site/blog/${slug}` }
  ]
})

</script>

<template>
  <main class="min-h-screen text-gray-800 dark:text-gray-100 p-container z-10 pt-10 relative">
  <div v-if="post" class="max-w-4xl mx-auto relative flex gap-8 p-6">
    <div class="fixed top-24 left-2 right-0 w-[300px]">
      <aside class="hidden xl:block">
      <div class="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <TOC :items="post.body.value"/>
      </div>
    </aside>
    </div>
    
    <section class="flex-1">
      <h1 class="text-4xl dark:text-neutral-200  font-bold mb-2">{{ post.title }}</h1>
      <p class="text-gray-500 dark:text-neutral-400 text-sm mb-4">{{ formattedDate }}</p>

      <div v-if="post.image" class="mb-6 rounded-lg overflow-hidden">
        <NuxtImg :src="post.image" class="rounded-lg shadow-md object-cover w-full aspect-video max-w-[800px] mx-auto" width="800" 
          :alt="post.title" />
      </div>
      <ContentRenderer :value="post" class="post-content max-w-none  bg-white dark:bg-neutral-900 p-4 rounded-lg" />

      <!-- Related posts -->
      <div class="mt-10" v-if="relatedDisplayPosts.length">
        <h2 class="text-2xl font-bold mb-4 dark:text-neutral-300">{{ $t('related_posts') }}</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <PostItem
            v-for="relatedPost in relatedDisplayPosts"
            :key="relatedPost.id"
            :post="relatedPost"
          />
        </div>
      </div>
    </section>
  </div>

  <div v-else class="text-center text-gray-400 py-20">
    <p class="mb-4 text-lg">{{ $t('post_not_found') }}</p>
    <NuxtLink :to="localePath('/blog')" class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
      {{ $t('back_to_blog') }}
    </NuxtLink>
  </div>
  </main>
</template>