import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
    router: {
        options: {
            strict: true,
        },
        extendRoutes(routes, resolve) {
            routes.push({
                name: 'survey',
                path: '/survey',
                component: resolve(__dirname, 'pages/SurveyPage.vue')
            })

            routes.push({
                name: 'survey-register',
                path: '/survey/register',
                component: resolve(__dirname, 'pages/SurveyRegisterPage.vue')
            })
        }
    }
})