import { app, css, vite, i18n } from "./configs"
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxt/content",
    "@nuxt/image",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "@nuxt/fonts",
    "nuxt-icons",
    '@nuxtjs/sitemap'
  ],
  content: {},
  site: { url: 'vinhtieng.com' },
  image: {
    quality: 85,
    format: ['webp'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },
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
        display: "swap",
      },
    ],
  },
  sitemap: {
    enabled: true,
    minify: true,
    xslTips: false
  },
  nitro: {
    routeRules: {
      '/_nuxt/**': { 
        headers: { 
          'Cache-Control': 'public, max-age=31536000, immutable',
          'cache-control': 'public, max-age=31536000, immutable'
        } 
      },
      '/_fonts/**': { 
        headers: { 
          'Cache-Control': 'public, max-age=31536000, immutable',
          'cache-control': 'public, max-age=31536000, immutable'
        } 
      },
      '/images/**': { 
        headers: { 
          'Cache-Control': 'public, max-age=31536000, immutable',
          'cache-control': 'public, max-age=31536000, immutable'
        } 
      },
      '/icons/**': { 
        headers: { 
          'Cache-Control': 'public, max-age=31536000, immutable',
          'cache-control': 'public, max-age=31536000, immutable'
        } 
      },
      '/**': { 
        headers: { 
          'Cache-Control': 'public, max-age=3600',
          'cache-control': 'public, max-age=3600'
        } 
      }
    },
    prerender: {
      crawlLinks: true
    }
  }
});
