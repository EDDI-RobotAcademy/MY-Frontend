<template>
    <div class="board-article-wrapper">
        <div v-if="boardContent" class="board-article">
            <div class="article-header">
                <h2 class="article-title">{{ boardContent.title }}</h2>
                <div class="article-meta">
                    <span class="author">{{ boardContent.profile_nickname }}</span>
                    <span class="date">{{ formatDate(boardContent.regDate) }}</span>
                    <span class="category">{{ boardContent.category_name }}</span>
                </div>
            </div>

            <div class="article-content">
                {{ boardContent.content }}
            </div>

            <div class="article-actions">
                <router-link :to="{ name: 'BoardListPage' }">
                    <button class="btn btn-back">목록으로</button>
                </router-link>
            </div>
        </div>

        <div v-if="checkMyBoard" class="author-actions">
            <router-link :to="{ name: 'BoardModifyPage', params: { boardId } }">
                <button class="btn btn-modify">수정</button>
            </router-link>
            <button class="btn btn-delete" @click="boardDelete">삭제</button>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBoardStore } from '../../stores/boardStore';

const route = useRoute();
const router = useRouter()
const boardStore = useBoardStore();

const boardId = parseInt(route.params.boardId as string);
const boardContent = ref<any>(null);
const error = ref<string>('');
const checkMyBoard = ref(false)

const fetchBoardContent = async () => {
    try {
        const response = await boardStore.readBoardContent(boardId);
        console.log("readBoardContent 데이터", response);
        boardContent.value = response;

    } catch (err) {
        error.value = '게시글을 불러오는데 실패했습니다.';
        console.error('Error fetching board content:', err);
    }
};

const fetchCheckAuthority = async () => {
    try {
        console.log("fetchCheckAuthority 접근")
        const response = await boardStore.checkAuthority(boardId);
        console.log("readBoardCofetchCheckAuthorityntent 데이터", response.is_authorized);
        checkMyBoard.value = response.is_authorized
        console.log("checkMyBoard 확인", checkMyBoard.value)
    } catch (err) {
        error.value = 'fetchCheckAuthority 에러';
        console.error('Error fetching board content:', err);
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const boardDelete = async () => {
    if (confirm('정말 삭제하시겠습니까?')) {
        try {
            await boardStore.deleteBoardContent(boardId);
            router.push("/board/list");
        } catch (err) {
            error.value = '게시글 삭제에 실패했습니다.';
            console.error('Error deleting board:', err);
        }
    }
};

onMounted(() => {
    fetchBoardContent();
    fetchCheckAuthority();
});
</script>

<style scoped>
.board-article {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
    padding: 20px;
}

.article-header {
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
    margin-bottom: 20px;
}

.article-title {
    font-size: 1.5em;
    color: #333;
    margin-bottom: 10px;
}

.article-meta {
    display: flex;
    gap: 15px;
    color: #666;
    font-size: 0.9em;
}

.article-content {
    min-height: 200px;
    line-height: 1.6;
    color: #333;
    white-space: pre-wrap;
}

.article-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.author-actions {
    display: flex;
    gap: 10px;
}

.btn {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    border: none;
    font-weight: 500;
}

.btn-back {
    background-color: #f0f0f0;
    color: #333;
}

.btn-modify {
    background-color: #4CAF50;
    color: white;
}

.btn-delete {
    background-color: #f44336;
    color: white;
}

.error-message {
    color: #f44336;
    text-align: center;
    padding: 20px;
}

.loading {
    text-align: center;
    padding: 20px;
    color: #666;
}
</style>