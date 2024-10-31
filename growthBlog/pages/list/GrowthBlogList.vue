<template>
    <div class="post-list" @scroll.passive="handleScroll">
            <NavHeader class="nav" />
        <div class="post-filter">
            <div class="filter-tabs">
                <a href="#" class="tab active">트렌딩</a>
                <a href="#" class="tab">최신</a>
                <a href="#" class="tab">피드</a>
            </div>
            <div class="filter-right">
                <button class="period-button">이번 주 <span class="arrow">▼</span></button>
                <button class="more-button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                </button>
            </div>
        </div>
        <div class="post-grid">
        <article v-for="content in smartContents" :key="content.id" class="post-card" @click="goToReadPage(content.id)">
            <div class="post-content">
                <img :src="defaultThumbnail" :alt="content.title" class="post-thumbnail">
                <h2 class="post-title">{{ content.title }}</h2>
                <div class="post-meta">
                    <span class="post-date">{{ formatDate(content.regDate) }} · {{ content.comments }}개의 댓글</span>
                    <div class="author">
                        <img :src="defaultImage" :alt="content.author" class="author-avatar">
                        <span>by {{ content.nickname }}</span>
                        <div class="likes">
                            <span>♥</span>
                            <span>{{ likeCounts[content.id] || 0 }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import debounce from 'lodash/debounce'  // 이렇게 수정
import NavHeader from '../../ui/navigation/navigation.vue'
import { useSmartContentStore } from '@/smartContent/stores/smartContentStore'
import { useLikeCountStore } from '~/likeCount/stores/likeCountStore'
import defaultImage from '~/assets/fixed/login/google_login_round.png'
import defaultThumbnail from '~/assets/fixed/chatbot/background_gradient.png'

const router = useRouter()
const smartContentStore = useSmartContentStore()
const smartContents = ref([])
const itemsPerPage = 6
const currentPage = ref(1)
const isLoading = ref(false)
const hasMoreData = ref(true)  
const likeCountStore = useLikeCountStore()
const likeCounts = ref({})


// formatDate 함수 정의
const formatDate = (date: any) => {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const fetchSmartContents = async () => {
    if (isLoading.value || !hasMoreData.value) return
    isLoading.value = true
    try {
        
        const response = await smartContentStore.requestListSmartContentToDjango(currentPage.value, itemsPerPage)
        
        // 데이터가 없으면 로딩 중단
        if (response.length === 0 || response.length < itemsPerPage) {
            hasMoreData.value = false
        }

        if (response.length === 0) return

        // 각 컨텐츠의 좋아요 수 가져오기
        await Promise.all(response.map(async (content) => {
            try {
                const likeCount = await likeCountStore.requestLikeCountToDjango(content.id)
                likeCounts.value[content.id] = likeCount
            } catch (error) {
                console.error(`좋아요 수 조회 실패 (컨텐츠 ID: ${content.id}):`, error)
                likeCounts.value[content.id] = 0
            }
        }))

        smartContents.value.push(...response)
        currentPage.value++
    } catch (error) {
        console.error('SmartContent 목록 조회 실패:', error)
        hasMoreData.value = false  // 에러 발생 시 더 이상 요청하지 않음
    } finally {
        isLoading.value = false
    }
}

// 스크롤 이벤트 핸들러
const handleScroll = debounce((event) => {
    const element = event.target
    const bottomReached = 
        element.scrollHeight - element.scrollTop <= element.clientHeight + 100
    
    if (bottomReached && !isLoading.value && hasMoreData.value) {
        fetchSmartContents()
    }
}, 200)

const goToReadPage = (id: number) => {
    router.push({ name: 'growthBlogRead-page', params: { id } })
}

onMounted(() => {
    fetchSmartContents()
})

onUnmounted(() => {
    handleScroll.cancel()  // debounce 핸들러 정리
})

</script>


<style scoped>
.nav {
    margin-top: 70px;
}
.post-list {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    height: 100vh;
    overflow-y: auto;
    scrollbar-width: none;
}

.post-filter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    border-bottom: 1px solid #e9ecef;
    padding-bottom: 12px;
}

.filter-tabs {
    display: flex;
    gap: 24px;
}

.tab {
    text-decoration: none;
    color: #868e96;
    font-size: 16px;
    padding: 8px 0;
    position: relative;
}

.tab.active {
    color: #212529;
    font-weight: 500;
}

.tab.active::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    right: 0;
    height: 2px;
    background: #212529;
}

.filter-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.period-button {
    border: none;
    background: none;
    font-size: 14px;
    color: #495057;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
}

.more-button {
    border: none;
    background: none;
    color: #868e96;
    cursor: pointer;
    padding: 4px;
}

.post-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* 3열로 수정 */
    gap: 24px;
}

.post-card {
    border: 1px solid #e9ecef;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s;
}

.post-card:hover {
    transform: translateY(-4px);
}

.post-thumbnail {
    width: 100%;
    height: 200px; /* 원하는 높이로 조정 */
    overflow: hidden;
}

.post-thumbnail img {
    width: 100%;
    height: auto; /* 비율 유지 */
    object-fit: cover; /* 이미지 비율 유지 */
}

.post-content {
    padding: 16px;
}

.post-title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 8px;
    color: #212529;
}

.post-excerpt {
    font-size: 14px;
    color: #495057;
    line-height: 1.5;
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.post-meta {
    font-size: 12px;
    color: #868e96;
}

.post-date {
    display: block;
    margin-bottom: 8px;
}

.author {
    display: flex;
    align-items: center;
    gap: 8px;
}

.author-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
}

.likes {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 4px;
}

@media (max-width: 1024px) {
    .post-grid {
        grid-template-columns: repeat(2, 1fr);
        /* 태블릿에서는 2열 */
    }
}

@media (max-width: 768px) {
    .post-grid {
        grid-template-columns: 1fr;
        /* 모바일에서는 1열 */
    }

    .filter-tabs {
        gap: 16px;
    }
}
</style>