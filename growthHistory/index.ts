import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from 'path';

export default defineNuxtModule({
    meta: {
        name: 'growthHistory',
        configKey: 'growthHistory',
    },

    setup(moduleOptions, nuxt) {
        const themeDir = resolve(__dirname, '..')

        nuxt.hook('pages:extend', (pages) => {
            pages.push({
                name: 'growthHistory-page',
                path: '/growth-history',
                file: resolve(themeDir, 'growthHistory/pages/GrowthHistory.vue'),
            })
        })

        nuxt.hook('imports:dirs', (dirs) => {
            dirs.push(resolve(__dirname, 'store'))
        })
    },
})