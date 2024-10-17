import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from 'path';

export default defineNuxtModule ({
    meta: {
        name: 'KakaoRedirection',
        configKey: 'KakaoRedirection',
    },

    setup(moduleOptions, nuxt) {
        const themeDir = resolve(__dirname, '..')

        nuxt.hook('pages:extend', (pages) => {
            pages.push({
                name: 'KakaoRedirection',
                path: '/kakao_oauth/kakao-access-token',
                file: resolve(themeDir, 'kakaoAuthentication/pages/KakaoRedirection.vue'),
            })
        })

        nuxt.hook('imports:dirs', (dirs) => {
            dirs.push(resolve(__dirname, 'store'))
        })
    },
})