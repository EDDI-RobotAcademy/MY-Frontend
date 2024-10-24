<template>
  <div class="comments-container">
      <div class="comments-count">
        댓글 {{ totalComments }}개
      </div>
      <!-- 댓글 작성 폼 -->
      <div class="comment-form">
          <textarea
              v-model="newComment"
              placeholder="댓글을 작성해주세요"
              class="comment-input"
              :rows="3"
          ></textarea>
          <button @click="submitComment" class="submit-btn">댓글 작성</button>
      </div>

      <!-- 댓글 목록 -->
      <div class="comments-list">
          <div v-for="comment in comments" :key="comment.commentId" class="comment-item">
              <div class="comment-main">
                  <div class="comment-header">
                      <span class="username">{{ comment.profile_nickname || '익명' }}</span>
                      <span class="date">{{ formatDate(comment.regDate) }}</span>
                  </div>
                  <div class="comment-content">
                      <template v-if="editingCommentId === comment.commentId">
                          <textarea
                              v-model="editingContent"
                              class="edit-input"
                              :rows="3"
                          ></textarea>
                          <div class="edit-buttons">
                              <button @click="updateComment(comment.commentId)" class="submit-btn">수정완료</button>
                              <button @click="cancelEdit" class="cancel-btn">취소</button>
                          </div>
                      </template>
                      <template v-else>
                          {{ comment.content }}
                      </template>
                  </div>
                  <div class="comment-footer">
                      <button @click="toggleReplies(comment.commentId)" class="action-btn">
                          답글 {{ comment.repliesCount || 0 }}개
                      </button>
                      <template v-if="isCommentOwner(comment)">
                          <button @click="startEdit(comment)" class="action-btn">수정</button>
                          <button @click="deleteComment(comment.commentId)" class="action-btn delete">삭제</button>
                      </template>
                  </div>
              </div>

              <!-- 답글 섹션 -->
              <div v-if="showRepliesFor === comment.commentId">
                  <!-- 답글 작성 폼 -->
                  <div class="reply-form">
                      <textarea
                          v-model="newReply"
                          placeholder="답글을 작성해주세요"
                          class="reply-input"
                          :rows="2"
                      ></textarea>
                      <div class="reply-buttons">
                          <button @click="submitReply(comment.commentId)" class="submit-btn">답글 작성</button>
                          <button @click="cancelReply" class="cancel-btn">취소</button>
                      </div>
                  </div>

                  <!-- 답글 목록 -->
                  <div class="replies-list">
                      <div v-for="reply in replies" :key="reply.commentId" class="reply-item">
                          <div class="reply-content">
                              <div class="comment-header">
                                  <span class="username">{{ reply.profile_nickname || '익명' }}</span>
                                  <span class="date">{{ formatDate(reply.regDate) }}</span>
                              </div>
                              <template v-if="editingCommentId === reply.commentId">
                                <textarea
                                    v-model="editingContent"
                                    class="edit-input"
                                    :rows="3"
                                ></textarea>
                                <div class="edit-buttons">
                                    <button @click="updateComment(reply.commentId)" class="submit-btn">수정완료</button>
                                    <button @click="cancelEdit" class="cancel-btn">취소</button>
                                </div>
                              </template>
                              <template v-else>
                                  {{ reply.content }}
                              </template>
                          </div>
                          <div class="reply-footer" v-if="isCommentOwner(reply)">
                              <button @click="startEdit(reply)" class="action-btn">수정</button>
                              <button @click="deleteComment(reply.commentId)" class="action-btn delete">삭제</button>
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

const props = defineProps<{
  freeCommunityId: number,
  nickname: string
}>()

const freeCommunityCommentStore = useFreeCommunityCommentStore()
const comments = ref<any[]>([])
const totalComments = ref(0)
const replies = ref<any[]>([])
const showRepliesFor = ref<number | null>(null)
const newComment = ref('')
const newReply = ref('')
const editingCommentId = ref<number | null>(null)
const editingContent = ref('')

// 댓글 목록 로드
const loadComments = async () => {
  try {
    const commentsData = await freeCommunityCommentStore.getFreeCommunityComments(props.freeCommunityId)
    // 부모 댓글만 필터링
    const parentData = commentsData.filter((comment: any) => !comment.parent)
    
    totalComments.value = commentsData.length

    // 각 댓글의 답글 개수를 업데이트
    for (const comment of parentData) {
      const repliesData = await freeCommunityCommentStore.getFreeCommunityReplies(comment.commentId)
      comment.repliesCount = repliesData.length
    }
    
    comments.value = parentData
  } catch (error) {
    console.error('댓글 로딩 중 에러:', error)
  }
}

// 답글 토글 및 로드
const toggleReplies = async (commentId: number) => {
  try {
    if (showRepliesFor.value === commentId) {
      showRepliesFor.value = null
      replies.value = []
    } else {
      showRepliesFor.value = commentId
      const repliesData = await freeCommunityCommentStore.getFreeCommunityReplies(commentId)
      const parentComment = comments.value.find(c => c.commentId === commentId)
      if (parentComment) {
        parentComment.replies = replies
      }
      
      replies.value = repliesData
    }
  } catch (error) {
    console.error('답글 로딩 중 에러:', error)
  }
}

const getRepliesCount = async (parentId: number) => {
  try {
    const repliesData = await freeCommunityCommentStore.getFreeCommunityReplies(parentId)
    return repliesData.length
  } catch (error) {
    console.error('답글 개수 조회 중 에러:', error)
    return 0
  }
}

// 댓글 작성
const submitComment = async () => {
  if (!newComment.value.trim()) return

  const userToken = localStorage.getItem("userToken")
  if (!userToken) {
    alert('로그인이 필요한 서비스입니다.')
    return
  }

  try {
    const commentData = {
      free_community_id: props.freeCommunityId,
      parent_id: null,
      content: newComment.value.trim(),
      userToken
    }

    await freeCommunityCommentStore.addFreeCommunityComment(commentData)
    newComment.value = ''
    await loadComments()
  } catch (error) {
    console.error('댓글 작성 중 에러:', error)
  }
}

// 답글 작성
const submitReply = async (parentId: number) => {
  if (!newReply.value.trim()) return

  const userToken = localStorage.getItem("userToken")
  if (!userToken) {
    alert('로그인이 필요한 서비스입니다.')
    return
  }

  try {
    const replyData = {
      free_community_id: props.freeCommunityId,
      parent_id: parentId,
      content: newReply.value.trim(),
      userToken
    }

    await freeCommunityCommentStore.addFreeCommunityComment(replyData)
    newReply.value = ''

    // 답글 목록 새로고침
    const repliesData = await freeCommunityCommentStore.getFreeCommunityReplies(parentId)
    replies.value = repliesData
    
    // 부모 댓글의 답글 개수 업데이트
    const parentComment = comments.value.find(c => c.commentId === parentId)
    if (parentComment) {
      parentComment.repliesCount = repliesData.length
    }
    
    showRepliesFor.value = parentId

    await toggleReplies(parentId) // 답글 목록 새로고침
  } catch (error) {
    console.error('답글 작성 중 에러:', error)
  }
}


const cancelReply = () => {
  replyingTo.value = null
  newReply.value = ''
}

const startEdit = (comment: any) => {
  editingCommentId.value = comment.commentId
  editingContent.value = comment.content
}

const cancelEdit = () => {
  editingCommentId.value = null
  editingContent.value = ''
}

const updateComment = async (commentId: number) => {
  if (!editingContent.value.trim()) return

  try {
    await freeCommunityCommentStore.updateFreeCommunityComment(commentId, {
      content: editingContent.value.trim()
    })
    editingCommentId.value = null
    editingContent.value = ''

    // 수정된 항목이 답글인 경우
    if (showRepliesFor.value) {
      // 현재 열려있는 답글 목록 새로고침
      const repliesData = await freeCommunityCommentStore.getFreeCommunityReplies(showRepliesFor.value)
      replies.value = repliesData
    }
    await loadComments()
  } catch (error) {
    console.error('댓글 수정 중 에러:', error)
  }
}

const deleteComment = async (commentId: number) => {
  if (!confirm('정말 삭제하시겠습니까?')) return

  try {
    await freeCommunityCommentStore.deleteFreeCommunityComment(commentId)

    // 삭제된 댓글이 답글인 경우
    if (showRepliesFor.value) {
      // 현재 열려있는 답글 목록 새로고침
      const replies = await freeCommunityCommentStore.getFreeCommunityReplies(showRepliesFor.value)
      const parentComment = comments.value.find(c => c.commentId === showRepliesFor.value)

      if (parentComment) {
        parentComment.replies = replies
      }
    } else {
      await loadComments()
    }
  } catch (error) {
    console.error('댓글 삭제 중 에러:', error)
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

const isCommentOwner = (comment: any) => {
  // 실제 구현에서는 현재 로그인한 사용자와 댓글 작성자를 비교
  return true
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

.comment-form {
  margin-bottom: 20px;
}

.comment-input, .reply-input, .edit-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 10px;
}

.submit-btn, .action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn {
  background-color: #ff9033;
  color: white;
}

.action-btn {
  background-color: #f8f9fa;
  color: #212529;
  margin-right: 8px;
}

.action-btn.delete {
  color: #dc3545;
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

.replies-list {
  margin-left: 40px;
  margin-top: 10px;
  border-left: 2px solid #ddd;
  padding-left: 15px;
}

.reply-form {
  margin: 10px 0 10px 40px;
}

.reply-item {
  padding: 10px 0;
  padding-left: 15px;
  margin-bottom: 10px;
}

.edit-buttons, .reply-buttons {
  display: flex;
  gap: 10px;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>