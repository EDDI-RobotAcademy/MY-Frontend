<template>
    <div class="read-page-container">
        <div class="content-container">
            <FreeCommunityReadContent />
            
            <div class="my-4 border-t border-gray-200"></div>
            
            <div class="comments-section">
                <FreeCommunityComment 
                :free_communityId="Number(route.params.free_communityId)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import FreeCommunityReadContent from '../../ui/FreeCommunityReadPage/FreeCommunityReadContent.vue';
import FreeCommunityComment from '@/freeCommunityComment/pages/FreeCommunityComment.vue';

const route = useRoute();

</script>

<style scoped>
.read-page-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: calc(100vh - 100px);
    padding: 20px 0;
    margin-top: 60px;
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
    background-color: #ffffff;
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
</style>