import axios from 'axios'
import { defineStore } from 'pinia'
import { createAxiosInstances } from '~/utility/axiosInstance'

interface SubscriptionInfo {
    "id" : number
    "name" : string
    "type" : string
    "brief_description" : string
    "description" : string
    "price" : number
}

export const useSubscriptionStore = defineStore('subscriptionStore', {
    state: () => ({}),
    actions: {
        async registerSubscription(postData: Omit<SubscriptionInfo, 'id'>): Promise<string> {
            const {djangoAxiosInst} = createAxiosInstances()
            try {
                
                const response = await djangoAxiosInst.post('subscription/create', postData)
                return response.data
            } catch (error) {
                if (axios.isAxiosError(error)){
                    if (error.response?.status === 400) {
                        return error.response.data.message  
                    }
                }
                return '구독권 추가 중 오류 발생'
            }
        },

        async getSubscription() {
            const {djangoAxiosInst} = createAxiosInstances()
            try {
                const response = await djangoAxiosInst.get('subscription/list')
                return response.data
            } catch (error) {
                console.error('구독권 목록을 가져오는 중 오류 발생: ', error)
                throw error
            }
        },

        async readSubscriptionById(subscriptionId: number) {
            const {djangoAxiosInst} = createAxiosInstances()
            try {
                const response = await djangoAxiosInst.get(`subscription/read/${subscriptionId}`)
                return response.data
            } catch(error) {
                console.error ('구독권 정보를 받아오는 중 오류 발생', error)
                throw error
            }
        },

        async modifySubscription(subscriptionId: number, updateData: Partial<SubscriptionInfo>): Promise<any>{
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const response = await djangoAxiosInst.put(`subscription/modify/${subscriptionId}`, updateData)
                return response.data
            } catch (error) {
                console.error('구독권 수정 중 오류 발생:', error)
                if (axios.isAxiosError(error) && error.response?.status === 400) {
                throw new Error('입력한 데이터가 유효하지 않습니다.')
                }
                throw new Error('구독권 수정 중 오류가 발생했습니다.')
            }
        },

        async deleteSubscription(subscriptionId: number){
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const response = await djangoAxiosInst.delete(`subscription/delete/${subscriptionId}`)
                return response
            } catch (error) {
                console.error('deleteFreeCommunityContent 중 에러:', error)
                throw error
            }
        }, 
    }
})