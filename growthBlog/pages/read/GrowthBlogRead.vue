<template>
    <div class="container">
        <NavHeader />
        <div class="blog_container">
            <div class="blog_header">
                <div class="header_inner">
                    <div class="header_content">
                        <h1 class="post_title">{{ content.title }}</h1>
                        <div class="post_info">
                            <span class="writer" @click="goToUserPage(content.nickname)">by {{ content.nickname }}</span>
                            <span class="date">{{ formatDate(content.regDate) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="blog_content_wrapper">
                <div class="like_button_wrapper">
                    <LikeButton
                        :content-id="Number(route.params.id)"
                        :initial-like-count="content.likeCount"
                        :initial-liked-state="content.userHasLiked"
                    />
                </div>
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
import { useRoute, useRouter } from 'vue-router';
import { useSmartContentStore } from '@/smartContent/stores/smartContentStore';
import NavHeader from '@/growthBlog/ui/navigation/navigation.vue';
import LikeButton from '~/growthBlog/ui/read/LikeButton.vue';

const route = useRoute();
const smartContentStore = useSmartContentStore();
const itemsWithImages = ref([]);
const loading = ref(true);
const content = ref({
    title: '',
    nickname: '',
    regDate: '',
    likeCount: 0,
    userHasLiked: false,
});
const router = useRouter();
const formatText = (text: string) => {
    return text.replace(/\n/g, '<br>');
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

const fetchSmartContent = async () => {
    try {
        const contentId = route.params.id;
        if (!contentId) return;
        
        const response = await smartContentStore.readSmartContentToDjango(Number(contentId));
        content.value = {
            ...response,
            likeCount: response.like_count || 0,
            userHasLiked: response.user_has_liked || false
        }
    } catch (error) {
        console.error('Error fetching smart content:', error);
    }
};

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

const goToUserPage = (userNickname) => {
    router.push(`/growth-blog/my-page/${userNickname}`);
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
    position: relative;
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

.writer:hover {
    cursor: pointer;
}

.blog_content_wrapper {
    display: flex;
    position: relative;
    margin-top: 20px;
}

.blog_content {
    flex-grow: 1;
    margin-left: 100px; /* 좋아요 버튼 공간 확보 */
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

.like_button_wrapper {
    position: sticky;
    top: 100px;
    left: 0;
    width: 60px;
    height: fit-content;
    margin-right: 40px;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
    .blog_container {
        padding: 20px;
    }
    
    .blog_content {
        margin-left: 80px;
    }
}

@media (max-width: 768px) {
    .blog_container {
        padding: 10px;
    }

    .blog_content {
        margin-left: 0;
    }

    .blog_content_wrapper {
        display: block;
    }

    .like_button_wrapper {
        position: fixed;
        bottom: 20px;
        left: 20px;
        top: auto;
        margin-right: 0;
        z-index: 100;
    }

    .post_title {
        font-size: 32px;
    }

    .post_content {
        padding: 20px;
    }
}
</style>