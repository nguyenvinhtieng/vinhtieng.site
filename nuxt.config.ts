import { app, css, vite, i18n } from "./configs"
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/content", "@nuxt/icon", "@nuxt/image", "@pinia/nuxt", "@nuxtjs/i18n"],
  content: {},
  css,
  vite,
  imports: {
    autoImport: false,
  },
  app,
  i18n
});
