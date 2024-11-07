
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
        async requestGetViewCount() {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const response = await djangoAxiosInst.get('viewCount/response-view-count')
                return response.data
            } catch (error) {
                console.error('requestGetViewCount 중 오류 발생:', error)
                throw error
            }
        },
    }
})