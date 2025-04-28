export const app = {
  head: {
    title: "Tieng Nguyen | Technical Blog",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "description",
        content:
          "A technical blog sharing tips, tutorials, and deep-dives on web development, JavaScript, TypeScript, and modern technologies.",
      },
      { name: "author", content: "Tieng Nguyen" },

      {
        name: "description:vi",
        content:
          "Blog kỹ thuật chia sẻ mẹo, hướng dẫn và bài viết chuyên sâu về phát triển web, JavaScript, TypeScript và công nghệ hiện đại.",
      },

      { property: "og:title", content: "Tieng Nguyen | Technical Blog" },
      {
        property: "og:description",
        content:
          "Explore web development tutorials, tips, and technical articles written by Tieng Nguyen.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://vinhtieng.site" },
      { property: "og:image", content: "https://vinhtieng.site/cover.webp" },

      { property: "og:locale:alternate", content: "vi_VN" },

      { name: "twitter:title", content: "Tieng Nguyen | Technical Blog" },
      {
        name: "twitter:description",
        content:
          "Frontend and backend development guides, tips, and resources.",
      },
      { name: "twitter:image", content: "https://vinhtieng.site/cover.webp" },

      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#0ea5e9" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "canonical", href: "https://vinhtieng.site" },
    ],
  },
};