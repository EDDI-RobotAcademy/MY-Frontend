import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  app: {
    head: {
      title: '쿠잉 (COOING)'
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
    './influencerAnalysis/nuxt.config.ts',
    './board/nuxt.config.ts',
  ],

  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.min.css'
  ],

  build: {
    transpile: ['vuetify'] // Vuetify를 빌드 시 트랜스파일링
  },

  vite: {
    ssr: {
      noExternal: ['vuetify'] // SSR에서도 Vuetify를 외부 패키지로 처리하지 않도록 설정
    }
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
    '~/influencerAnalysis/index.ts',
    '~/board/index.ts',
  ],

  imports: {
    dirs: ['./stores']
  },

  runtimeConfig: {
    public: {
      MAIN_API_URL: process.env.MAIN_API_URL,
      AI_BASE_URL: process.env.AI_BASE_URL,
      AWS_REGION: process.env.VUE_APP_AWS_REGION,
      AWS_S3_IDENTITY_POOL: process.env.VUE_APP_AWS_S3_IDENTITY_POOL_ID,
      YOUTUBE_API_KEY: process.env.VUE_APP_YOUTUBE_API_KEY
    }
  }
})