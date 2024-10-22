<template>
  <div class="board-container">
    <div class="chat">
      <h2 class="channel-title">채팅 영역</h2>
      <BoardChatForm></BoardChatForm>
    </div>
    <div class="main-content">
      <div class="top-bar">
        <BoardCategoryListPage v-model="selectedCategoryId" />
        <BoardSearchButton />
      </div>
      <div class="content-wrapper">
        <BoardContent :selectedCategoryId="selectedCategoryId" />
      </div>
      <div class="bottom-bar">
        <BoardAddCategoryButton v-if="isAdmin" @categoryAdded="refreshCategories" />
        <BoardWriteButton v-if="isAuthenticated" :selectedCategoryId="selectedCategoryId" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BoardCategoryListPage from '../../ui/BoardListPage/BoardCategoryListPage.vue'
import BoardSearchButton from '../../ui/BoardListPage/BoardSearchButton.vue'
import BoardAddCategoryButton from '../../ui/BoardListPage/BoardAddCategoryButton.vue'
import BoardWriteButton from '../../ui/BoardListPage/BoardWriteButton.vue'
import BoardChatForm from '../../ui/BoardListPage/BoardChatForm.vue'
import BoardContent from '../../ui/BoardListPage/BoardContent.vue'
import { useAuthenticationStore } from '@/authentication/stores/authenticationStore'

const authenticationStore = useAuthenticationStore();
const isAuthenticated = computed(() => authenticationStore.isAuthenticated);
const isAdmin = computed(() => authenticationStore.isAdmin);

const selectedCategoryId = ref<number | null>(null)
const checkAndSetAuthStatus = () => {
  authenticationStore.checkAndSetAuthStatus()
}

const refreshCategories = () => {
  // 카테고리 새로고침 로직 구현
}

onMounted(() => {
    checkAndSetAuthStatus()
})
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');
  
  * {
    font-family: 'Noto Sans KR', sans-serif;
  }
  
.board-container {
  display: flex;
  height: 100%;
  background-color: #f5f5f5;
}

.chat {
  width: 400px;
  min-width: 400px;
  background-color: #34495e;
  color: white;
  padding: 20px;
  padding-left: 30px;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
}

.channel-title {
  font-size: 20px;
  margin: 50px 0px 10px 10px;
  color: #ffffff;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #34495e;
  max-height: 100vh;
}

.top-bar {
  padding: 80px 35px 0px 15px;
  background-color: #34495e;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bottom-bar {
  padding: 0px 10px 20px 20px;
  background-color: #34495e;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-wrapper {
  width: 95%;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  margin: 20px;
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