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
            pages.push({
                name: 'growthBlogUserPage-page',
                path: '/growth-blog/my-page/:nickname',
                file: resolve(themeDir, 'growthBlog/pages/myPage/GrowthBlogUserPage.vue'),
            })
            pages.push({
                name: 'growthBlogRead-page',
                path: '/growth-blog/:id',
                file: resolve(themeDir, 'growthBlog/pages/read/GrowthBlogRead.vue'),
            })
            pages.push({
                name: 'growthBlogRegister-page',
                path: '/growth-blog/register',
                file: resolve(themeDir, 'growthBlog/pages/register/GrowthBlogRegister.vue'),
            })
            pages.push({
                name: 'growthBlogFollowersListPage',
                path: '/growth-blog/followers',
                file: resolve(themeDir, 'growthBlog/pages/followList/growthBlogFollowersList.vue'),
            })
            pages.push({
                name: 'growthBlogFollowingListPage',
                path: '/growth-blog/following',
                file: resolve(themeDir, 'growthBlog/pages/followList/growthBlogFollowingList.vue'),
            })
        })

        nuxt.hook('imports:dirs', (dirs) => {
            dirs.push(resolve(__dirname, 'store'))
        })
    },
})