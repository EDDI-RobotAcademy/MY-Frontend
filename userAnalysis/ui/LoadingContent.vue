<template>
    <div class="loading-container">
        <transition name="slide">
            <div v-if="isVisible" class="loading-card">
                {{ currentMessage }}
                <span v-if="!isMessageComplete || isLastMessage">{{ dots }}</span>
                <span v-else class="check-mark">✓</span>
            </div>
        </transition>

        <div class="skeleton-background">
            <div class="title-container">
                <div class="skeleton-title-block"></div>
            </div>

            <div class="top-grid">
                <div class="info-card" v-for="i in 5" :key="`top-${i}`">
                    <div class="bullet"></div>
                    <div class="text-content">
                        <div class="text-line small"></div>
                        <div class="text-line large"></div>
                    </div>
                </div>
            </div>

            <div class="bottom-grid">
                <div class="info-card" v-for="i in 3" :key="`bottom-${i}`">
                    <div class="bullet"></div>
                    <div class="text-content">
                        <div class="text-line small"></div>
                        <div class="text-line large"></div>
                    </div>
                </div>
            </div>

            <div class="title-container">
                <div class="skeleton-title-block"></div>
            </div>

            <div class="analysis-card">
                <div class="analysis-content">
                    <div class="text-content">
                        <div class="large-text-line maxlarge"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const messages = [
    '입력 요약 중이에요',
    '입력 분석 중이에요',
    '인플루언서 분석 중이에요',
    '콘텐츠 전략을 만들고 있어요',
    '예산별 장비 및 툴 추천을 정리하고 있어요',
    '성장 로드맵을 작성하고 있어요',
    '정리 중이에요'
]

const currentMessage = ref(messages[0])
const isVisible = ref(true)
const dots = ref('.')
const isMessageComplete = ref(false)
const isLastMessage = computed(() => currentMessage.value === messages[messages.length - 1])
let currentIndex = 0
let messageTimer = null
let dotsTimer = null

const getRandomTime = () => {
    return Math.floor(Math.random() * (4000 - 2000 + 1) + 2000)
}

const stopDotsAnimation = () => {
    if (dotsTimer) {
        clearInterval(dotsTimer)
        dotsTimer = null
    }
}

const animateDots = () => {
    if (dotsTimer) clearInterval(dotsTimer)
    dotsTimer = setInterval(() => {
        if (!isMessageComplete.value || isLastMessage.value) {
            dots.value = dots.value.length >= 3 ? '.' : dots.value + '.'
        }
    }, 500)
}

const showNextMessage = () => {
    if (!isLastMessage.value) {
        isMessageComplete.value = true
        stopDotsAnimation()
    }

    setTimeout(() => {
        isVisible.value = false

        setTimeout(() => {
            if (currentIndex < messages.length - 1) {
                currentIndex++
                currentMessage.value = messages[currentIndex]
                isMessageComplete.value = false
                dots.value = '.'
                isVisible.value = true
                animateDots()

                const nextDelay = getRandomTime()
                messageTimer = setTimeout(showNextMessage, nextDelay)
            }
        }, 1000)
    }, 1000)
}

onMounted(() => {
    animateDots()
    const initialDelay = getRandomTime()
    messageTimer = setTimeout(showNextMessage, initialDelay)
})

onBeforeUnmount(() => {
    if (messageTimer) clearTimeout(messageTimer)
    stopDotsAnimation()
})

const isComplete = computed(() => currentIndex === messages.length - 1)
defineExpose({ isComplete })
</script>


<style scoped>
.loading-container {
    position: relative;
    min-height: 100vh;
    background-color: #000;
    padding: 2rem;
    color: white;
}

.skeleton-title-block,
.text-line,
.info-card,
.analysis-card,
.bullet {
    position: relative;
    overflow: hidden;
}

.skeleton-title-block::after,
.text-line::after,
.info-card::after,
.analysis-card::after,
.bullet::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%);
    transform: translateX(-100%);
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}

.skeleton-background {
    opacity: 0.3;
    padding: 0 2rem;
}

.title-container {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
}

.skeleton-title-block {
    background: #333;
    height: 2.5rem;
    width: 150px;
    border-radius: 8px;
}

.top-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
    margin-top: 3rem;
}

.bottom-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.info-card {
    background: #1a1a1a;
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    gap: 0.5rem;
    height: 80px;
}

.bullet {
    width: 6px;
    height: 6px;
    background-color: #2563eb;
    border-radius: 50%;
    margin-top: 6px;
    flex-shrink: 0;
}

.text-content {
    flex: 1;
    width: 100%;
}

.text-line {
    background: #333;
    border-radius: 4px;
    height: 1rem;
    margin-bottom: 1rem;
}

.large-text-line {
    background: #333;
    border-radius: 4px;
    height: 16rem;
    margin-bottom: 1rem;
}

.text-line.small {
    width: 30%;
}

.text-line.medium {
    width: 60%;
}

.text-line.large {
    width: 100%;
}

.text-line.maxlarge {
    width: 100%;
}

.text-line.xl {
    width: 90%;
    height: 1.2rem;
}

.analysis-card {
    background: #1a1a1a;
    border-radius: 12px;
    padding: 2rem;
    margin-top: 3rem;
    height: 320px;
}

.analysis-content {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
}

.analysis-card .text-content {
    flex: 1;
    width: 100%;
}

.loading-card {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #3b3b3b;
    padding: 1.5rem 2.5rem;
    border-radius: 12px;
    font-size: 1.1rem;
    color: white;
    z-index: 10;
    min-width: 300px;
    text-align: center;
}

.slide-enter-active {
    animation: slideIn 1s ease-out;
}

.slide-leave-active {
    animation: slideOut 1s ease-in;
}

.check-mark {
    display: inline-block;
    color: #22c55e;
    font-weight: bold;
    margin-left: 4px;
    font-size: 1.2em;
}


@keyframes slideIn {
    from {
        transform: translate(-50%, -200%);
        opacity: 0;
    }

    to {
        transform: translate(-50%, -50%);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translate(-50%, -50%);
        opacity: 1;
    }

    to {
        transform: translate(-50%, 100%);
        opacity: 0;
    }
}

@media (max-width: 1200px) {
    .top-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    .bottom-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .loading-container {
        padding: 1rem;
    }

    .top-grid,
    .bottom-grid {
        grid-template-columns: 1fr;
    }

    .loading-card {
        min-width: 300px;
        padding: 1.5rem 2rem;
    }
}
</style>