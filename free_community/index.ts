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
                path: '/free_community/list',
                file: resolve(themeDir, 'free_community/pages/list/FreeCommunityListPage.vue'),
            })
            pages.push({
                name: 'FreeCommunityRegisterPage',
                path: '/free_community/register',
                file: resolve(themeDir, 'free_community/pages/register/FreeCommunityRegisterPage.vue'),
            })
            pages.push({
                name: 'FreeCommunityModifyPage',
                path: '/free_community/modify/:free_communityId',
                file: resolve(themeDir, 'free_community/pages/modify/FreeCommunityModifyPage.vue'),
            })
            pages.push({
                name: 'FreeCommunityReadPage',
                path: '/free_community/read/:free_communityId',
                file: resolve(themeDir, 'free_community/pages/read/FreeCommunityReadPage.vue'),
            })
        })
        nuxt.hook('imports:dirs', (dirs) => {
            dirs.push(resolve(__dirname, 'store'))
        })
    },
})