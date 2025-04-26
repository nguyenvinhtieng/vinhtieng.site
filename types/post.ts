import type { BlogCollectionItem } from "@nuxt/content";

export type PostItemData = BlogCollectionItem & {
  draft: boolean;
};
