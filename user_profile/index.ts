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
                name: 'userProfile-page',
                path: '/my-page',
                file: resolve(themeDir, 'user_profile/pages/MyProfile/MyProfilePage.vue'),
            })
            pages.push({
                name: 'growthDiary-page',
                path: '/growthDiary',
                file: resolve(themeDir, 'user_profile/pages/GrowthDiary/GrowthDiary.vue'),
            })
            pages.push({
                name: 'growthDiaryMyPage-page',
                path: '/growthDiaryMyPage',
                file: resolve(themeDir, 'user_profile/pages/GrowthDiary/GrowthDiaryMyPage.vue'),
            })
        })

        nuxt.hook('imports:dirs', (dirs) => {
            dirs.push(resolve(__dirname, 'store'))
        })
    },
})