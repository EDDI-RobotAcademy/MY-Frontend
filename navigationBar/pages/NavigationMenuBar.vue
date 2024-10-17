<template>
    <div class="navigation-menu-bar-container" ref="navbarContainer">
        <div class="navigation-menu-bar-background" ref="navbarBackground"></div>
        <div class="navigation-menu-bar-content">
            <button @click="goToHomePage" class="logo" :style="{ color: currentColor }">COOING</button>
            <div class="center-menu-container" ref="centerMenuContainer">
                <div class="center-menu" ref="centerMenu">
                    <button class="menu-item button" data-text="성향 분석하기" @click="goToUserAnalysisPage">
                        <span>성향 분석하기</span>
                    </button>
                </div>
            </div>
            <div class="right-menu">
                <div class="feedback-container" ref="feedbackContainer">
                    <button class="menu-item button" data-text="피드백" @click="goToSurveyPage">
                        <span>피드백</span>
                    </button>
                </div>
                <div class="auth-buttons">
                    <button v-if="!isAuthenticated" @click="goToLoginPage" class="login"
                        :style="{ color: currentColor }">
                        LOGIN
                    </button>
                    <button v-if="isAuthenticated" @click="logOut" class="logout" :style="{ color: currentColor }">
                        LOGOUT
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAccountStore } from '../../account/stores/accountStore.ts'

const router = useRouter()
const route = useRoute()
const accountStore = useAccountStore()
const navbarContainer = ref(null)
const navbarBackground = ref(null)
const centerMenuContainer = ref(null)
const feedbackContainer = ref(null)

const isAuthenticated = computed(() => accountStore.isAuthenticated)

const lastScrollTop = ref(0)
const isNavbarVisible = ref(true)
const currentColor = ref('rgb(255, 255, 255)')
const isScrollingUp = ref(false)
const colorRegions = [
    { threshold: 0, color: 'rgb(255, 255, 255)' },
    { threshold: 1500, color: 'rgb(0, 0, 0)' },
    { threshold: 2260, color: 'rgb(255, 255, 255)' },
]

const isHomePage = computed(() => route.path === '/')

const goToHomePage = () => router.push("/")
const goToLoginPage = () => router.push("/login")
const goToSurveyPage = () => router.push("/survey")
const goToUserAnalysisPage = () => router.push("/user-analysis")

const logOut = async () => {
    await accountStore.requestLogoutToDjango()
    router.push("/")
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
            targets: [navbarBackground.value, feedbackContainer.value],
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
            targets: [navbarBackground.value, feedbackContainer.value],
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
    }
})

onMounted(() => {
    console.log("navigation bar mounted()")
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
    justify-content: space-between;
    padding: 0 20px;
}

.logo {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: color 0.3s ease;
}

.center-menu-container {
    height: 100%;
    display: flex;
    align-items: center;
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
.logout {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    transition: color 0.3s ease;
}

.login:hover,
.logout:hover {
    opacity: 0.8;
}

.auth-buttons {
    display: flex;
    align-items: center;
}
</style>