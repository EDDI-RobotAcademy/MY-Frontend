<template>
    <div class="mypage-container">
        <div class="profile-section">
            <div class="profile-header">
                <div class="profile-info">
                    <div class="profile-image">
                        <img :src="defaultProfile" alt="Profile" />
                    </div>
                    <div class="profile-text">
                        <h1>{{ userInfo.nickname }}</h1>
                        <p>{{ userInfo.email }}</p>
                    </div>
                </div>
                <button @click="logOut" class="logout-button">로그아웃</button>
            </div>
        </div>
        
        <div class="button-grid">
            <NuxtLink to="/growth-history" class="menu-button">
                <div class="button-content">
                    <h3>성장 히스토리</h3>
                    <span class="arrow">→</span>
                    <p>나의 성장 과정을 확인하세요</p>
                </div>
            </NuxtLink>
            
            <NuxtLink to="/growth-blog/my-page" class="menu-button">
                <div class="button-content">
                    <h3>성장 블로그</h3>
                    <span class="arrow">→</span>
                    <p>나의 블로그 글을 관리하세요</p>
                </div>
            </NuxtLink>
            
            <NuxtLink to="/my-info" class="menu-button">
                <div class="button-content">
                    <h3>내 정보</h3>
                    <span class="arrow">→</span>
                    <p>개인정보를 관리하세요</p>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAccountStore } from '@/account/stores/accountStore'
import { useAuthenticationStore } from '@/authentication/stores/authenticationStore'
import defaultProfile from '~/assets/fixed/login/google_login_round.png'

const isAuthenticated = computed(() => authenticationStore.isAuthenticated);
const router = useRouter()
const authenticationStore = useAuthenticationStore();
const accountStore = useAccountStore()
const userInfo = ref({
    nickname: '',
    email: ''
})

const getNickname = async () => {
    const response = await accountStore.requestGetUserProfileByAccountIdToDjango()
    userInfo.value = {
        nickname: response.nickname || 'None',
        email: response.email || 'None'
    }
}

const logOut = async () => {
    await authenticationStore.requestLogoutToDjango()
    console.log("로그아웃 처리가 완료되었습니다.")
    router.push("/")
}

onMounted(() => {
    if (!isAuthenticated.value) {
        router.push("/login")
    }
    getNickname()
})
</script>

<style scoped>
.mypage-container {
    margin: 0 auto;
    padding: 100px;
    min-height: 100vh;
    background-color: #f5f5f5;
}

.profile-section {
    background: white;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 30px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.profile-info {
    display: flex;
    align-items: center;
    gap: 20px;
}

.profile-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
}

.profile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.profile-text h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 5px;
}

.profile-text p {
    color: #666;
}

.button-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.menu-button {
    background: white;
    border-radius: 10px;
    padding: 20px;
    text-decoration: none;
    color: inherit;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
}

.menu-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.button-content {
    position: relative;
}

.button-content h3 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.arrow {
    color: #999;
}

.button-content p {
    font-size: 14px;
    color: #666;
}

@media (max-width: 768px) {
    .button-grid {
        grid-template-columns: 1fr;
    }
    
    .profile-header {
        flex-direction: column;
        gap: 20px;
    }
    
    .profile-info {
        flex-direction: column;
        text-align: center;
    }
    
    .logout-button {
        margin-top: 10px;
    }
}

.logout-button {
    background: rgb(225, 225, 225);
    border: none;           
    border-radius: 10px;
    margin-right: 15px;
    padding: 10px 20px;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
}
</style>
