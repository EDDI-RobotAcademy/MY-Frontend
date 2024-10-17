import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from 'path';

export default defineNuxtModule ({
    meta: {
        name: 'userAnalysis',
        configKey: 'userAnalysis',
    },

    setup(moduleOptions, nuxt) {
        const themeDir = resolve(__dirname, '..')

        nuxt.hook('pages:extend', (pages) => {
            pages.push({
                name: 'userAnalysis-page',
                path: '/user-analysis',
                file: resolve(themeDir, 'userAnalysis/pages/UserAnalysisPage.vue'),
            })
            pages.push({
                name: 'userAnalysisResult-page',
                path: '/user-analysis/result',
                file: resolve(themeDir, 'userAnalysis/pages/UserAnalysisResultPage.vue'),
            })
        })

        nuxt.hook('imports:dirs', (dirs) => {
            dirs.push(resolve(__dirname, 'store'))
        })
    },
})