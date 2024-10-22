<template>
    <div class="board-article">
        <div v-if="boardContent" class="modify-form">
            <div class="form-group">
                <label for="category">카테고리</label>
                <select id="category" v-model="modifiedContent.category_id" class="form-select">
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </option>
                </select>
            </div>
            <div class="form-body">
                <div class="form-group">
                    <label for="title">제목</label>
                    <input id="title" v-model="modifiedContent.title" type="text" class="form-input"
                        placeholder="제목을 입력하세요" />
                </div>

                <div class="form-group">
                    <label for="content">내용</label>
                    <textarea id="content" v-model="modifiedContent.content" class="form-textarea"
                        placeholder="내용을 입력하세요" rows="10"></textarea>
                </div>

            </div>

            <div class="form-actions">
                <button @click="handleSubmit" class="btn btn-submit">수정하기</button>
                <button @click="handleCancel" class="btn btn-cancel">취소</button>
            </div>
        </div>

        <div v-else-if="error" class="error-message">
            {{ error }}
        </div>

        <div v-else class="loading">
            로딩 중...
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBoardStore } from '../../stores/boardStore';

const route = useRoute();
const router = useRouter();
const boardStore = useBoardStore();

const boardId = parseInt(route.params.boardId as string);
const boardContent = ref<any>(null);
const error = ref<string>('');
const categories = ref([]);

const modifiedContent = ref({
    title: '',
    content: '',
    category_id: null
});

const fetchBoardContent = async () => {
    try {
        const response = await boardStore.readBoardContent(boardId);
        boardContent.value = response;
        // 기존 내용을 수정 폼에 설정
        modifiedContent.value = {
            title: response.title,
            content: response.content,
            category_id: response.category_id
        };
    } catch (err) {
        error.value = '게시글을 불러오는데 실패했습니다.';
        console.error('Error fetching board content:', err);
    }
};

const fetchCategories = async () => {
    try {
        const response = await boardStore.getCategories();
        categories.value = response;
    } catch (err) {
        console.error('Error fetching categories:', err);
    }
};

const handleSubmit = async () => {
    try {
        if (!modifiedContent.value.title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        if (!modifiedContent.value.content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        await boardStore.updateBoardContent(boardId, modifiedContent.value);
        router.push(`/board/read/${boardId}`);
    } catch (err) {
        error.value = '게시글 수정에 실패했습니다.';
        console.error('Error updating board:', err);
    }
};

const handleCancel = () => {
    router.push(`/board/read/${boardId}`);
};

onMounted(() => {
    fetchBoardContent();
    fetchCategories();
});
</script>

<style scoped>
.board-article {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

.form-header {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
}

.form-header h2 {
    color: #333;
    margin: 0;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-weight: 500;
}

.form-input,
.form-textarea,
.form-select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.form-textarea {
    resize: vertical;
    min-height: 200px;
}

.form-select {
    height: 40px;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.btn {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    border: none;
    font-weight: 500;
    font-size: 14px;
}

.btn-submit {
    background-color: #4CAF50;
    color: white;
}

.btn-cancel {
    background-color: #f0f0f0;
    color: #333;
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