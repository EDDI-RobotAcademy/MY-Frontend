import axios from 'axios'
import { defineStore } from 'pinia'
import { createAxiosInstances } from '../../utility/axiosInstance'

export const useGrowthBlogStore = defineStore('growthBlogStore', {
    state: () => ({
        followingCount: 0,
        followersCount: 0,
        following: [],
        followers: [],
        isFollowing: false,
        isLoading: false
    }),
    actions: {
        async getFollowInfo() {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const path = window.location.pathname
                let requestData = {}

                if (path === '/growth-blog/my-page') {
                    const userToken = localStorage.getItem("userToken")
                    requestData = { userToken: userToken }
                } else {
                    const nickname = path.split('/').pop()
                    requestData = { nickname: nickname }
                }

                const response = await djangoAxiosInst.post('growth_blog/getFollowInfo', requestData)

                this.followingCount = response.data.following.length
                this.followersCount = response.data.followers.length
                this.following = response.data.following
                this.followers = response.data.followers
                
                
                
                return response.data
            } catch (error) {
                console.error('팔로우 정보 조회 실패:', error)
                throw error
            }
        },
        async registerSocial(FollowerNickname: string) {
            const { djangoAxiosInst } = createAxiosInstances()
            this.isLoading = true
            try {
                const userToken = localStorage.getItem("userToken")

                const response = await djangoAxiosInst.post('growth_blog/registerSocial', {
                    userToken: userToken,
                    FollowerNickname: FollowerNickname
                })

                this.isFollowing = true
                await this.getFollowInfo()
                return response.data
            } catch (error) {
                console.error('팔로우 실패:', error)
                throw error
            } finally {
                this.isLoading = false
            }
        },
    }
})