<template>
    <div class="youtube-container">
        <h2 class="youtube-title" v-if="searchQuery">
            '{{ searchQuery }}' 관련 YouTube 영상
        </h2>
        <div class="videos-grid">
            <div v-for="video in videos" :key="video.id.videoId" class="video-card">
                <a :href="`https://www.youtube.com/watch?v=${video.id.videoId}`" target="_blank" class="video-link">
                    <img :src="video.snippet.thumbnails.medium.url" :alt="video.snippet.title" class="video-thumbnail">
                    <div class="video-info">
                        <h3 class="video-title">{{ video.snippet.title }}</h3>
                        <p class="channel-title">{{ video.snippet.channelTitle }}</p>
                        <p class="video-description">{{ video.snippet.description }}</p>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
const config = useRuntimeConfig();

const props = defineProps<{
    searchQuery: string
}>();

const videos = ref([]);

const searchYoutube = async (query: string) => {
    if (!query) return;

    try {
        const API_KEY = config.public.YOUTUBE_API_KEY;
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${API_KEY}&maxResults=6&type=video`
        );
        const data = await response.json();
        videos.value = data.items;
    } catch (error) {
        console.error('YouTube API 에러:', error);
    }
};

watch(() => props.searchQuery, (newQuery) => {
    if (newQuery) {
        searchYoutube(newQuery);
    }
});
</script>

<style scoped>
.youtube-container {
    padding: 20px;
    border-radius: 12px;
    margin-top: 20px;
}

.youtube-title {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 20px;
}

.videos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.video-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.video-card:hover {
    transform: translateY(-4px);
}

.video-link {
    text-decoration: none;
    color: inherit;
}

.video-thumbnail {
    width: 100%;
    height: 180px;
    object-fit: cover;
}

.video-info {
    padding: 12px;
}

.video-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #1a1a1a;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.channel-title {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 8px;
}

.video-description {
    font-size: 0.8rem;
    color: #666;
    /* 3줄로 제한 */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

@media (max-width: 768px) {
    .videos-grid {
        grid-template-columns: 1fr;
    }
}
</style>