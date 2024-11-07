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
    async requestListSmartContentToDjango(page, pageSize) {
      const { djangoAxiosInst } = createAxiosInstances()

      try {
        const response = await djangoAxiosInst.post('/smart_content/list', {
          page: page,
          page_size: pageSize
        })
        return response.data
      } catch (error) {
        console.error('requestListSmartContentToDjango 중 에러 발생:', error)
        throw error
      }
    },
    async requestListItemsToDjango(content_id: string) {
      const { djangoAxiosInst } = createAxiosInstances()

      try {
        const response = await djangoAxiosInst.post('/smart_content/list-items', { content_id: content_id })
        return response.data
      } catch (error) {
        console.error('requestListItemsToDjango 중 에러 발생:', error)
        throw error
      }
    },
    async readSmartContentToDjango(contentId: number) {
      const { djangoAxiosInst } = createAxiosInstances()
      try {
        const response = await djangoAxiosInst.get(`smart_content/read/${contentId}`)
        return response.data
      } catch (error) {
        console.error('readSmartContentToDjango 중 에러:', error)
        throw error
      }
    },
    async requestListMySmartContentToDjango(userToken: string, page, pageSize) {
      const { djangoAxiosInst } = createAxiosInstances()
      try {
        const response = await djangoAxiosInst.post(`smart_content/list-my-content`, {
          userToken,
          page: page,
          page_size: pageSize
        })
        return response.data
      } catch (error) {
        console.error('requestListMySmartContentToDjango 중 에러:', error)
        throw error
      }
    },
    async requestListUserSmartContentToDjango(nickname: string, page, pageSize) {
      const { djangoAxiosInst } = createAxiosInstances()
      try {
        const response = await djangoAxiosInst.post(`smart_content/list-user-content`, {
           nickname,
           page: page,
           page_size: pageSize
          })
        return response.data
      } catch (error) {
        console.error('requestListUserSmartContentToDjango 중 에러:', error)
        throw error
      }
    },
  }
})