import axios from 'axios'
import { defineStore } from 'pinia'
import { createAxiosInstances } from '../../utility/axiosInstance'

export const useLikeCountStore = defineStore('likeCountStore', {
    actions: {
        async requestToggleLikeToDjango(contentId: number) {
            const { djangoAxiosInst } = createAxiosInstances()
            const userToken = localStorage.getItem('userToken')
            try {
                // URL 패턴 수정
                const response = await djangoAxiosInst.post(`/like_count/toggle-like`, {
                    userToken: userToken,
                    content_id: contentId
                })
                
                // 백엔드 응답 구조에 맞게 처리
                if (response.data.hasOwnProperty('liked')) {
                    return {
                        success: true,
                        liked: response.data.liked
                    }
                }
                return {
                    success: false,
                    error: response.data.error || '알 수 없는 오류가 발생했습니다.'
                }
            } catch (error: any) {
                console.error('좋아요 토글 중 에러:', error)
                return {
                    success: false,
                    error: error.response?.data?.error || '서버와의 통신 중 오류가 발생했습니다.'
                }
            }
        },
    }
})