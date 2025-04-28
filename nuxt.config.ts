import { app, css, vite, i18n } from "./configs"
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxt/content",
    "@nuxt/icon",
    "@nuxt/image",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "@nuxt/fonts",
    'unplugin-icons/nuxt',
  ],
  content: {},
  css,
  vite,
  imports: {
    autoImport: false,
  },
  app,
  i18n,
  fonts: {
    families: [
      {
        name: "Montserrat",
        provider: "google",
        weights: [400, 500, 600, 700],
        styles: ["normal", "italic"],
        fallbacks: ["sans-serif"],
      },
    ],
  }
});