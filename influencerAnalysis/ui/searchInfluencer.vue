<template>
    <div class="container">
        <form class="form" @submit.prevent="searchYouTube">
            <button type="submit">
                <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"
                    aria-labelledby="search">
                    <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                        stroke="currentColor" stroke-width="1.333" stroke-linecap="round" stroke-linejoin="round">
                    </path>
                </svg>
            </button>
            <input class="input" v-model="searchQuery" placeholder="유튜버 이름 입력" type="text">
            <button class="reset" type="reset" @click="resetSearch">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const searchQuery = ref('');
const emit = defineEmits(['searchResult']);

async function searchYouTube() {
    if (!searchQuery.value) return;
    const config = useRuntimeConfig();
    const API_KEY = config.public.YOUTUBE_API_KEY;

    try {
        // 1. Search for the channel first
        const channelResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(searchQuery.value)}&key=${API_KEY}`);
        const channelData = await channelResponse.json();

        if (!channelData.items || channelData.items.length === 0) {
            throw new Error('채널을 찾을 수 없습니다.');
        }

        const channel = channelData.items[0];
        const channelId = channel.id.channelId;

        const channelInfoResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`);
        const channelInfo = await channelInfoResponse.json();

        if (!channelInfo.items || channelInfo.items.length === 0) {
            throw new Error('채널 정보를 가져올 수 없습니다.');
        }

        const channelDetails = channelInfo.items[0];
        
        // 2. Search for videos
        const videosResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&key=${API_KEY}&q=${encodeURIComponent(searchQuery.value)}&maxResults=5`);
        const videosData = await videosResponse.json();

        if (!videosData.items || videosData.items.length === 0) {
            throw new Error('동영상을 찾을 수 없습니다.');
        }

        const videoItems = videosData.items.slice(1);

        const videoIds = videoItems.map(item => item.id.videoId).join(',');
        const videoStatsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${API_KEY}`);
        const videoStatsData = await videoStatsResponse.json();

        if (!videoStatsData.items || videoStatsData.items.length === 0) {
            throw new Error('동영상 통계를 가져올 수 없습니다.');
        }

        const influencerData = {
            name: channelDetails.snippet.title,
            allviewcount: channelDetails.statistics.viewCount,
            followers: channelDetails.statistics.subscriberCount,
            posts: channelDetails.statistics.videoCount,
            description: channelDetails.snippet.description || "설명 없음",
            profileImage: channelDetails.snippet.thumbnails.high.url,
            topComments: videoItems.map((video, index) => ({
                text: video.snippet.title,
                likes: videoStatsData.items[index]?.statistics.likeCount ?? 'N/A',
                comments: videoStatsData.items[index]?.statistics.commentCount ?? 'N/A',
                views: videoStatsData.items[index]?.statistics.viewCount ?? 'N/A',
                imageUrl: video.snippet.thumbnails.medium.url,
                videoUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`
            }))
        };

        
        emit('searchResult', influencerData);
    } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
        emit('searchResult', null);
    }
}

function resetSearch() {
    searchQuery.value = '';
}
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.form {
    --timing: 0.3s;
    --width-of-input: 200px;
    --height-of-input: 40px;
    --border-height: 2px;
    --input-bg: #fff;
    --border-color: #2f2ee9;
    --border-radius: 30px;
    --after-border-radius: 1px;
    position: relative;
    width: var(--width-of-input);
    height: var(--height-of-input);
    display: flex;
    align-items: center;
    padding-inline: 0.8em;
    border-radius: var(--border-radius);
    transition: border-radius 0.5s ease;
    background: var(--input-bg, #fff);
}

.input {
    font-size: 0.9rem;
    background-color: transparent;
    width: 100%;
    height: 100%;
    padding-inline: 0.5em;
    padding-block: 0.7em;
    border: none;
}

.form:before {
    content: "";
    position: absolute;
    background: var(--border-color);
    transform: scaleX(0);
    transform-origin: center;
    width: 100%;
    height: var(--border-height);
    left: 0;
    bottom: 0;
    border-radius: 1px;
    transition: transform var(--timing) ease;
}

.form:focus-within {
    border-radius: var(--after-border-radius);
}

.form:focus-within:before {
    transform: scale(1);
}

.reset {
    border: none;
    background: none;
    opacity: 0;
    visibility: hidden;
}

.input:not(:placeholder-shown)~.reset {
    opacity: 1;
    visibility: visible;
}

.form svg {
    width: 17px;
    height: 17px;
}

.form button {
    border: none;
    background: none;
    color: #8b8ba7;
}
</style>