import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from 'path';

export default defineNuxtModule({
    meta: {
        name: 'SubscriptionPage',
        configKey: 'SubscriptionPage',
    },

    setup(moduleOptions, nuxt) {
        const themeDir = resolve(__dirname, '..')

        nuxt.hook('pages:extend', (pages) => {
            pages.push({
                name: 'SubscriptionListPage',
                path: '/subscription/list',
                file: resolve(themeDir, 'subscription/pages/list/SubscriptionListPage.vue'),
            })

            pages.push({
                name: 'SubscriptionReadPage',
                path: '/subscription/read/:subscriptionId',
                file: resolve(themeDir, 'subscription/pages/read/SubscriptionReadPage.vue'),
            })

            pages.push({
                name: 'SubscriptionModifyPage',
                path: '/subscription/modify/:subscriptionId',
                file: resolve(themeDir, 'subscription/pages/modify/SubscriptionModifyPage.vue'),
            })

            pages.push({
                name: 'SubscriptionRegisterPage',
                path: '/subscription/register',
                file: resolve(themeDir, 'subscription/pages/register/SubscriptionRegisterPage.vue'),
            })

        })
        nuxt.hook('imports:dirs', (dirs) => {
            dirs.push(resolve(__dirname, 'store'))
        })
    },
})