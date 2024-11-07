import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  app: {
    head: {
      title: '쿠잉 (COOING)',
      script: [
        {
          src: 'https://accounts.google.com/gsi/client',
          async: true,
          defer: true
        }
      ]
    }
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  extends: [
    './home/nuxt.config.ts',
    './account/nuxt.config.ts',
    './survey/nuxt.config.ts',
    './userAnalysis/nuxt.config.ts',
    './kakaoAuthentication/nuxt.config.ts',
    './googleAuthentication/nuxt.config.ts',
    './keywordAnalysis/nuxt.config.ts',
    './freeCommunity/nuxt.config.ts',
    './subscription/nuxt.config.ts',
    './tosspayments/nuxt.config.ts',
    './aiRequest/nuxt.config.ts',
    './userProfile/nuxt.config.ts',
    './smartContent/nuxt.config.ts',
    './growthBlog/nuxt.config.ts',
    './growthHistory/nuxt.config.ts',
  ],

  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.min.css'
  ],

  build: {
    transpile: ['vuetify', 'vue3-apexcharts', 'apexcharts', 'chart.js', 'vue-chartjs']
  },

  vite: {
    server: {
      ws: false,
      hmr: false,
    },
    ssr: {
      noExternal: ['vuetify']
    },
  },

  modules: [
    'vuetify-nuxt-module',
    '@pinia/nuxt',
    '~/home/index.ts',
    '~/account/index.ts',
    '~/survey/index.ts',
    '~/userAnalysis/index.ts',
    '~/kakaoAuthentication/index.ts',
    '~/googleAuthentication/index.ts',
    '~/keywordAnalysis/index.ts',
    '~/freeCommunity/index.ts',
    '~/subscription/index.ts',
    '~/smartContent/index.ts',
    '~/tosspayments/index.ts',
    '~/aiRequest/index.ts',
    '~/userProfile/index.ts',
    '~/growthBlog/index.ts',
    '~/growthHistory/index.ts',
  ],


  runtimeConfig: {
    public: {
      MAIN_API_URL: process.env.MAIN_API_URL,
      AI_BASE_URL: process.env.AI_BASE_URL,
      AWS_REGION: process.env.VUE_APP_AWS_REGION,
      AWS_S3_IDENTITY_POOL: process.env.VUE_APP_AWS_S3_IDENTITY_POOL_ID,
      BUCKET_NAME: process.env.VUE_APP_AWS_S3_BUCKET_NAME,
      YOUTUBE_API_KEY: process.env.VUE_APP_YOUTUBE_API_KEY,
      FIREBASE_API_KEY: process.env.VUE_APP_FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
      FIREBASE_DATABASE_URL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
      FIREBASE_PROJECT_ID: process.env.VUE_APP_FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.VUE_APP_FIREBASE_APP_ID,
      TOSS_CLIENT_KEY: process.env.VUE_APP_TOSS_CLIENT_KEY,
      GOOGLE_CLIENT_ID: process.env.VUE_APP_GOOGLE_CLIENT_ID,
    }
  }
})