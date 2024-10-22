<template>
    <div class="board-content">
        <ul v-if="boardContents.length > 0" class="board-list">
            <li v-for="content in boardContents" :key="content.boardId" class="board-item"
                @click="goToBoardDetail(content.boardId)">
                <div class="board-header">
                    <h3>{{ content.title }}</h3>
                    <div class="board-meta">
                        <span>{{ content.profile_nickname }}</span>
                        <span>{{ formatDate(content.regDate) }}</span>
                        <span>{{ content.category_name }}</span>
                    </div>
                </div>
            </li>
        </ul>
        <p v-else>{{ errorMessage || '게시글이 없습니다.' }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useBoardStore } from '../../stores/boardStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps<{
    selectedCategoryId: number | null
}>();

const boardStore = useBoardStore();
const boardContents = ref([]);
const errorMessage = ref('');

const goToBoardDetail = (boardId: number) => {
    router.push(`/board/read/${boardId}`);
};

const fetchBoardContents = async (categoryId: number | null) => {
    try {
        let response;
        if (categoryId === null) {
            response = await boardStore.getBoardContent();
        } else {
            response = await boardStore.getCategoriesContent(categoryId);
        }

        if (Array.isArray(response)) {
            boardContents.value = response.slice(0, 20);
        } else if (response && Array.isArray(response.data)) {
            boardContents.value = response.data.slice(0, 20);
        } else {
            throw new Error('Unexpected response format');
        }

        errorMessage.value = '';
    } catch (error) {
        console.error('게시글을 가져오는 중 오류 발생:', error);
        boardContents.value = [];
        errorMessage.value = '게시글을 불러오는 데 실패했습니다. 다시 시도해 주세요.';
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

watch(() => props.selectedCategoryId, (newCategoryId) => {
    fetchBoardContents(newCategoryId);
}, { immediate: true });

onMounted(() => {
    if (props.selectedCategoryId === null) {
        fetchBoardContents(null);
    }
});
</script>

<style scoped>
.board-content {
    padding: 20px;
}

.board-list {
    list-style-type: none;
    padding: 0;
}

.board-item {
    border-bottom: 1px solid #eee;
    padding: 15px 0;
    cursor: pointer;
    transition: background-color 0.2s;
}

.board-item:hover {
    background-color: #f5f5f5;
}

.board-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.board-header h3 {
    margin: 0;
    color: #333;
    font-size: 1.1em;
}

.board-meta {
    display: flex;
    align-items: center;
    font-size: 0.9em;
    color: #666;
}

.board-meta span {
    margin-left: 15px;
}

.board-meta span:first-child {
    margin-left: 0;
}
</style>