<template>
    <div v-if="!isPaymentPage" class="navigation-menu-bar-container" ref="navbarContainer">
        <div class="navigation-menu-bar-background" ref="navbarBackground"></div>
        <div class="navigation-menu-bar-content">
            <button @click="goToHomePage" class="logo" :style="{ color: currentColor }">COOING</button>
            <div class="center-menu-container" ref="centerMenuContainer">
                <div class="center-menu" ref="centerMenu">
                    <button class="menu-item button" data-text="AI 컨설팅" @click="goToUserAnalysisPage">
                        <span>AI 컨설팅</span>
                    </button>
                    <button class="menu-item button" data-text="키워드 분석" @click="goToKeywordAnalysisPage">
                        <span>키워드 분석</span>
                    </button>
                </div>
            </div>
            <div class="right-menu">
                <div class="board-container" ref="boardContainer">
                    <button class="menu-item button" data-text="커뮤니티" @click="goToFreeCommunityPage">
                        <span>커뮤니티</span>
                    </button>
                </div>
                <div class="blog-container" ref="blogContainer">
                    <button class="menu-item button" data-text="블로그" @click="goToGrowthBlogListPage">
                        <span>블로그</span>
                    </button>
                </div>
                <div class="feedback-container" ref="feedbackContainer">
                    <button class="menu-item button" data-text="피드백" @click="goToSurveyPage">
                        <span>피드백</span>
                    </button>
                </div>
                <div class="admin-menu-container" v-if="isAdmin" ref="adminMenuContainer">
                    <button @click="toggleAdminMenu" class="admin-button">
                        관리자 메뉴
                    </button>

                    <div v-if="isAdminMenuOpen" class="admin-dropdown-menu">
                        <ul>
                            <li @click="goToSurveyDashboardPage">피드백 답변목록</li>
                            <li @click="goToSurveyVisualizationPage">피드백 답변 시각화</li>
                            <li @click="goToUserAnalysisListPage">성향분석 답변목록</li>
                            <li @click="goToUserAnalysisVisualizationPage">성향분석 답변 시각화</li>
                        </ul>
                    </div>
                </div>
                <div class="auth-buttons">
                    <button v-if="!isAuthenticated" @click="goToLoginPage" class="login"
                        :style="{ color: currentColor }">
                        LOGIN
                    </button>
                    <button v-if="isAuthenticated" @click="goToMyPage" class="goToMyPage"
                        :style="{ color: currentColor }">
                        {{ userNickname }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAccountStore } from '@/account/stores/accountStore'
import { useAuthenticationStore } from '@/authentication/stores/authenticationStore'
import anime from 'animejs'

const router = useRouter()
const route = useRoute()
const accountStore = useAccountStore()
const authenticationStore = useAuthenticationStore()

const navbarContainer = ref(null)
const navbarBackground = ref(null)
const centerMenuContainer = ref(null)
const feedbackContainer = ref(null)
const boardContainer = ref(null)
const blogContainer = ref(null)
const userNickname = ref('')
const isAuthenticated = computed(() => authenticationStore.isAuthenticated)
const isAdmin = computed(() => authenticationStore.isAdmin)

const lastScrollTop = ref(0)
const isNavbarVisible = ref(true)
const currentColor = ref('rgb(255, 255, 255)')
const isScrollingUp = ref(false)
const colorRegions = [
    { threshold: 0, color: 'rgb(255, 255, 255)' },
    { threshold: 1300, color: 'rgb(0, 0, 0)' },
    { threshold: 2050, color: 'rgb(255, 255, 255)' },
]
const isAdminMenuOpen = ref(false)

const isHomePage = computed(() => route.path === '/')

const isPaymentPage = computed(() => {
    return route.path.includes('/tosspayments')
})

const toggleAdminMenu = () => {
    isAdminMenuOpen.value = !isAdminMenuOpen.value
}

const goToHomePage = () => router.push("/")
const goToLoginPage = () => router.push("/login")
const goToSurveyPage = () => router.push("/survey")
const goToFreeCommunityPage = () => router.push("/free-community/list")
const goToGrowthBlogListPage = () => router.push("/growth-blog/list")
const goToUserAnalysisPage = () => router.push("/user-analysis")
const goToKeywordAnalysisPage = () => router.push("/keyword-analysis")
const goToSurveyDashboardPage = () => router.push("/survey/dashboard")
const goToUserAnalysisListPage = () => router.push("/user-analysis/list")
const goToSurveyVisualizationPage = () => router.push("/survey/visualization")
const goToUserAnalysisVisualizationPage = () => router.push("/user-analysis/visualization")

const goToMyPage = async () => {
    router.push("/my-page")
}

const getNickname = async () => {
    if (isAuthenticated.value) {
        try {
            const userProfile = await accountStore.requestGetUserProfileByUserTokenToDjango()
            userNickname.value = userProfile.nickname
        } catch (error) {
            console.error('Failed to fetch nickname:', error)
            userNickname.value = '사용자'
        }
    }
}

const checkAndSetAuthStatus = async () => {
    await authenticationStore.checkAndSetAuthStatus()
}

const handleScroll = () => {
    if (!isHomePage.value) {
        currentColor.value = 'rgb(255, 255, 255)'
        return
    }

    const st = window.pageYOffset || document.documentElement.scrollTop

    isScrollingUp.value = st < lastScrollTop.value

    updateColor(st)

    if (st > lastScrollTop.value && isNavbarVisible.value) {
        animateNavbar(false)
    } else if (st < lastScrollTop.value && !isNavbarVisible.value) {
        animateNavbar(true)
    }
    lastScrollTop.value = st <= 0 ? 0 : st
}

const updateColor = (scrollTop) => {
    if (isScrollingUp.value) {
        currentColor.value = 'rgb(255, 255, 255)'
    } else {
        for (let i = colorRegions.length - 1; i >= 0; i--) {
            if (scrollTop >= colorRegions[i].threshold) {
                currentColor.value = colorRegions[i].color
                break
            }
        }
    }
}

const animateNavbar = (show) => {
    if (!isHomePage.value) return

    const duration = 300
    const easing = 'easeInOutQuad'

    if (show) {
        anime({
            targets: [navbarBackground.value, boardContainer.value, blogContainer.value, feedbackContainer.value],
            scaleY: [0, 1],
            duration: duration,
            easing: easing
        })
        anime({
            targets: centerMenuContainer.value,
            scaleY: [0, 1],
            translateY: ['-50%', '0%'],
            duration: duration,
            easing: easing
        })
    } else {
        anime({
            targets: [navbarBackground.value, boardContainer.value, blogContainer.value, feedbackContainer.value],
            scaleY: [1, 0],
            duration: duration,
            easing: easing
        })
        anime({
            targets: centerMenuContainer.value,
            scaleY: [1, 0],
            translateY: ['0%', '-50%'],
            duration: duration,
            easing: easing
        })
    }
    isNavbarVisible.value = show
}

watch(() => isAuthenticated.value, (newValue) => {
    if (newValue) {
        getNickname()
    } else {
        userNickname.value = ''
    }
})

watch(() => route.path, (to) => {
    if (to !== '/') {
        currentColor.value = 'rgb(255, 255, 255)'
        isNavbarVisible.value = true
        if (navbarBackground.value) {
            navbarBackground.value.style.transform = 'scaleY(1)'
        }
        if (centerMenuContainer.value) {
            centerMenuContainer.value.style.transform = 'scaleY(1) translateY(0%)'
        }
        if (feedbackContainer.value) {
            feedbackContainer.value.style.transform = 'scaleY(1)'
        }
        if (boardContainer.value) {
            boardContainer.value.style.transform = 'scaleY(1)'
        }
    }
})

onMounted(async () => {
    await checkAndSetAuthStatus()
    if (isAuthenticated.value) {
        await getNickname()
    }
    window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');

* {
    font-family: 'Noto Sans KR', sans-serif;
}

.navigation-menu-bar-container {
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 98%;
    height: 53px;
    z-index: 1000;
}

.navigation-menu-bar-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 1);
    border-radius: 10px;
    transform-origin: top;
}

.navigation-menu-bar-content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    /* justify-content: space-between; 제거 */
    padding: 0 20px;
}

.logo {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: color 0.3s ease;
    margin-right: 40px; /* 로고와 center-menu 사이 간격 추가 */
}

.center-menu-container {
    height: 100%;
    display: flex;
    align-items: center; /* left를 center로 변경 */
    transform-origin: top;
    overflow: hidden;
}

.center-menu {
    display: flex;
    gap: 20px;
}

.right-menu {
    display: flex;
    align-items: center;
    margin-left: auto; /* 오른쪽 메뉴를 오른쪽 끝으로 밀어냄 */
}

.board-container {
    margin-right: 20px;
    transform-origin: top;
    overflow: hidden;
}

.blog-container {
    margin-right: 20px;
    transform-origin: top;
    overflow: hidden;
}

.feedback-container {
    margin-right: 20px;
    transform-origin: top;
    overflow: hidden;
}

.menu-item {
    background: none;
    border: none;
    color: rgb(255, 255, 255, 0.7);
    cursor: pointer;
    font-size: 12px;
    overflow: hidden;
    padding: 0;
    position: relative;
    transition: color 0.3s;
    transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
}

.menu-item::after {
    content: attr(data-text);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    color: rgb(255, 255, 255, 1);
    transform: translate3d(0, 25%, 0);
}

.menu-item>span {
    display: block;
}

.menu-item::after,
.menu-item>span {
    padding: 0.5em 1em;
    transition: transform 0.6s, opacity 0.6s;
    transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
}

.menu-item:hover {
    color: rgb(255, 255, 255, 1);
}

.menu-item:hover::after {
    opacity: 1;
    transform: translate3d(0, 0, 0);
}

.menu-item:hover>span {
    opacity: 0;
    transform: translate3d(0, -25%, 0);
}

.login,
.goToMyPage {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    transition: color 0.3s ease;
}

.login:hover,
.goToMyPage:hover {
    opacity: 0.8;
}

.auth-buttons {
    display: flex;
    align-items: center;
}

.admin-menu-container {
    position: relative;
    margin-right: 40px;
    margin-left: 20px;
    margin-bottom: 5px;
    display: inline-block;
    z-index: 1001;
}

.admin-button {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    font-size: 12px;
    transition: color 0.3s ease;
}

.admin-button:hover {
    color: rgba(255, 255, 255, 1);
}

.admin-dropdown-menu {
    position: absolute;
    top: 100%;
    left: -75%;
    background-color: rgba(0, 0, 0, 0.9);
    border-radius: 5px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    width: max-content;
    padding: 10px 0;
}

.admin-dropdown-menu ul {
    list-style-type: none;
    padding: 10px 0;
    margin: 0;
}

.admin-dropdown-menu li {
    padding: 10px 20px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;
}

.admin-dropdown-menu li:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 1);
}

@media (max-width: 768px) {
    .menu-item {
    font-size: 9px;
}
}
</style>
