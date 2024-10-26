import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
  ],
  router: {
    options: {
      strict: true,
    },
  },
})