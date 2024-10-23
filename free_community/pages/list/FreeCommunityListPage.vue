<template>
  <div class="free_community-container">
    <div class="main-content">
      <div class="top-bar">
        <FreeCommunityCategoryListPage v-model="selectedCategoryId" />
        <FreeCommunitySearchButton />
      </div>
      <ChatFloatingButton :nickname="nickname"></ChatFloatingButton>
      <div class="content-wrapper">
        <FreeCommunityContent :selectedCategoryId="selectedCategoryId" />
      </div>
      <div class="bottom-bar">
        <FreeCommunityAddCategoryButton v-if="isAdmin" @categoryAdded="refreshCategories" />
        <FreeCommunityWriteButton v-if="isAuthenticated" :selectedCategoryId="selectedCategoryId" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FreeCommunityCategoryListPage from '../../ui/FreeCommunityListPage/FreeCommunityCategoryListPage.vue'
import FreeCommunitySearchButton from '../../ui/FreeCommunityListPage/FreeCommunitySearchButton.vue'
import FreeCommunityAddCategoryButton from '../../ui/FreeCommunityListPage/FreeCommunityAddCategoryButton.vue'
import FreeCommunityWriteButton from '../../ui/FreeCommunityListPage/FreeCommunityWriteButton.vue'
import FreeCommunityContent from '../../ui/FreeCommunityListPage/FreeCommunityContent.vue'
import ChatFloatingButton from '../../ui/FreeCommunityListPage/FreeCommunityChatFloatingButton.vue'
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

.free_community-container {
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