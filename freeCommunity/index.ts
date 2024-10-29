import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from 'path';

export default defineNuxtModule({
    meta: {
        name: 'FreeCommunityPage',
        configKey: 'FreeCommunityPage',
    },

    setup(moduleOptions, nuxt) {
        const themeDir = resolve(__dirname, '..')

        nuxt.hook('pages:extend', (pages) => {
            pages.push({
                name: 'FreeCommunityListPage',
                path: '/free-community/list',
                file: resolve(themeDir, 'freeCommunity/pages/list/FreeCommunityListPage.vue'),
            })
            pages.push({
                name: 'FreeCommunityRegisterPage',
                path: '/free-community/register',
                file: resolve(themeDir, 'freeCommunity/pages/register/FreeCommunityRegisterPage.vue'),
            })
            pages.push({
                name: 'FreeCommunityModifyPage',
                path: '/free-community/modify/:free_communityId',
                file: resolve(themeDir, 'freeCommunity/pages/modify/FreeCommunityModifyPage.vue'),
            })
            pages.push({
                name: 'FreeCommunityReadPage',
                path: '/free-community/read/:free_communityId',
                file: resolve(themeDir, 'freeCommunity/pages/read/FreeCommunityReadPage.vue'),
            })
        })
        nuxt.hook('imports:dirs', (dirs) => {
            dirs.push(resolve(__dirname, 'store'))
        })
    },
})