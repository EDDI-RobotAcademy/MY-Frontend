import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from 'path';

export default defineNuxtModule({
    meta: {
        name: 'tosspayments',
        configKey: 'tosspayments',
    },

    setup(moduleOptions, nuxt) {
        const themeDir = resolve(__dirname, '..')

        nuxt.hook('pages:extend', (pages) => {
            pages.push({
                name: 'tosspaymentwidget',
                path: '/tosspayments',
                file: resolve(themeDir, 'tosspayments/pages/widget/tosspaymentwidget.vue'),
            })
            pages.push({
                name: 'tosspaymentsuccess',
                path: '/tosspayments/success',
                file: resolve(themeDir, 'tosspayments/pages/success/success.vue'),
            })
            pages.push({
                name: 'tosspaymentfail',
                path: '/tosspayments/fail',
                file: resolve(themeDir, 'tosspayments/pages/fail/fail.vue'),
            })
        })

        nuxt.hook('imports:dirs', (dirs) => {
            dirs.push(resolve(__dirname, 'store'))
        })
    },
})