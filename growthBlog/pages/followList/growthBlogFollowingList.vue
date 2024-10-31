<template>
    <div class="container">
        <div class="header">
            <div class="profile-header">
                <img src="/assets/fixed/login/google_login_round.png" alt="프로필 이미지" class="profile-icon">
                <span class="header-text">기다려</span>
            </div>
            <span class="divider">></span>
            <span class="header-text">팔로잉</span>
        </div>

        <h1 class="title">{{ followingCount }}명의 팔로잉</h1>

        <div v-for="(follower, index) in followingList" :key="follower.id" class="follower-item">
            <div class="follower-info">
                <div v-if="!follower.isError" class="initial-box">
                    <span class="initial-text">{{ index + 1 }}</span>
                </div>
                <div class="user-info">
                    <span class="user-name" @click="goToUserPage(follower.nickname)" style="cursor: pointer">
                        {{ follower.nickname }}
                    </span>
                </div>
            </div>
            <button v-if="!follower.isError" class="follow-button">팔로우</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAccountStore } from '@/account/stores/accountStore'

const route = useRoute();
const router = useRouter();
const nickname = ref('');
const following = ref('');
const followers = ref('');
const followingCount = ref('');
const followingList = ref([]);
const accountStore = useAccountStore();

const goToUserPage = (userNickname) => {
    router.push(`/growth-blog/my-page/${userNickname}`);
};

const getFollowerNicknames = async (followingString) => {
    if (!followingString) return;

    const followerIds = followingString.split(',').map(id => id.trim());

    try {
        const userDataList = await accountStore.requestGetUserProfileByAccountIdToDjango(followerIds);

        followingList.value = userDataList.map(userData => ({
            id: userData.accountId,
            nickname: userData.nickname,
            isError: false
        }));
    } catch (error) {
        console.error('Failed to fetch nicknames:', error);
        followingList.value = [{
            id: 'none',
            nickname: '없음',
            isError: true
        }];
    }
};

const getNickname = async () => {
    const userProfile = await accountStore.requestGetUserProfileByUserTokenToDjango();
    nickname.value = userProfile.nickname;
};

onMounted(async () => {
    nickname.value = route.query.nickname?.toString() || '';
    followers.value = route.query.followers?.toString() || '0';
    following.value = route.query.following?.toString() || '0';
    followingCount.value = route.query.followingCount?.toString() || '0';

    await getNickname();
    await getFollowerNicknames(following.value);
});
</script>

<style scoped>
.container {
    max-width: 768px;
    margin: 0 auto;
}

.header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 8px;
}

.profile-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
}

.header-text {
    font-size: 18px;
    font-weight: 500;
}

.divider {
    color: #9ca3af;
}

.title {
    font-size: 24px;
    font-weight: 500;
    color: #1f2937;
    padding: 16px;
}

.follower-container {
    padding: 0 16px;
}

.follower-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
}

.follower-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.initial-box {
    width: 48px;
    height: 48px;
    background-color: #dbeafe;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.initial-text {
    color: #3b82f6;
    font-size: 20px;
}

.user-info {
    display: flex;
    flex-direction: column;
}

.user-name {
    font-size: 16px;
    font-weight: 500;
}

.user-id {
    font-size: 14px;
    color: #6b7280;
}

.follow-button {
    padding: 6px 24px;
    border-radius: 9999px;
    border: 1px solid #10b981;
    color: #10b981;
    background-color: transparent;
    cursor: pointer;
    transition: background-color 0.2s;
}

.follow-button:hover {
    background-color: #ecfdf5;
}

.user-name:hover {
    text-decoration: underline;
    color: #3b82f6;
}
</style>