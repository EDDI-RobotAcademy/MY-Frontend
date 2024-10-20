<template>
    <div class="influencer-analysis">
        <h1 class="title">인플루언서 분석 결과</h1>
        <div class="profile-section">
            <div class="profile-image">
                <img :src="influencerData.profileImage" alt="Profile" />
            </div>
            <div class="profile-info">
                <h2>{{ influencerData.name }}</h2>
                <p>구독자 {{ formatNumber(influencerData.followers) }} 동영상 {{ formatNumber(influencerData.posts) }} 총재생수 {{
                    formatNumber(influencerData.allviewcount) }}</p>
            </div>
        </div>
        <p class="description">{{ influencerData.description }}</p>
        <h3>인기 영상 순위</h3>
        <a v-for="(comment, index) in influencerData.topComments" :key="index" :href="comment.videoUrl" target="_blank"
            rel="noopener noreferrer" class="comment-box">
            <div class="comment-image">
                <img :src="comment.imageUrl" :alt="`Comment image ${index + 1}`" />
            </div>
            <div class="comment-content">
                <p>{{ comment.text }}</p>
                <div class="comment-stats">
                    <span>재생 {{ formatNumber(comment.views) }}</span>
                    <span>좋아요 {{ formatNumber(comment.likes) }}</span>
                    <span>댓글 {{ formatNumber(comment.comments) }}</span>
                </div>
            </div>
        </a>
        <p class="footer">{{ influencerData.name }}처럼 다양한 콘텐츠를 제작하고, 자신만의 스타일과 경험을 바탕으로 친숙한 이야기를 나누는 콘텐츠를 제작하세요.</p>
        <button @click="$emit('backToSearch')" class="back-button">새 검색</button>
    </div>
</template>

<script>
export default {
    name: 'InfluencerAnalysisResultPage',
    props: {
        influencerData: {
            type: Object,
            required: true,
        },
    },
    methods: {
        formatNumber(num) {
            return new Intl.NumberFormat('ko-KR').format(num);
        },
    },
};
</script>

<style scoped>
.influencer-analysis {
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.title {
    text-align: center;
    font-size: 24px;
    margin-top: 20px;
    margin-bottom: 20px;
}

.profile-section {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.profile-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 20px;
}

.profile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.profile-info h2 {
    margin: 0;
    font-size: 20px;
}

.description {
    margin-bottom: 20px;
}

.comment-box {
    display: flex;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
}

.comment-image {
    width: 100px;
    height: 100px;
    margin-right: 10px;
}

.comment-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.comment-content {
    flex: 1;
}

.comment-stats {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #666;
}

.footer {
    margin-top: 20px;
    font-style: italic;
}

.back-button {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.back-button:hover {
    background-color: #45a049;
}

.comment-box {
    display: flex;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
    text-decoration: none;
    color: inherit;
    transition: background-color 0.3s;
}

.comment-box:hover {
    background-color: #f5f5f5;
}
</style>
