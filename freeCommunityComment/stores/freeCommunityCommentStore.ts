import axios from 'axios'
import { defineStore } from 'pinia'
import { createAxiosInstances } from '../../utility/axiosInstance'

interface CommentData {
    free_community_id: number,
    parent_id: number | null,
    content: string,
    userToken: string,
    writer_nickname: string
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
                console.log(response.data)
                return response.data
            } catch (error) {
                console.error('addFreeCommunityComment 중 에러 발생:', error)
                throw error
            }
        },
        async getFreeCommunityComments(freeCommunityId: number) {
            const { djangoAxiosInst } = createAxiosInstances()
            try {
                const response = await djangoAxiosInst.post('free_community_comment/list-comment',
                    { free_community_id: freeCommunityId})
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

    }
})
