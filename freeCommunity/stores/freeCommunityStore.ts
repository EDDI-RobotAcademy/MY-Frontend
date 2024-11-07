import axios from 'axios'
import { defineStore } from 'pinia'
import { createAxiosInstances } from '../../utility/axiosInstance'

export const useFreeCommunityStore = defineStore('freeCommunityStore', {
    actions: {
        async addCategory(name: string): Promise<string> {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const response = await djangoAxiosInst.post('free_community/create-category', { name })
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
                const response = await djangoAxiosInst.get('free_community/get-categories')
                return response.data
            } catch (error) {
                console.error('카테고리를 가져오는 중 오류 발생:', error)
                throw error
            }
        },
        async registerPost(postData: {
            title: string,
            content: string,
            category_id: number,
            is_notice: boolean
        }) {
            try {
                const { djangoAxiosInst } = createAxiosInstances()
                const response = await djangoAxiosInst.post('free_community/register', postData)
                return response.data
            } catch (error) {
                console.error('글 등록 중 오류 발생:', error)
                throw error
            }
        },
        async getNotices(){
            const {djangoAxiosInst} = createAxiosInstances()
            try{
                const response = await djangoAxiosInst.get('free_community/list-notices')
                return response.data
            } catch(error){
                console.error('공지글 목록 가져오는 중 오류 발생:', error)
                throw error
            }
        },
        async getFreeCommunityContent() {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const response = await djangoAxiosInst.get('free_community/get-allcontent')
                return response.data
            } catch (error) {
                console.error('글 목록 가져오는 중 오류 발생:', error)
                throw error
            }
        },
        async getCategoriesContent(categoryId: number) {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const response = await djangoAxiosInst.post('free_community/list-by-category', {
                    categoryId: categoryId
                })
                return response.data
            } catch (error) {
                console.error('카테고리별 글 목록 가져오는 중 오류 발생:', error)
                throw error
            }
        },
        async readFreeCommunityContent(free_communityId: number) {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const response = await djangoAxiosInst.get(`free_community/read/${free_communityId}`)
                return response.data
            } catch (error) {
                console.error('readFreeCommunityContent 중 에러:', error)
                throw error
            }
        },
        async deleteFreeCommunityContent(free_communityId: number) {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const response = await djangoAxiosInst.delete(`free_community/delete/${free_communityId}`)
                return response
            } catch (error) {
                console.error('deleteFreeCommunityContent 중 에러:', error)
                throw error
            }
        },
        async updateFreeCommunityContent(free_communityId: number, updateData: any) {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const response = await djangoAxiosInst.put(`free_community/modify/${free_communityId}`, updateData)
                return response.data
            } catch (error) {
                console.error('updateFreeCommunityContent 중 에러:', error)
                throw error
            }
        },
        async checkAuthority(free_communityId: number, userToken: string) {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const userToken = localStorage.getItem('userToken')
                
                const response = await djangoAxiosInst.post(`free_community/check-authority/${free_communityId}`, {
                    userToken: userToken
                })
                return response.data
            } catch (error) {
                console.error('checkAuthority 중 에러:', error)
                throw error
            }
        },
        async searchFreeCommunity(searchQuery: string, searchType: 'title' | 'content' | 'nickname') {
            const { djangoAxiosInst } = createAxiosInstances()
            let endpoint = ''

            if (searchType === 'title') {
                endpoint = 'free_community/list-by-title'
            } else if (searchType === 'content') {
                endpoint = 'free_community/list-by-content'
            } else if (searchType === 'nickname') {
                endpoint = 'free_community/list-by-nickname'
            }

            try {
                const response = await djangoAxiosInst.post(endpoint, {
                    query: searchQuery
                })
                return response.data
            } catch (error) {
                
                console.error(`${searchType} 검색 중 오류 발생:`, error)
                return []
            }
        },
    }
})