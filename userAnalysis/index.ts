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
            pages.push({
                name: 'userAnalysisList-page',
                path:'/user-analysis/list',
                file: resolve(themeDir, 'userAnalysis/pages/UserAnalysisListPage.vue'),
            })
            pages.push({
                name: 'userAnalysisRead-page',
                path:'/user-analysis/read/:id',
                file: resolve(themeDir, 'userAnalysis/pages/UserAnalysisReadPage.vue'),
            })
            pages.push({
                name: 'userAnalysisVisualizateion-page',
                path:'/user-analysis/visualization',
                file: resolve(themeDir, 'userAnalysis/pages/UserAnalysisVisualizationPage.vue'),
            })
            pages.push({
                name: 'userAnalysisPastResult-page',
                path: '/user-analysis/past-result/:id',
                file: resolve(themeDir, 'userAnalysis/pages/UserAnalysisPastResultPage.vue'),
            })
            
        })

        nuxt.hook('imports:dirs', (dirs) => {
            dirs.push(resolve(__dirname, 'store'))
        })
    },
})