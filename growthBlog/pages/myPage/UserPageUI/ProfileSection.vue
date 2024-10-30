<template>
    <div class="profile-section">
        <img src="/assets/fixed/login/google_login_round.png" :alt="`${nickname}의 프로필`" class="profile-image">
        <h1 class="profile-name">{{ nickname }}</h1>
        <div class="profile-stats">
            <span class="stat-item" @click="$router.push({
                path: '/growth-blog/following',
                query: {
                    nickname: nickname,
                    following: growthBlogStore.following.toString(),
                    followers: growthBlogStore.followers.toString(),
                    followingCount: growthBlogStore.followingCount.toString(),
                }
            })">
                {{ growthBlogStore.followingCount }} 팔로잉
            </span>
            <span class="stat-item" @click="$router.push({
                path: '/growth-blog/followers',
                query: {
                    nickname: nickname,
                    following: growthBlogStore.following.toString(),
                    followers: growthBlogStore.followers.toString(),
                    followersCount: growthBlogStore.followersCount.toString(),
                }
            })">
                {{ growthBlogStore.followersCount }} 팔로워
            </span>
        </div>
        <FollowButton :is-following="growthBlogStore.isFollowing" @follow="handleFollow" @unfollow="handleUnfollow"
            :disabled="growthBlogStore.isLoading" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FollowButton from './FollowButton.vue';
import { useGrowthBlogStore } from '~/growthBlog/stores/growthBlogStore';

const growthBlogStore = useGrowthBlogStore();

const props = defineProps({
    nickname: {
        type: String,
        required: true
    }
});

const handleFollow = async () => {
    try {
        await growthBlogStore.registerSocial(props.nickname);
    } catch (error) {
        console.error('팔로우 실패:', error);
    }
};

const handleUnfollow = async () => {
    try {
        await growthBlogStore.unregisterSocial(props.nickname);
    } catch (error) {
        console.error('언팔로우 실패:', error);
    }
};

onMounted(async () => {
    await growthBlogStore.getFollowInfo();
});
</script>


<style scoped>
.profile-section {
    text-align: center;
    margin-bottom: 40px;
}

.profile-image {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-bottom: 20px;
    object-fit: cover;
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
    margin-bottom: 16px;
}

.stat-item {
    cursor: pointer;
    padding: 4px 8px;
    /* 클릭 영역을 좀 더 넓게 */
    transition: color 0.2s;
    /* 호버 효과 부드럽게 */
}

.stat-item:hover {
    color: #333;
    /* 호버 시 색상 변경 */
}
</style>