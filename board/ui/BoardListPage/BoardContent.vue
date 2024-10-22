<template>
    <div class="board-content">
        <table v-if="boardContents.length > 0" class="board-table">
            <thead>
                <tr>
                    <th class="no-column">No</th>
                    <th class="title-column">제목</th>
                    <th class="author-column">글쓴이</th>
                    <th class="date-column">작성시간</th>
                    <th class="views-column">조회수</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(content, index) in boardContents" 
                    :key="content.boardId" 
                    @click="goToBoardDetail(content.boardId)"
                    class="board-row">
                    <td>{{ boardContents.length - index }}</td>
                    <td class="title-cell">{{ content.title }}</td>
                    <td>{{ content.profile_nickname }}</td>
                    <td>{{ formatDate(content.regDate) }}</td>
                    <td>0</td>
                </tr>
            </tbody>
        </table>
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
    return date.toISOString().split('T')[0];
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
    width: 100%;
}

.board-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}

.board-table th,
.board-table td {
    padding: 12px 8px;
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
}

.board-table th {
    background-color: white;
    font-weight: normal;
    color: #333;
    border-top: 1px solid #e0e0e0;
}

.no-column {
    width: 8%;
}

.title-column {
    width: 50%;
}

.title-cell {
    text-align: left;
    padding-left: 20px;
}

.author-column {
    width: 15%;
}

.date-column {
    width: 15%;
}

.views-column {
    width: 12%;
}

.board-row {
    cursor: pointer;
}

.board-row:hover {
    background-color: #f5f5f5;
}

td {
    color: #666;
    font-size: 0.9em;
}

.title-cell {
    color: #333;
    font-size: 1em;
}
</style>