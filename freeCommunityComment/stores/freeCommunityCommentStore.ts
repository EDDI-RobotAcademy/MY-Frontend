import axios from 'axios'
import { defineStore } from 'pinia'
import { createAxiosInstances } from '../../utility/axiosInstance'

interface CommentData {
    free_community_id: number,
    parent_id: number | null,
    content: string,
    userToken: string,
    nickname: string
}
interface CommentUpdateData {
    content: string;
}

export const useFreeCommunityCommentStore = defineStore('freeCommunityCommentStore', {
    state: () => ({
        comments: [] as any[],
        currentComment: null as any | null,
    }),
    getters: {
        getCommentById: (state) => (id: number) =>
            state.comments.find(comment => comment.id === id),
    },
    actions: {
        async addFreeCommunityComment(commentData: CommentData) {
            try {
                const { djangoAxiosInst } = createAxiosInstances()
                const response = await djangoAxiosInst.post('free_community_comment/create', commentData)
                
                return response.data
            } catch (error) {
                console.error('addFreeCommunityComment 중 에러 발생:', error)
                throw error
            }
        },
        async getFreeCommunityComments(free_communityId: number) {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const response = await djangoAxiosInst.post('free_community_comment/list-comment',
                    { free_community_id: free_communityId})
                return response.data
            } catch (error) {
                console.error('getFreeCommunityComments 중 에러 발생:', error)
                throw error
            }
        },
        async getFreeCommunityReplies(parentId: number) {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const response = await djangoAxiosInst.post('free_community_comment/list-replies',
                    { parent_id: parentId })
                return response.data
            } catch (error) {
                console.error('getFreeCommunityReplies 중 에러 발생:', error)
                throw error
            }
        },
        async readFreeCommunityComment(commentId: number) {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const response = await djangoAxiosInst.get(`free_community_comment/read/${commentId}`)
                return response.data
            } catch (error) {
                console.error('readFreeCommunityComment 중 에러:', error)
                throw error
            }
        },
        async deleteFreeCommunityComment(commentId: number) {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const response = await djangoAxiosInst.delete(`free_community_comment/delete/${commentId}`)
                return true
            } catch (error) {
                console.error('deleteFreeCommunityComment 중 에러:', error)
                throw error
            }
        },
        async updateFreeCommunityComment(commentId: number, updateData: CommentUpdateData) {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const response = await djangoAxiosInst.put(`free_community_comment/update/${commentId}`, updateData)
                return response.data
            } catch (error) {
                console.error('updateFreeCommunityComment 중 에러:', error)
                throw error
            }
        },
        async checkAuthority(commentId: number, userToken: string) {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const userToken = localStorage.getItem('userToken')
                
                const response = await djangoAxiosInst.post(`free_community_comment/check-authority/${commentId}`, {
                    userToken: userToken
                })
                return response.data
            } catch (error) {
                console.error('checkAuthority 중 에러:', error)
                throw error
            }
        }
    }
})
