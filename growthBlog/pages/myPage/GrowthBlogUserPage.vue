<!-- UserBlogPage.vue -->
<template>
    <div class="container">
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
        
        <SearchBar v-model="searchQuery" />
  
        <div class="content-layout">
          <TagsSection :tags="snsTagsList" />
          <PostList 
            :posts="posts"
            :format-date="formatDate"
          />
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import NavHeader from '@/growthBlog/ui/navigation/navigation.vue';
  import ProfileSection from '../myPage/UserPageUI/ProfileSection.vue';
  import NavigationTabs from '../myPage/UserPageUI/NavigationTabs.vue';
  import SearchBar from '../myPage/UserPageUI/SearchBar.vue';
  import TagsSection from '../myPage/UserPageUI/TagSection.vue';
  import PostList from '../myPage/UserPageUI/PostList.vue';
  import { useSmartContentStore } from '~/smartContent/stores/smartContentStore';
  import { useGrowthBlogStore } from '~/growthBlog/stores/growthBlogStore';
  
  const route = useRoute();
  const smartContentStore = useSmartContentStore();
  const growthBlogStore = useGrowthBlogStore();
  const posts = ref([]);
  const searchQuery = ref('');
  const userNickname = computed(() => route.params.nickname);
  
  const profileStats = ref({
    following: 0,
    followers: 0
  });
  
  const snsTagsList = [
    { id: 1, name: '유튜브', href: '#', count: 13 },
    { id: 2, name: '트위터', href: '#', count: 6 },
    { id: 3, name: '쓰레드', href: '#', count: 2 },
    { id: 4, name: '인스타', href: '#', count: 2 }
  ];
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const fetchUserSmartContents = async () => {
    try {
      const response = await smartContentStore.requestListUserSmartContentToDjango(userNickname.value);
      posts.value = response;
    } catch (error) {
      console.error('사용자 SmartContent 목록 조회 실패:', error);
    }
  };
  
  const handleFollow = async () => {
    try {
      const response = await growthBlogStore.registerSocial(userNickname.value);
      console.log('팔로우 성공:', response);
      profileStats.value.followers += 1;
    } catch (error) {
      console.error('팔로우 실패:', error);
    }
  };
  
  const handleUnfollow = async () => {
    try {
      const response = await growthBlogStore.unregisterSocial(userNickname.value);
      console.log('언팔로우 성공:', response);
      profileStats.value.followers = Math.max(0, profileStats.value.followers - 1);
    } catch (error) {
      console.error('언팔로우 실패:', error);
    }
  };
  
  onMounted(() => {
    fetchUserSmartContents();
  });
  </script>
  
  <style scoped>
  .container {
    margin-top: 70px;
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
  
  @media (max-width: 768px) {
    .content-layout {
      flex-direction: column;
      gap: 40px;
    }
  }
  </style>