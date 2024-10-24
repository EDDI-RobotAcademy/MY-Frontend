import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from 'path';

export default defineNuxtModule ({
    meta: {
        name: 'KakaoPayRedirection',
        configKey: 'KakaoPayRedirection',
    },

    setup(moduleOptions, nuxt) {
        const themeDir = resolve(__dirname, '..')

        nuxt.hook('pages:extend', (pages) => {
            pages.push({
                name: 'KakaoPayRedirection',
                path: '/kakao_pay/readyKakaoPay',
                file: resolve(themeDir, 'kakaopay/pages/KakaoPayRedirection.vue'),
            })
        })

        nuxt.hook('imports:dirs', (dirs) => {
            dirs.push(resolve(__dirname, 'store'))
        })
    },
})