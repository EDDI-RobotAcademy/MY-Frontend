import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from 'path';

export default defineNuxtModule({
    meta: {
        name: 'BoardPage',
        configKey: 'BoardPage',
    },

    setup(moduleOptions, nuxt) {
        const themeDir = resolve(__dirname, '..')

        nuxt.hook('pages:extend', (pages) => {
            pages.push({
                name: 'BoardListPage',
                path: '/board/list',
                file: resolve(themeDir, 'board/pages/list/BoardListPage.vue'),
            })
            pages.push({
                name: 'BoardRegisterPage',
                path: '/board/register',
                file: resolve(themeDir, 'board/pages/register/BoardRegisterPage.vue'),
            })
        })

        nuxt.hook('imports:dirs', (dirs) => {
            dirs.push(resolve(__dirname, 'store'))
        })
    },
})