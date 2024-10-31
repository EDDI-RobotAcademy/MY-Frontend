<template>
    <nav class="nav-header">
        <div class="nav-content">
            <div class="nav-left">
                <div class="blog-title">{{ displayTitle }}</div>
            </div>
            <div class="nav-right">
                <button class="search-button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
                <button class="notification-button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
                <button class="write-button" @click="goToRegister" v-if="isAuthenticated">
                    <span class="write-text">새 글 작성</span>
                </button>
                <button class="login-button" @click="goToLogin" v-if="!isAuthenticated">
                    <span class="login-text">로그인</span>
                </button>
            </div>
        </div>
    </nav>
</template>

<script>
import { computed, ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthenticationStore } from '@/authentication/stores/authenticationStore';
import { useAccountStore } from '@/account/stores/accountStore';
import { storeToRefs } from 'pinia';

export default {
    name: 'NavHeader',
    setup() {
        const router = useRouter();
        const route = useRoute();
        const authenticationStore = useAuthenticationStore();
        const accountStore = useAccountStore();
        
        const { isAuthenticated } = storeToRefs(authenticationStore);
        const nickname = ref('Guest');

        const getUrlNickname = () => {
            const pathParts = route.path.split('/');
            const myPageIndex = pathParts.indexOf('my-page');
            if (myPageIndex !== -1 && pathParts.length > myPageIndex + 1) {
                return pathParts[myPageIndex + 1];
            }
            return null;
        };

        const computedNickname = computed(() => {
            const urlNickname = getUrlNickname();
            if (urlNickname) {
                return urlNickname;
            }
            return nickname.value || 'Guest';
        });
        
        const displayTitle = computed(() => {
            if (route.path.includes('/growth-blog/my-page')) {
                return `${computedNickname.value}.gblog`;
            }
            return 'gblog';
        });

        const goToRegister = () => {
            const currentPath = route.path;
            if (currentPath.includes('/growth-blog/my-page')) {
                router.push('/growth-blog/register?from=mypage');
            } else {
                router.push('/growth-blog/register?from=list');
            }
        };

        const goToLogin = () => {
            router.push(`/login`);
        };

        const getNickname = async () => {
            try {
                // URL에 닉네임이 있는 경우 API 호출하지 않음
                if (getUrlNickname()) {
                    return;
                }

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

        onMounted(() => {
            getNickname();
        });

        watch(isAuthenticated, (newValue) => {
            if (newValue) {
                getNickname();
            } else {
                nickname.value = 'Guest';
            }
        });

        watch(() => route.path, () => {
            // URL이 /growth-blog/my-page인 경우에만 API 호출
            if (route.path === '/growth-blog/my-page') {
                getNickname();
            }
        });

        return {
            isAuthenticated,
            displayTitle,
            goToRegister,
            goToLogin,
        };
    }
}
</script>

<style scoped>
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
    background: #ff9033;
}

.login-button {
    background: #ff9033;
}

.write-button,
.login-button {
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
    margin-left: 8px;
}

.write-button:hover,
.login-button:hover {
    background: #ffbc86;
}

.write-text,
.login-text {
    line-height: 1.2;
}

@media (max-width: 768px) {
    .nav-content {
        padding: 0 16px;
    }
}
</style>