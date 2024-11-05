<template>
  <div class="container" @scroll.passive="handleScroll">
    <NavHeader />

    <main class="main-content">
      <ProfileSection 
        :nickname="userNickname" 
        :following="profileStats.following" 
        :followers="profileStats.followers"
        @follow="handleFollow" 
        @unfollow="handleUnfollow" 
      />

      <NavigationTabs />

      <SearchBar 
        :posts="posts"
        @filtered-posts="handleFilteredPosts"
        placeholder="게시물 검색하기"
      />

      <div class="content-layout">
        <PostList :posts="displayedPosts" :format-date="formatDate" />
      </div>

      <div v-if="isLoading" class="loading">Loading...</div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavHeader from '@/growthBlog/ui/navigation/navigation.vue';
import ProfileSection from '../myPage/UserPageUI/ProfileSection.vue';
import NavigationTabs from '../myPage/UserPageUI/NavigationTabs.vue';
import SearchBar from '../myPage/UserPageUI/SearchBar.vue';
import PostList from '../myPage/UserPageUI/PostList.vue';
import { useSmartContentStore } from '~/smartContent/stores/smartContentStore';
import { useGrowthBlogStore } from '~/growthBlog/stores/growthBlogStore';

const route = useRoute();
const router = useRouter();
const smartContentStore = useSmartContentStore();
const growthBlogStore = useGrowthBlogStore();

const posts = ref([]); // 전체 포스트 데이터
const displayedPosts = ref([]); // 필터된 포스트 데이터를 위한 새로운 ref
const userNickname = computed(() => route.params.nickname);

const currentPage = ref(1);
const itemsPerPage = 6;
const isLoading = ref(false);
const hasMore = ref(true);

const profileStats = ref({
  following: 0,
  followers: 0
});

// 검색 결과를 처리하는 함수
const handleFilteredPosts = (filteredPosts) => {
  displayedPosts.value = filteredPosts;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const fetchUserSmartContents = async () => {
  if (isLoading.value || !hasMore.value) return;

  isLoading.value = true;
  try {
    const response = await smartContentStore.requestListUserSmartContentToDjango(
      userNickname.value,
      currentPage.value,
      itemsPerPage
    );

    if (response.length < itemsPerPage) {
      hasMore.value = false;
    }

    if (currentPage.value === 1) {
      posts.value = response;
      displayedPosts.value = response; // 초기 표시 데이터도 설정
    } else {
      posts.value = [...posts.value, ...response];
      displayedPosts.value = [...displayedPosts.value, ...response];
    }

    currentPage.value++;
  } catch (error) {
    console.error('사용자 SmartContent 목록 조회 실패:', error);
    alert("없는 사용자 입니다.");
    router.back();
  } finally {
    isLoading.value = false;
  }
};

const handleScroll = (event) => {
  const container = event.target;
  const scrollPosition = container.scrollTop + container.clientHeight;
  const threshold = container.scrollHeight - 100;

  if (scrollPosition > threshold && !isLoading.value && hasMore.value) {
    fetchUserSmartContents();
  }
};

const handleFollow = async () => {
  try {
    await growthBlogStore.registerSocial(userNickname.value);
    profileStats.value.followers += 1;
  } catch (error) {
    console.error('팔로우 실패:', error);
  }
};

const handleUnfollow = async () => {
  try {
    await growthBlogStore.unregisterSocial(userNickname.value);
    profileStats.value.followers -= 1;
  } catch (error) {
    console.error('언팔로우 실패:', error);
  }
};

onMounted(() => {
  currentPage.value = 1;
  hasMore.value = true;
  posts.value = [];
  displayedPosts.value = [];
  fetchUserSmartContents();
});
</script>

<style scoped>
.container {
  margin-top: 70px;
  height: 100vh;
  overflow-y: auto;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.content-layout {
  display: flex;
  gap: 60px;
  margin-top: 40px;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

@media (max-width: 768px) {
  .content-layout {
    flex-direction: column;
    gap: 40px;
  }
}
</style>