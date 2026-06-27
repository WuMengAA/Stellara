export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    'nuxt-icon',
    '@nuxtjs/sitemap',
  ],

  sitemap: { hostname: 'http://localhost:3007' },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
    dataValue: 'theme',
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'stellara-dev-secret-change-in-production',
    public: {
      siteName: 'Stellara',
      siteDescription: '星与代码的协奏曲',
      siteUrl: 'http://localhost:3007',
    },
  },

  nitro: {
    preset: 'node-server',
    experimental: {
      openAPI: true,
    },
  },

  app: {
    head: {
      title: 'Stellara',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '星与代码的协奏曲' },
        { property: 'og:title', content: 'Stellara' },
        { property: 'og:description', content: '星与代码的协奏曲' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Stellara' },
        { name: 'twitter:description', content: '星与代码的协奏曲' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  tailwindcss: {
    configPath: 'tailwind.config.ts',
    cssPath: '~/assets/css/main.css',
  },

  compatibilityDate: '2024-12-01',
})
