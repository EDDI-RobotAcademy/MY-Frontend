import axios from 'axios'
import { defineStore } from 'pinia'

export const useBoardStore = defineStore('boardStore', {
  actions: {
    async addCategory(name: string): Promise<string> {
      try {
        const response = await axios.post('http://localhost:8000/board/create/category', { name })
        return response.data.message
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            return error.response.data.message || '이미 존재하는 카테고리입니다.'
          } else if (error.response?.status === 403) {
            return '카테고리 추가 중 오류가 발생했습니다.'
          }
        }
        return '카테고리 추가 중 오류가 발생했습니다.'
      }
    },
    async getCategories() {
        try {
          const response = await axios.get('http://localhost:8000/board/get/categories')
          return response.data
        } catch (error) {
          console.error('카테고리를 가져오는 중 오류 발생:', error)
          throw error
        }
      },
  }
})