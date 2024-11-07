<template>
    <div class="container" @scroll.passive="handleScroll">
        <NavHeader />

        <main class="main-content">
            <ProfileSection :nickname="computedNickname" :following="followingCount" :followers="followersCount" />

            <NavigationTabs />

            <SearchBar :posts="posts" @filtered-posts="handleFilteredPosts" />

            <div class="content-layout">
                <PostList :posts="displayedPosts" :format-date="formatDate" />
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import NavHeader from '@/growthBlog/ui/navigation/navigation.vue';
import ProfileSection from '../myPage/UserPageUI/ProfileSection.vue';
import NavigationTabs from '../myPage/UserPageUI/NavigationTabs.vue';
import SearchBar from '../myPage/UserPageUI/SearchBar.vue';
import PostList from '../myPage/UserPageUI/PostList.vue';

import { useSmartContentStore } from '~/smartContent/stores/smartContentStore';
import { useAccountStore } from '@/account/stores/accountStore';
import { useAuthenticationStore } from '@/authentication/stores/authenticationStore';

const route = useRoute();
const smartContentStore = useSmartContentStore();
const accountStore = useAccountStore();
const authenticationStore = useAuthenticationStore();

const nickname = ref('Guest');
const searchQuery = ref('');
const itemsPerPage = 6;
const currentPage = ref(1);
const isLoading = ref(false);
const hasMore = ref(true);
const followingCount = ref(0);
const followersCount = ref(0);
const posts = ref([]); // 전체 포스트 데이터
const displayedPosts = ref([]); // 필터된 포스트 데이터
const { isAuthenticated } = storeToRefs(authenticationStore);

const computedNickname = computed(() => nickname.value || 'Guest');


const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getNickname = async () => {
    try {
        if (isAuthenticated.value) {
            const userProfile = await accountStore.requestGetUserProfileByUserTokenToDjango();
            if (userProfile && userProfile.nickname) {
                nickname.value = userProfile.nickname;
            }
        }
    } catch (error) {
        console.error('Failed to fetch nickname:', error);
        nickname.value = 'Guest';
    }
};

const handleFilteredPosts = (filteredPosts) => {
    displayedPosts.value = filteredPosts;
};

const fetchMySmartContents = async () => {
    if (isLoading.value || !hasMore.value) return;
    isLoading.value = true;
    const userToken = localStorage.getItem('userToken');
    try {
        const response = await smartContentStore.requestListMySmartContentToDjango(
            userToken,
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
        console.error('내 SmartContent 목록 조회 실패:', error);
    } finally {
        isLoading.value = false;
    }
};

const handleScroll = (event) => {
    const container = event.target;
    const scrollPosition = container.scrollTop + container.clientHeight;
    const threshold = container.scrollHeight - 100;

    if (scrollPosition > threshold && !isLoading.value && hasMore.value) {
        fetchMySmartContents();
    }
};

onMounted(async () => {
    await getNickname();
    await fetchMySmartContents();
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

@media (max-width: 768px) {
    .content-layout {
        flex-direction: column;
        gap: 40px;
    }
}
</style>