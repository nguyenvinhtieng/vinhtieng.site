import { useAsyncData } from "#app";
import { queryCollection } from "#imports";

export default async function useGetAllTag() {
  const { data: tagOnlyPosts } = await useAsyncData("blog-tags", () =>
    queryCollection("blog").select("tags").all()
  );

  const tags = tagOnlyPosts.value?.reduce((acc, post) => {
    const postTags = post.tags || [];
    postTags.forEach((tag) => acc.add(tag));
    return acc;
  }, new Set<string>());

  return tags;
}
