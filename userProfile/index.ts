import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from 'path';

export default defineNuxtModule({
    meta: {
        name: 'userProfile',
        configKey: 'userProfile',
    },

    setup(moduleOptions, nuxt) {
        const themeDir = resolve(__dirname, '..')

        nuxt.hook('pages:extend', (pages) => {
            pages.push({
                name: 'myProfile-page',
                path: '/my-page',
                file: resolve(themeDir, 'userProfile/pages/myProfile/MyProfilePage.vue'),
            })
            pages.push({
                name: 'myInfo-page',
                path: '/my-info',
                file: resolve(themeDir, 'userProfile/pages/myInfo/MyInfoPage.vue'),
            })
        })

        nuxt.hook('imports:dirs', (dirs) => {
            dirs.push(resolve(__dirname, 'store'))
        })
    },
})