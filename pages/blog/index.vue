<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { queryCollection } from "#imports";
import Pagination from "~/components/Pagination.vue";
import SearchInput from "~/components/SearchInput.vue";
import Tag from "~/components/Tag.vue";
import useGetAllTag from "~/composables/useGetAllTag";
import useUrlParams from "~/composables/useUrlParams";
import type { BlogCollectionItem } from '@nuxt/content';
import { useHead } from "#app";
import { SITE } from "~/constants/common";

const PER_PAGE = 9;
const TAG_PARAM = "tags";
const PAGE_PARAM = "page";

const { setParams, getParam } = useUrlParams();

const activeTags = ref(getParam(TAG_PARAM)?.split(",") || []);
const currentPage = ref(parseInt(getParam(PAGE_PARAM) || "1") || 1);
const posts = ref<BlogCollectionItem[]>([]);
const totalPosts = ref(0);
const tags = await useGetAllTag();

// Function to fetch data
const fetchData = async () => {
  const createQuery = () => {
    let query = queryCollection("blog").where("published", "=", true).order("date", "DESC");
    if (activeTags.value.length) {
      query = query.orWhere((group) => {
        activeTags.value.forEach((tag) => {
          group = group.where("tags", "LIKE", `%${tag}%`);
        });
        return group;
      });
    }
    return query;
  };

  const paginated = await createQuery()
    .limit(PER_PAGE)
    .skip((currentPage.value - 1) * PER_PAGE)
    .all();

  const count = await createQuery().count();

  posts.value = paginated;
  totalPosts.value = count;
};

await fetchData();

// Watch for changes in activeTags and currentPage and fetch data again
watch([activeTags, currentPage], async () => {
  setParams({
    [TAG_PARAM]: activeTags.value.join(","),
    [PAGE_PARAM]: currentPage.value.toString(),
  });
  await fetchData();
}, {
  deep: true,
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const handleFilterTag = (tag: string) => {
  if (activeTags.value.includes(tag)) {
    activeTags.value.splice(activeTags.value.indexOf(tag), 1);
  } else {
    activeTags.value.push(tag);
  }
  handlePageChange(1);
};

const refreshPost = () => {
  currentPage.value = 1;
  activeTags.value = [];
  fetchData();
};

const firstPostImage = computed(() => {
  return posts.value.length > 0 && posts.value[0].image 
    ? posts.value[0].image 
    : null;
});

useHead({
  title: "Blog",
  meta: [
     { name: "description", content: "A technical blog sharing tips, tutorials, and deep-dives on web development, JavaScript, TypeScript, and modern technologies." },
    { name: "author", content: "Vinh Tieng" },
    { name: "keywords", content: "blog, web development, JavaScript, TypeScript, tutorials, tips" },
    { name: "robots", content: "index, follow" },
    { property: "og:title", content: "Blog" },
    { property: "og:description", content: "A technical blog sharing tips, tutorials, and deep-dives on web development, JavaScript, TypeScript, and modern technologies." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `${SITE}/blog` },
    { property: "og:image", content: `${SITE}/images/cover.webp` },
    { property: "twitter:title", content: "Blog" },
    { property: "twitter:description", content: "A technical blog sharing tips, tutorials, and deep-dives on web development, JavaScript, TypeScript, and modern technologies." },
    { property: "twitter:image", content: `${SITE}/images/cover.webp` },
    { property: "twitter:card", content: "summary_large_image" }
  ],
  link: computed(() => [
    { rel: "canonical", href: `${SITE}/blog` },
    ...(firstPostImage.value 
      ? [{ 
          rel: "preload", 
          as: "image", 
          href: firstPostImage.value,
          fetchpriority: "high"
        }]
      : [])
  ]),

});
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>

<template>
  <main class="min-h-screen text-gray-800 dark:text-gray-100 relative z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pb-16">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 mb-6">
          <NuxtIcon name="document-text-bold" class="text-4xl text-sky-500 dark:text-sky-400 animate-float" />
        </div>
        
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-gray-900 dark:text-gray-100">
          📝 {{ $t('blog_list.title') }}
        </h1>
        
        <p class="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          {{ $t('blog_list.subtitle') }}
        </p>

        <!-- Search Bar -->
        <div class="flex justify-center mb-8">
          <div class="w-full max-w-2xl">
            <SearchInput />
          </div>
        </div>
      </div>

      <!-- Tag display -->
      <div class="flex flex-wrap justify-center gap-3 mb-8">
        <Tag
          v-for="tag in tags"
          :key="tag"
          :label="tag"
          :is-active="activeTags.includes(tag)"
          @click="handleFilterTag(tag)"
        >
          {{ tag }}
        </Tag>
      </div>

      <!-- Posts display -->
      <section v-if="posts.length > 0" aria-labelledby="posts-heading">
        <h2 id="posts-heading" class="sr-only">Blog Posts</h2>
        <div class="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          <PostItem
            v-for="(post, index) in posts"
            :key="post.id"
            :post="post as BlogCollectionItem"
            :is-first="index === 0"
          />
        </div>
      </section>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full mb-6">
          <NuxtIcon name="document" class="text-4xl text-gray-400 animate-bounce" />
        </div>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {{ $t("no_posts") }}
        </h2>
        <p class="text-gray-700 dark:text-gray-300 mb-6">
          No posts found matching your criteria
        </p>
        <button
          @click="refreshPost"
          class="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-colors"
        >
          {{ $t("refresh") }}
        </button>
      </div>

      <!-- Pagination -->
      <Pagination
        v-if="posts.length > 0"
        :currentPage="currentPage"
        :totalItems="totalPosts"
        :perPage="PER_PAGE"
        :maxVisiblePages="5"
        @update:page="handlePageChange"
      />
    </div>
  </main>
</template>
