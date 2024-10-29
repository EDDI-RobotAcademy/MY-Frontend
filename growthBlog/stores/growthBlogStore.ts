import axios from 'axios'
import { defineStore } from 'pinia'
import { createAxiosInstances } from '../../utility/axiosInstance'

export const useGrowthBlogStore = defineStore('growthBlogStore', {
    actions: {
        async registerSocial(FollowerNickname: string): Promise<string> {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const userToken = localStorage.getItem("userToken")

                const payload = {
                    userToken: userToken,
                    FollowerNickname: FollowerNickname
                }
                const response = await djangoAxiosInst.post('growth_blog/registerSocial', payload)
                return response.data
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 400) {
                        return error.response.data.message || 'registerSocial 400 오류'
                    } else if (error.response?.status === 403) {
                        return 'registerSocial 중 오류가 발생했습니다.'
                    }
                }
                return 'registerSocial 중 오류가 발생했습니다.'
            }
        }
    }
})