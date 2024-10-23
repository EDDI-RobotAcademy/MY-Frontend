import axios from 'axios'
import { defineStore } from 'pinia'
import { createAxiosInstances } from '~/utility/axiosInstance'

interface SubscriptionInfo{
    id : number
    name : string
    type : string
    description : string
    price : number
}

export const useSubscriptionStore = defineStore('subscriptionStore', {
    state: () => ({}),
    actions: {
        async registerSubscription(postData: SubscriptionInfo): Promise<string> {
            const {djangoAxiosInst} = createAxiosInstances()
            try {
                const response = await djangoAxiosInst.post('subscription/create', {postData})
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
    }
})