import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from 'path';

export default defineNuxtModule({
    meta: {
        name: 'growthBlog',
        configKey: 'growthBlog',
    },

    setup(moduleOptions, nuxt) {
        const themeDir = resolve(__dirname, '..')

        nuxt.hook('pages:extend', (pages) => {
            pages.push({
                name: 'growthBlogList-page',
                path: '/growth-blog/list',
                file: resolve(themeDir, 'growthBlog/pages/list/GrowthBlogList.vue'),
            })
            pages.push({
                name: 'growthBlogMyPage-page',
                path: '/growth-blog/my-page',
                file: resolve(themeDir, 'growthBlog/pages/myPage/GrowthBlogMyPage.vue'),
            })
        })

        nuxt.hook('imports:dirs', (dirs) => {
            dirs.push(resolve(__dirname, 'store'))
        })
    },
})