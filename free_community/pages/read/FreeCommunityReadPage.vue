<template>
    <div class="read-page-container">
        <div class="content-container">
            <!-- 게시글 내용 -->
            <FreeCommunityReadContent />
            
            <!-- 구분선 -->
            <div class="my-8 border-t border-gray-200"></div>
            
            <!-- 댓글 섹션 -->
            <div class="comments-section">
                <FreeCommunityComment 
                :freeCommunityId="Number(route.params.free_communityId)"
                :nickname="userNickname"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import FreeCommunityReadContent from '../../ui/FreeCommunityReadPage/FreeCommunityReadContent.vue';
import FreeCommunityComment from '@/freeCommunityComment/pages/FreeCommunityComment.vue';
import { useAccountStore } from '~/account/stores/accountStore';

const route = useRoute();
const accountStore = useAccountStore()
const userNickname = ref('')

const fetchNickname = async () => {
    try {
        const nickname = await accountStore.getNickname('')
        userNickname.value = nickname
        console.log('현재 사용자 닉네임:', nickname)
    } catch (error) {
        console.error('닉네임 가져오기 실패:', error)
    }
}

onMounted(async () => {
    await fetchNickname()
})
</script>

<style scoped>
.read-page-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: calc(100vh - 100px);
    padding: 20px 0;
}

.content-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.comments-section {
    margin-top: 2rem;
}

/* 댓글 컴포넌트 스타일 통합 */
:deep(.comments-container) {
    padding: 0;
}

:deep(.comment-form) {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
}

:deep(.comment-item) {
    background-color: white;
    border-radius: 8px;
    margin-bottom: 10px;
    padding: 15px;
}

/* 모바일 반응형 스타일 */
@media (max-width: 640px) {
    .content-container {
        padding: 16px;
        margin: 0 16px;
    }
    
    :deep(.comment-form),
    :deep(.comment-item) {
        padding: 12px;
    }
}
</style>