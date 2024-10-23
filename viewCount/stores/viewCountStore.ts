
import { defineStore } from "pinia"
import { createAxiosInstances } from '../../utility/axiosInstance'

export const useViewCountStore = defineStore('ViewCountStore', {
    actions: {
        async requestIncrementViewCount(free_communityId: number) {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const response = await djangoAxiosInst.post(`viewCount/increment-count/${free_communityId}`)
                return response.data
            } catch (error) {
                console.error('requestIncrementViewCount 중 에러:', error)
                throw error
            }
        },
    }
})