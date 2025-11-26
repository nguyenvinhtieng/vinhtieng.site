// import { SITE } from '@/constants/common';
const SITE = "https://vinhtieng.com"
export const app = {
  head: {
    title: "Vinh Tieng | Portfolio & Software Engineer | Technical Blog",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },

      {
        name: "description",
        content:
          "Explore the professional portfolio of Vinh Tieng, a passionate software engineer specializing in modern web development, full-stack projects, and impactful user experiences.",
      },
      { name: "author", content: "Vinh Tieng" },
      {
        name: "keywords",
        content:
          "vinh tieng, Vinh Tieng, portfolio, web developer, software engineer, frontend, backend, full-stack",
      },
      {
        name: "description:vi",
        content:
          "Khám phá portfolio cá nhân của Vinh Tieng – kỹ sư phần mềm chuyên về phát triển web.",
      },

      { property: "og:title", content: "Vinh Tieng | Portfolio & Software Engineer | Technical Blog" },
      {
        property: "og:description",
        content:
          "Discover the work and experience of Vinh Tieng, a web developer building clean, performant, and scalable applications.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE },
      { property: "og:image", content: `${SITE}/cover.webp` },
      { property: "og:locale:alternate", content: "vi_VN" },

      { name: "twitter:title", content: "Vinh Tieng | Portfolio & Software Engineer | Technical Blog" },
      {
        name: "twitter:description",
        content:
          "Showcasing development skills, real-world projects, and experience in full-stack web technologies.",
      },
      { name: "twitter:image", content: `${SITE}/cover.webp` },

      // SEO
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#0ea5e9" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "canonical", href: `${SITE}/en` },
    ],
    script: [
      {
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7479988152616473",
        async: true,
      }
    ],
  },
};
