import { defineStore } from 'pinia'
import { createAxiosInstances } from '../../utility/axiosInstance'

interface SmartContentData {
    title: string
    content_type: string | null
    items: any[]
    userToken?: string
  }

export const useSmartContentStore = defineStore('smartContentStore', {
    state: () => ({}),
    actions: {
      async requestCreateSmartContentToDjango(smartContentData: SmartContentData): Promise<any> {
        const { djangoAxiosInst } = createAxiosInstances()
  
        try {
          const response = await djangoAxiosInst.post('/smart_content/create', smartContentData)
          return response.data
        } catch (error) {
          console.error('requestCreateSmartContentToDjango 중 에러 발생:', error)
          throw error
        }
      },
      async requestListSmartContentToDjango() {
        const { djangoAxiosInst } = createAxiosInstances()
  
        try {
          const response = await djangoAxiosInst.post('/smart_content/list')
          return response.data
        } catch (error) {
          console.error('requestListSmartContentToDjango 중 에러 발생:', error)
          throw error
        }
      },
      
    }
})