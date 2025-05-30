<script setup lang="ts">
import { ref, watch } from "vue";
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
  link: [{ rel: "canonical", href: `${SITE}/blog` }],

});
</script>

<template>
  <main class="min-h-screen text-gray-800 dark:text-gray-100 p-container z-10 pt-10">
    <div class="flex items-center justify-center mb-4">
      <SearchInput />
    </div>

    <!-- Tag display -->
    <div class="flex flex-wrap gap-2 mb-4">
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
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <PostItem
        v-for="post in posts"
        :key="post.id"
        :post="post as BlogCollectionItem"
      />
    </div>

    <div v-if="posts.length === 0" class="text-center text-gray-500">
      <p>{{ $t("no_posts") }}
        <span @click="refreshPost" class="text-blue-500 hover:underline cursor-pointer">
          {{ $t("refresh") }}
        </span>
      </p>
    </div>

    <!-- Pagination -->
    <Pagination
      :currentPage="currentPage"
      :totalItems="totalPosts"
      :perPage="PER_PAGE"
      :maxVisiblePages="5"
      @update:page="handlePageChange"
    />
  </main>
</template>
