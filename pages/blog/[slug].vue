<script setup lang="ts">
import { useAsyncData, useHead } from "#app";
import { queryCollection } from "#imports";
import { useRoute } from "vue-router";
import { computed, nextTick, onMounted } from "vue";
import { useLocalePath, useI18n } from "#i18n";
import { SITE } from "~/constants/common";
import Tag from "~/components/Tag.vue";

const { locale } = useI18n();

const localePath = useLocalePath();

const slug = useRoute().params.slug;

const { data: post } = await useAsyncData(`blog-${slug}`, () => {
  return queryCollection("blog").path(`/blog/${slug}`).first();
});

const { data: relatedPosts } = await useAsyncData(
  `related-posts-${slug}`,
  () => {
    let baseQuery = queryCollection("blog").where("published", "=", true);
    const NUM_RELATED_POSTS = 4;
    if (post?.value?.tags?.length) {
      baseQuery = baseQuery.orWhere((group) => {
        post?.value?.tags.forEach((tag) => {
          group = group.where("tags", "LIKE", `%${tag}%`);
        });
        return group;
      });
    }
    return baseQuery
      .where("id", "<>", post.value?.id)
      .limit(NUM_RELATED_POSTS)
      .all();
  }
);
const { data: posts } = await useAsyncData(`all-post`, () => {
  return queryCollection("blog").where("published", "=", true).all();
});

const relatedDisplayPosts = computed(() => {
  const related = relatedPosts.value || [];
  const remain = 4 - related.length;
  if (remain > 0) {
    const randomPosts = posts?.value?.filter((p) => {
      return (
        !related.some((relatedPost) => relatedPost.id === p.id) &&
        p.id !== post?.value?.id
      );
    });
    const randomPostsToAdd = randomPosts?.slice(0, remain) || [];
    return [...related, ...randomPostsToAdd];
  }
  return related;
});

const formattedDate = computed(() => {
  const date = new Date(post?.value?.date || '');
  const localeCode = locale.value === 'vi' ? 'vi-VN' : 'en-US';
  return date.toLocaleDateString(localeCode, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      if (window.location.hash) {
        const decodedHash = decodeURIComponent(window.location.hash);
        const el = document.querySelector(decodedHash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 100);
  });
});

useHead({
  title: post.value?.title || "",
  meta: [
    // --- SEO ---
    { name: "description", content: post.value?.description },
    { name: "author", content: "Vinh Tieng" },
    { name: "robots", content: "index, follow" },
    { name: "keywords", content: post.value?.keywords || '' },
    { name: "robots", content: "index, follow" },

    // --- Open Graph (Facebook, Zalo, LinkedIn...) ---
    { property: "og:type", content: "article" },
    { property: "og:title", content: post.value?.title },
    { property: "og:description", content: post.value?.description },
    { property: "og:image", content: post.value?.image || "/images/blog/default.jpg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:url", content: `${SITE}/blog/${slug}` },
    { property: "og:site_name", content: "Vinh Tieng" },

    // --- Twitter Card ---
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: post.value?.title },
    { name: "twitter:description", content: post.value?.description },
    { name: "twitter:image", content: post.value?.image || "/images/blog/default.jpg" },

    // --- Content type & language ---
    { "http-equiv": "Content-Type", content: "text/html; charset=UTF-8" },
    { "http-equiv": "Content-Language", content: "vi" },
  ],
  link: [
    { rel: "canonical", href: `${SITE}/blog/${slug}` },
    ...(post.value?.image 
      ? [{ 
          rel: "preload", 
          as: "image", 
          href: post.value.image,
          fetchpriority: "high"
        }]
      : [])
  ],
});
</script>

<template>
  <main class="min-h-screen text-gray-800 dark:text-gray-100 relative z-10">
    <div v-if="post" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pb-16">
      <div class="relative flex gap-8">
        <!-- Main Content -->
        <article class="flex-1 min-w-0">
          <!-- Header Section -->
          <header class="mb-8">
            <h1 class="text-4xl sm:text-5xl font-bold mb-4 tracking-tight text-gray-900 dark:text-gray-100">
              {{ post.title }}
            </h1>
            
            <!-- Metadata -->
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-700 dark:text-gray-300 mb-6">
              <div class="flex items-center gap-2">
                <NuxtIcon name="document" class="text-base" />
                <time :datetime="post.date">{{ formattedDate }}</time>
              </div>
              <div v-if="post.tags && post.tags.length" class="flex flex-wrap items-center gap-2">
                <NuxtIcon name="tag" class="text-base" />
                <Tag
                  v-for="tag in post.tags"
                  :key="tag"
                  :label="tag"
                  size="sm"
                />
              </div>
            </div>

            <!-- Hero Image -->
            <div v-if="post.image" class="mb-8 rounded-xl overflow-hidden shadow-xl">
              <NuxtImg
                :src="post.image"
                class="w-full aspect-video object-cover"
                width="1200"
                height="675"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, (max-width: 1280px) 80vw, 1200px"
                format="webp"
                quality="85"
                priority
                fetchpriority="high"
                :alt="post.title"
                :title="post.title"
              />
            </div>
          </header>

          <!-- Content -->
          <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 sm:p-8 lg:p-10">
            <div class="prose prose-lg dark:prose-invert max-w-none">
              <ContentRenderer
                :value="post"
                class="post-content"
              />
            </div>
          </div>

          <!-- Related posts -->
          <div class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700" v-if="relatedDisplayPosts.length">
            <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              {{ $t("related_posts") }}
            </h2>
            <div class="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-2">
              <PostItem
                v-for="relatedPost in relatedDisplayPosts"
                :key="relatedPost.id"
                :post="relatedPost"
              />
            </div>
          </div>
        </article>

        <!-- TOC Sidebar -->
        <aside class="hidden xl:block w-64 flex-shrink-0">
          <div class="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <TOC :items="post.body.value" />
          </div>
        </aside>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-20">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full mb-6">
        <NuxtIcon name="document" class="text-4xl text-gray-500 dark:text-gray-400" />
      </div>
      <p class="mb-4 text-lg text-gray-700 dark:text-gray-300">{{ $t("post_not_found") }}</p>
      <NuxtLink
        :to="localePath('/blog')"
        class="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-colors"
      >
        {{ $t("back_to_blog") }}
      </NuxtLink>
    </div>
  </main>
</template>
