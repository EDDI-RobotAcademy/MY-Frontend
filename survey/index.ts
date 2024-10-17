import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from 'path';

export default defineNuxtModule({
    meta: {
        name: 'custom-pages',
        configKey: 'customPages',
    },

    setup(moduleOptions, nuxt) {
        const themeDir = resolve(__dirname, '..')

        nuxt.hook('pages:extend', (pages) => {
            pages.push({
                name: 'survey',
                path: '/survey',
                file: resolve(themeDir, 'survey/pages/SurveyPage.vue'),
            })
            pages.push({
                name: 'survey-register',
                path: '/survey/register',
                file: resolve(themeDir, 'survey/pages/SurveyRegisterPage.vue'),
            })
        })

        nuxt.hook('imports:dirs', (dirs) => {
            dirs.push(resolve(__dirname, 'store'))
        })
    },
})