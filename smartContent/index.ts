import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from 'path';

export default defineNuxtModule ({
    meta: {
        name: 'smartContent',
        configKey: 'smartContent',
    },

    setup(moduleOptions, nuxt) {
        const themeDir = resolve(__dirname, '..')

        nuxt.hook('pages:extend', (pages) => {
            pages.push({
                name: 'aws-s3-test',
                path: '/aws/s3/test',
                file: resolve(themeDir, 'smartContent/pages/FileS3TestPage.vue'),
            })
            pages.push({
                name: 'smart-content',
                path: '/smart-content',
                file: resolve(themeDir, 'smartContent/pages/SmartContent.vue'),  
            })
        })

        nuxt.hook('imports:dirs', (dirs) => {
            dirs.push(resolve(__dirname, 'store'))
        })
    },
})