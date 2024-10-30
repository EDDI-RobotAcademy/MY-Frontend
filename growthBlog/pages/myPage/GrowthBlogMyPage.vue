<template>
    <div class="container" @scroll.passive="handleScroll">
        <NavHeader />

        <main class="main-content">
            <ProfileSection 
                :nickname="computedNickname"
                :following="followingCount"
                :followers="followersCount"
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
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import NavHeader from '@/growthBlog/ui/navigation/navigation.vue';
import ProfileSection from '../myPage/UserPageUI/ProfileSection.vue';
import NavigationTabs from '../myPage/UserPageUI/NavigationTabs.vue';
import SearchBar from '../myPage/UserPageUI/SearchBar.vue';
import TagsSection from '../myPage/UserPageUI/TagSection.vue';
import PostList from '../myPage/UserPageUI/PostList.vue';

import { useSmartContentStore } from '~/smartContent/stores/smartContentStore';
import { useAccountStore } from '@/account/stores/accountStore';
import { useAuthenticationStore } from '@/authentication/stores/authenticationStore';

const route = useRoute();
const smartContentStore = useSmartContentStore();
const accountStore = useAccountStore();
const authenticationStore = useAuthenticationStore();

const posts = ref([]);
const nickname = ref('Guest');
const searchQuery = ref('');
const itemsPerPage = 6;
const currentPage = ref(1);
const isLoading = ref(false);
const followingCount = ref(0);
const followersCount = ref(0);

const { isAuthenticated } = storeToRefs(authenticationStore);

const computedNickname = computed(() => nickname.value || 'Guest');

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

const getNickname = async () => {
    try {
        if (isAuthenticated.value) {
            const userProfile = await accountStore.requestGetUserProfileByAccountIdToDjango();
            if (userProfile && userProfile.nickname) {
                nickname.value = userProfile.nickname;
            }
        }
    } catch (error) {
        console.error('Failed to fetch nickname:', error);
        nickname.value = 'Guest';
    }
};

const fetchMySmartContents = async () => {
    if (isLoading.value) return;
    isLoading.value = true;
    const userToken = localStorage.getItem('userToken');
    try {
        console.log('Requesting page:', currentPage.value, 'with page size:', itemsPerPage);
        const response = await smartContentStore.requestListMySmartContentToDjango(userToken, currentPage.value, itemsPerPage);
        if (response.length === 0) {
            return;
        }

        posts.value.push(...response);
        currentPage.value++;
    } catch (error) {
        console.error('내 SmartContent 목록 조회 실패:', error);
    } finally {
        isLoading.value = false;
    }
};

const handleScroll = (event) => {
    const bottomReached = event.target.scrollHeight - event.target.scrollTop <= event.target.clientHeight + 100;
    if (bottomReached && !isLoading.value) {
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