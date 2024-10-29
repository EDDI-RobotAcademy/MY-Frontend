<template>
    <div class="container">
        <NavHeader />

        <main class="main-content">
            <div class="profile-section">
                <img src="/assets/fixed/login/google_login_round.png" alt="Profile" class="profile-image">
                <h1 class="profile-name">{{ computedNickname }}</h1>
                <div class="profile-stats">
                    <span>1 팔로잉</span>
                    <span>0 팔로워</span>
                </div>
            </div>

            <nav class="navigation-tabs">
                <a href="#" class="tab active">글</a>
                <a href="#" class="tab">시리즈</a>
                <a href="#" class="tab">소개</a>
            </nav>

            <div class="search-bar">
                <input type="text" placeholder="검색어를 입력하세요">
            </div>

            <div class="content-layout">
                <div class="tags-section">
                    <h2>SNS 목록</h2>
                    <div class="tag-list">
                        <a href="#" class="tag">유튜브 <span>(13)</span></a>
                        <a href="#" class="tag">트위터 <span>(6)</span></a>
                        <a href="#" class="tag">쓰레드 <span>(2)</span></a>
                        <a href="#" class="tag">인스타 <span>(2)</span></a>
                    </div>
                </div>

                <div class="posts-section">
                    <article v-for="post in posts" :key="post.id" class="post-item">
                        <h2 class="post-title">{{ post.title }}</h2>
                        <div class="post-meta">
                            <div class="post-info">
                                <span>{{ formatDate(post.regDate) }}</span>
                                <span class="separator">·</span>
                                <span>{{ post.commentsCount }}개의 댓글</span>
                                <span class="separator">·</span>
                                <span class="likes">♥ {{ post.likes }}</span>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import NavHeader from '@/growthBlog/ui/navigation/navigation.vue';
import { useSmartContentStore } from '~/smartContent/stores/smartContentStore';
import { useAccountStore } from '@/account/stores/accountStore';
import { useAuthenticationStore } from '@/authentication/stores/authenticationStore';
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';

const smartContentStore = useSmartContentStore();
const accountStore = useAccountStore();
const authenticationStore = useAuthenticationStore();
const posts = ref([]);
const nickname = ref('Guest');

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
    const userToken = localStorage.getItem('userToken')
    try {
        const response = await smartContentStore.requestListMySmartContentToDjango(userToken);
        posts.value = response;
    } catch (error) {
        console.error('내 SmartContent 목록 조회 실패:', error);
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
}

.nav-header {
    border-bottom: 1px solid #eee;
    height: 64px;
    background: white;
    z-index: 100;
}

.nav-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.nav-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.blog-title {
    font-size: 16px;
    font-weight: 500;
}

.notification-button,
.search-button {
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: #868e96;
}

.notification-button:hover,
.search-button:hover {
    color: #495057;
}

.write-button {
    background: #12b886;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
    margin-left: 8px;
}

.write-button:hover {
    background: #0ca678;
}

.write-text {
    line-height: 1.2;
}

.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
}

.profile-section {
    text-align: center;
    margin-bottom: 40px;
}

.profile-image {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-bottom: 20px;
}

.profile-name {
    font-size: 24px;
    margin-bottom: 16px;
    font-weight: 500;
}

.profile-stats {
    display: flex;
    justify-content: center;
    gap: 20px;
    color: #666;
    font-size: 14px;
}

.navigation-tabs {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-bottom: 40px;
    border-bottom: 1px solid #eee;
}

.tab {
    text-decoration: none;
    color: #666;
    padding: 12px 0;
    position: relative;
}

.tab.active {
    color: #12b886;
}

.tab.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: #12b886;
}

.search-bar {
    margin-bottom: 40px;
}

.search-bar input {
    width: 100%;
    padding: 12px;
    border: 1px solid #eee;
    border-radius: 4px;
    font-size: 14px;
}

.search-bar input::placeholder {
    color: #aaa;
}

.content-layout {
    display: flex;
    gap: 60px;
    margin-top: 40px;
}

.tags-section {
    flex: 0 0 200px;
    padding: 20px 0;
}

.tags-section h2 {
    font-size: 16px;
    margin-bottom: 20px;
    font-weight: 500;
    padding-bottom: 20px;
    border-bottom: 1px solid #e9ecef;
}

.tag-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 20px;
}

.tag {
    text-decoration: none;
    color: #666;
    font-size: 14px;
}

.tag span {
    color: #888;
}

.posts-section {
    flex: 1;
}

.post-item {
    padding: 20px 0;
    border-bottom: 1px solid #eee;
}

.post-title {
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 8px;
    color: #212529;
}

.post-description {
    font-size: 16px;
    color: #495057;
    margin-bottom: 16px;
    line-height: 1.5;
}

.post-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 14px;
}

.post-tag {
    color: #12b886;
    text-decoration: none;
}

.post-info {
    color: #868e96;
    display: flex;
    align-items: center;
    gap: 8px;
}

.separator {
    color: #868e96;
}

.likes {
    color: #868e96;
}

@media (max-width: 768px) {
    .nav-content {
        padding: 0 16px;
    }

    .profile-image {
        width: 100px;
        height: 100px;
    }

    .navigation-tabs {
        gap: 20px;
    }

    .content-layout {
        flex-direction: column;
        gap: 40px;
    }

    .tags-section {
        flex: none;
        width: 100%;
    }
}
</style>