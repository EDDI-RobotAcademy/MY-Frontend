<template>
    <nav class="nav-header">
        <div class="nav-content">
            <div class="nav-left">
                <div class="blog-title">moneyandjelly_.log</div>
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
import { computed } from 'vue';
import { useAuthenticationStore } from '@/authentication/stores/authenticationStore';
import { useRouter } from 'vue-router';

export default {
    name: 'NavHeader',
    setup() {
        const authenticationStore = useAuthenticationStore();
        const isAuthenticated = computed(() => authenticationStore.isAuthenticated);
        const router = useRouter()

        const goToRegister = async () => {
            router.push(`/growth-blog/register`);
        };
        const goToLogin = async () => {
            router.push(`/login`);
        };

        return {
            isAuthenticated,
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
.write-button, .login-button {
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
    margin-left: 8px;
}

.write-button:hover, .login-button:hover {
    background: #ffbc86;
}

.write-text, .login-text {
    line-height: 1.2;
}


@media (max-width: 768px) {
    .nav-content {
        padding: 0 16px;
    }
}
</style>