<template>
    <div class="comments-container">
        <div class="comments-count">
            댓글 {{ totalComments }}개
        </div>

        <CommentForm placeholder="댓글을 작성해주세요" submit-button-text="댓글 작성" @submit="submitComment" />

        <div class="comments-list">
            <div v-for="comment in comments" :key="comment.commentId" class="comment-item">
                <div class="comment-main">
                    <div class="comment-header">
                        <span class="username">
                            <router-link :to="{ path: `/growth-blog/my-page/${comment.nickname}` }"
                                class="username-link">
                                {{ comment.nickname || '익명' }}
                            </router-link>
                        </span>
                        <span class="date">{{ formatDate(comment.regDate) }}</span>
                    </div>

                    <div class="comment-content">
                        <template v-if="editingCommentId === comment.commentId">
                            <CommentForm v-model="comment.content" submit-button-text="수정완료"
                                @submit="(content) => updateComment(comment.commentId, content)" @cancel="cancelEdit" />
                        </template>
                        <template v-else>
                            {{ comment.content }}
                        </template>
                    </div>

                    <div class="comment-footer">
                        <ReplyToggle :replies-count="comment.repliesCount || 0"
                            @toggle="() => toggleReplies(comment.commentId)" />
                        <CommentActions :is-owner="comment.isOwner" v-if="comment.isOwner" @edit="startEdit(comment)"
                            @delete="deleteComment(comment.commentId)" />
                    </div>
                </div>

                <div v-if="showRepliesFor === comment.commentId" class="replies-section">
                    <ReplyForm @submit="(content) => submitReply(comment.commentId, content)" @cancel="cancelReply" />

                    <div class="replies-list">
                        <div v-for="reply in comment.replies" :key="reply.commentId" class="reply-item">
                            <div class="comment-header">
                                <span class="username">
                                    <router-link :to="{ path: `/growth-blog/my-page/${reply.nickname}` }"
                                        class="username-link">
                                        {{ reply.nickname || '익명' }}
                                    </router-link>
                                </span>
                                <span class="date">{{ formatDate(reply.regDate) }}</span>
                            </div>
                            <div class="reply-content">
                                <template v-if="editingCommentId === reply.commentId">
                                    <CommentForm v-model="reply.content" submit-button-text="수정완료"
                                        @submit="(content) => updateComment(reply.commentId, content)"
                                        @cancel="cancelEdit" />
                                </template>
                                <template v-else>
                                    {{ reply.content }}
                                </template>
                            </div>
                            <div class="reply-footer">
                                <CommentActions :is-owner="reply.isOwner" v-if="reply.isOwner" @edit="startEdit(reply)"
                                    @delete="deleteComment(reply.commentId)" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFreeCommunityCommentStore } from '@/freeCommunityComment/stores/freeCommunityCommentStore'
import { useAccountStore } from '@/account/stores/accountStore'
import CommentForm from '../ui/CommentForm.vue'
import CommentActions from '../ui/CommentActions.vue'
import ReplyForm from '../ui/ReplyForm.vue'
import ReplyToggle from '../ui/ReplyToggle.vue'

const props = defineProps<{
    free_communityId: number,
}>()

const freeCommunityCommentStore = useFreeCommunityCommentStore()
const accountStore = useAccountStore()

const comments = ref<any[]>([])
const totalComments = ref(0)
const replies = ref<any[]>([])
const showRepliesFor = ref<number | null>(null)
const editingCommentId = ref<number | null>(null)

// 댓글 목록 로드
const loadComments = async () => {
    try {
        const commentsData = await freeCommunityCommentStore.getFreeCommunityComments(props.free_communityId)
        const parentData = commentsData.filter((comment: any) => !comment.parent)
        totalComments.value = commentsData.length

        for (const comment of parentData) {
            const repliesData = await freeCommunityCommentStore.getFreeCommunityReplies(comment.commentId)
            comment.repliesCount = repliesData.length
            comment.replies = repliesData

            // 권한 체크
            const isOwner = await isCommentOwner(comment)
            comment.isOwner = isOwner

            // 답글에 대한 권한 체크
            for (const reply of repliesData) {
                reply.isOwner = await isCommentOwner(reply)
            }

            comment.replies = repliesData
        }
        comments.value = parentData
    } catch (error) {
        console.error('댓글 로딩 중 에러:', error)
    }
}

const submitComment = async (content: string) => {
    const userToken = localStorage.getItem("userToken")
    if (!userToken) {
        alert('로그인이 필요한 서비스입니다.')
        return
    }

    try {
        const commentData = {
            free_community_id: props.free_communityId,
            parent_id: null,
            content,
            userToken,
        }

        await freeCommunityCommentStore.addFreeCommunityComment(commentData)
        await loadComments()
    } catch (error) {
        console.error('댓글 작성 중 에러:', error)
    }
}

const toggleReplies = async (commentId: number) => {
    try {
        if (showRepliesFor.value === commentId) {
            showRepliesFor.value = null
            replies.value = []
        } else {
            showRepliesFor.value = commentId
            const repliesData = await freeCommunityCommentStore.getFreeCommunityReplies(commentId)
            replies.value = repliesData
        }
    } catch (error) {
        console.error('답글 로딩 중 에러:', error)
    }
}

const submitReply = async (parentId: number, content: string) => {
    const userToken = localStorage.getItem("userToken")
    if (!userToken) {
        alert('로그인이 필요한 서비스입니다.')
        return
    }

    try {
        const replyData = {
            free_community_id: props.free_communityId,
            parent_id: parentId,
            content,
            userToken,
        }

        await freeCommunityCommentStore.addFreeCommunityComment(replyData)
        const repliesData = await freeCommunityCommentStore.getFreeCommunityReplies(parentId)
        replies.value = repliesData

        const parentComment = comments.value.find(c => c.commentId === parentId)
        if (parentComment) {
            parentComment.repliesCount = repliesData.length
        }
        await loadComments()
    } catch (error) {
        console.error('답글 작성 중 에러:', error)
    }
}

const cancelReply = () => {
    showRepliesFor.value = null
}

const startEdit = (comment: any) => {
    editingCommentId.value = comment.commentId
}

const cancelEdit = () => {
    editingCommentId.value = null
}

const updateComment = async (commentId: number, content: string) => {
    const userToken = localStorage.getItem('userToken')
    if (!userToken) {
        alert('로그인이 필요한 서비스입니다.')
        return
    }

    try {
        await freeCommunityCommentStore.updateFreeCommunityComment(commentId, {
            content
        })
        editingCommentId.value = null

        if (showRepliesFor.value) {
            const repliesData = await freeCommunityCommentStore.getFreeCommunityReplies(showRepliesFor.value)
            replies.value = repliesData
        }
        await loadComments()
    } catch (error) {
        console.error('댓글 수정 중 에러:', error)
    }
}

const deleteComment = async (commentId: number) => {
    const userToken = localStorage.getItem('userToken')
    if (!userToken) {
        alert('로그인이 필요한 서비스입니다.')
        return
    }
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
        await freeCommunityCommentStore.deleteFreeCommunityComment(commentId)

        if (showRepliesFor.value) {
            const repliesData = await freeCommunityCommentStore.getFreeCommunityReplies(showRepliesFor.value)
            replies.value = repliesData

            const parentComment = comments.value.find(c => c.commentId === showRepliesFor.value)
            if (parentComment) {
                parentComment.repliesCount = repliesData.length
            }
        }
        await loadComments()
    } catch (error) {
        console.error('댓글 삭제 중 에러:', error)
    }
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleString()
}

const isCommentOwner = async (comment: any) => {
    const userToken = localStorage.getItem('userToken')
    if (!userToken) return false

    try {
        const authorityResponse = await freeCommunityCommentStore.checkAuthority(comment.commentId, userToken)
        return authorityResponse.is_authorized
    } catch (error) {
        console.error('권한 확인 중 에러:', error)
        return false
    }
}


onMounted(async () => {
    await loadComments()
})
</script>

<style scoped>
.comments-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.comments-count {
    font-size: 1.1em;
    font-weight: bold;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.comments-list {
    margin-top: 20px;
}

.comment-item {
    border-bottom: 1px solid #eee;
    padding: 15px 0;
}

.comment-header {
    margin-bottom: 8px;
}

.username {
    font-weight: bold;
    margin-right: 10px;
}

.date {
    color: #666;
    font-size: 0.9em;
}

.comment-content {
    margin-bottom: 10px;
    line-height: 1.5;
}

.comment-footer {
    display: flex;
    align-items: center;
    margin-top: 10px;
}

.replies-section {
    /* margin-left: 10px; */
    margin-top: 20px;
}

.replies-list {
    margin-left: 50px;
    border-left: 2px solid #eee;
}

.reply-item {
    margin: 20px;
}

.username-link {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
}

.username-link:hover {
    text-decoration: underline;
}
</style>
