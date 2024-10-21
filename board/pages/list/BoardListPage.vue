<template>
  <div class="board-container">
    <div class="sidebar">
      <h2 class="channel-title">채팅 영역</h2>
      <BoardChatForm></BoardChatForm>
    </div>
    <div class="main-content">
      <div class="top-bar">
        <BoardCategoryListPage v-model="selectedCategoryId" />
        <BoardSearchButton />
      </div>
      <div class="board-content">
        <!-- 게시글 목록 등 메인 컨텐츠 -->
      </div>
      <div class="bottom-bar">
        <BoardAddCategoryButton @categoryAdded="refreshCategories" />
        <BoardWriteButton :selectedCategoryId="selectedCategoryId" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BoardCategoryListPage from '../../ui/BoardListPage/BoardCategoryListPage.vue'
import BoardSearchButton from '../../ui/BoardListPage/BoardSearchButton.vue'
import BoardAddCategoryButton from '../../ui/BoardListPage/BoardAddCategoryButton.vue'
import BoardWriteButton from '../../ui/BoardListPage/BoardWriteButton.vue'
import BoardChatForm from '../../ui/BoardListPage/BoardChatForm.vue'

const selectedCategoryId = ref<number | null>(null)

const refreshCategories = () => {
  // 카테고리 새로고침 로직 구현
}
</script>

<style scoped>
.board-container {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
}

.sidebar {
  width: 300px; /* 고정 너비 설정 */
  min-width: 300px; /* 최소 너비 설정 */
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.channel-title {
  font-size: 20px;
  margin-bottom: 20px;
  color: #ecf0f1;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-bar, .bottom-bar {
  padding: 15px 20px;
  background-color: #34495e;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.board-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: white;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

button:hover {
  transform: translateY(-2px);
}
</style>