import axios from 'axios'
import { defineStore } from 'pinia'
import { createAxiosInstances } from '../../utility/axiosInstance'
export const useBoardStore = defineStore('boardStore', {
    actions: {
        async addCategory(name: string): Promise<string> {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const response = await djangoAxiosInst.post('board/create-category', { name })
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
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const response = await djangoAxiosInst.get('board/get-categories')
                return response.data
            } catch (error) {
                console.error('카테고리를 가져오는 중 오류 발생:', error)
                throw error
            }
        },
        async registerPost(postData: {
            writer: string,
            title: string,
            content: string,
            category_id: number,
        }) 
        {
            try {
                const { djangoAxiosInst } = createAxiosInstances()
                const response = await djangoAxiosInst.post('board/register', postData)
                return response.data
            } catch (error) {
                console.error('글 등록 중 오류 발생:', error)
                throw error
            }
        }
    }
})