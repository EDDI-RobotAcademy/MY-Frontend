<template>
    <div class="container">
        <NavHeader />
    <div class="blog_container">
    <!-- Header Section -->
    <div class="blog_header">
        <div class="header_inner">
        <div class="header_content">
            <h1 class="post_title">{{ content.title }}</h1>
            <div class="post_info">
            <span class="writer">by {{ content.nickname }}</span>
            <span class="date">{{ formatDate(content.regDate) }}</span>
            </div>
        </div>
        </div>
    </div>

    <!-- Content Wrapper -->
    <div class="blog_content_wrapper">
        <!-- Main Content Area -->
        <div class="blog_content">
        <div class="post_content">
            <div
            v-for="item in itemsWithImages"
            :key="item.sequence_number"
            class="content_block"
            >
            <div
                v-if="item.type === 'text'"
                class="text_block"
                v-html="formatText(item.content)"
            ></div>
            <div v-else-if="item.type === 'image'" class="image_block">
                <img
                v-if="item.imageUrl"
                :src="item.imageUrl"
                alt="Content Image"
                />
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSmartContentStore } from '@/smartContent/stores/smartContentStore';
import NavHeader from '@/growthBlog/ui/navigation/navigation.vue'; // NavHeader 컴포넌트 임포트

const route = useRoute();
const smartContentStore = useSmartContentStore();
const itemsWithImages = ref([]);
const loading = ref(true);
const content = ref({
    title: '',
    nickname: '',
    regDate: '',
});

// 텍스트 포맷팅 (줄바꿈 처리)
const formatText = (text: string) => {
    return text.replace(/\n/g, '<br>');
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

// SmartContent 기본 정보 가져오기
const fetchSmartContent = async () => {
    try {
        const contentId = route.params.id;
        if (!contentId) return;
        
        const response = await smartContentStore.readSmartContentToDjango(Number(contentId));
        content.value = response;
    } catch (error) {
        console.error('Error fetching smart content:', error);
    }
};

// 콘텐츠 아이템 가져오기
const fetchContentItems = async () => {
    try {
        const contentId = route.params.id;
        const response = await smartContentStore.requestListItemsToDjango(contentId.toString());
        
        itemsWithImages.value = response.items.map(item => ({
            ...item,
            imageUrl: item.image_url ? item.image_url : null
        }));
    } catch (error) {
        console.error('Error fetching items:', error);
        itemsWithImages.value = [];
    } finally {
        loading.value = false
    }
};

onMounted(() => {
    fetchSmartContent();
    fetchContentItems();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap');

* {
    font-family: 'Noto Sans KR', sans-serif;
    box-sizing: border-box;
}

body {
    margin: 0;
    padding: 0;
    background-color: #f8f9fa;
}

.container {
    padding-top: 60px;
}

.blog_container {
    max-width: 858px;
    margin: 0 auto;
    padding: 20px;
}

.blog_header {
    background-color: #ffffff;
    text-align: center;
    padding: 60px 0;
    border-bottom: 1px solid #e9ecef;
}

.header_inner {
    max-width: 100%;
}

.header_content {
    text-align: center;
}

.post_title {
    font-size: 48px;
    font-weight: bold;
    margin-top: 16px;
}

.post_info {
    font-size: 14px;
    color: #495057;
    margin-top: 20px;
}

.writer {
    font-weight: bold;
    margin-right: 20px;
}

.blog_content_wrapper {
    display: flex;
}

.blog_content {
    flex-grow: 1;
}

.post_content {
    background-color: #ffffff;
    padding: 40px;
}

.content_block {
    margin-bottom: 24px;
}

.text_block {
    font-size: 18px;
    line-height: 1.6;
    color: #212529;
}

.image_block img {
    max-width: calc(100% - 40px);
    height: auto;
    margin-top: 16px;
    border-radius: 8px; 
}

</style>