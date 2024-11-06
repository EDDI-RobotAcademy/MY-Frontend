<template>
    <div class="header"></div>
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
            <img :src="content.thumbnail || defaultThumbnail" :alt="content.title" class="post-thumbnail">
            <div class="post-content">
                <h2 class="post-title">{{ content.title }}</h2>
                <p v-if="content.text" class="post-description">{{ content.text }}</p>
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
import debounce from 'lodash/debounce'
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

// 컨텐츠의 첫 번째 이미지 가져오기
const fetchContentThumbnail = async (contentId: string) => {
    try {
        const response = await smartContentStore.requestListItemsToDjango(contentId)

        const items = response.items || []
        
        // type이 'image'인 항목만 필터링
        const imageItems = items
            .filter(item => item && item.type === 'image' && item.image_url)
            .sort((a, b) => Number(a.sequence_number) - Number(b.sequence_number))

        // 텍스트 항목 필터링 및 정렬
        const textItems = items
            .filter(item => item.type === 'text' && item.content)
            .sort((a, b) => Number(a.sequence_number) - Number(b.sequence_number))
        
        // 첫 번째 이미지의 URL 반환
        return {
            thumbnail: imageItems.length > 0 ? imageItems[0].image_url : null,
            text: textItems.length > 0 ? textItems[0].content : null
        }

        
    } catch (error) {
        console.error(`썸네일 가져오기 실패 (컨텐츠 ID: ${contentId}):`, error)
        return null
    }
}

const fetchSmartContents = async () => {
    if (isLoading.value || !hasMoreData.value) return
    isLoading.value = true
    try {
        const response = await smartContentStore.requestListSmartContentToDjango(currentPage.value, itemsPerPage)
        
        if (response.length === 0 || response.length < itemsPerPage) {
            hasMoreData.value = false
        }

        if (response.length === 0) return

        // 각 컨텐츠의 썸네일과 좋아요 수 가져오기
        const contentsWithData = await Promise.all(response.map(async (content) => {
            const [contentData, likeCount] = await Promise.all([
            fetchContentThumbnail(content.id.toString()),
            likeCountStore.requestLikeCountToDjango(content.id)
        ])
            console.log(`Content ID: ${content.id}, Thumbnail: ${JSON.stringify(contentData)}`);


            likeCounts.value[content.id] = likeCount
            return {
                ...content,
                thumbnail: contentData.thumbnail || defaultThumbnail,
                text: contentData.text || '기본 텍스트'
            }
        }))

        smartContents.value.push(...contentsWithData)
        currentPage.value++
    } catch (error) {
        console.error('SmartContent 목록 조회 실패:', error)
        hasMoreData.value = false
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
    handleScroll.cancel()
})
</script>


<style scoped>
.header {
    width: 100%;
    height: 63px; 
}
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
    height: 100%;
    display: flex;
    flex-direction: column;
}


.post-card:hover {
    transform: translateY(-4px);
}

.post-thumbnail {
    width: 100%;
    height: 250px; /* 원하는 높이로 조정 */
    overflow: hidden;
}

.post-thumbnail img {
    width: 100%;
    height: auto; /* 비율 유지 */
    object-fit: cover; /* 이미지 비율 유지 */
}

.post-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: space-between;
}

.post-title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 8px;
    color: #212529;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.post-description {
    font-size: 15px;
    color: #868e96;
    margin-bottom: 30px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* 원하는 줄 수 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    /* max-height: 4.2em; /* line-height * 줄 수 */
    line-height: 1.4; 
}


.post-meta {
    margin-top: auto;
    margin-bottom: -8px;
    font-size: 12px;
    color: #868e96;
}

.post-date {
    display: block;
    margin-bottom: 8px;
}

.author {
    border-top: 1px solid #e9ecef;
    padding-top: 5px;
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