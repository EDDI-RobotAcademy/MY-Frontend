<template>
  <div class="board-container">
    <div class="main-content">
      <div class="top-bar">
        <BoardCategoryListPage v-model="selectedCategoryId" />
        <BoardSearchButton />
      </div>
      <ChatFloatingButton :nickname="nickname"></ChatFloatingButton>
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
import BoardContent from '../../ui/BoardListPage/BoardContent.vue'
import ChatFloatingButton from '../../ui/BoardListPage/BoardChatFloatingButton.vue'
import { useAuthenticationStore } from '@/authentication/stores/authenticationStore'
import { useAccountStore } from '@/account/stores/accountStore'

const accountStore = useAccountStore();
const authenticationStore = useAuthenticationStore();
const isAuthenticated = computed(() => authenticationStore.isAuthenticated);
const isAdmin = computed(() => authenticationStore.isAdmin);

const nickname = ref('')
const selectedCategoryId = ref<number | null>(null)
const checkAndSetAuthStatus = () => {
  authenticationStore.checkAndSetAuthStatus()
}

const getNickname = async () => {
  nickname.value = await accountStore.getNickname()
}

const refreshCategories = () => {
  location.reload();
}

onMounted(() => {
  checkAndSetAuthStatus()
  getNickname()
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
  padding: 0% 10%;
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
  padding: 0px 45px 20px 20px;
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
</style>