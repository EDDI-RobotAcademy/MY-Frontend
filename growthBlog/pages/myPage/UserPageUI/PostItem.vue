<template>
    <article class="post-item">
        <h2 class="post-title">{{ post.title }}</h2>
        <div class="post-meta">
            <div class="post-info">
                <span>{{ formatDate(post.regDate) }}</span>
                <span class="separator">·</span>
                <span>{{ post.commentsCount }}개의 댓글</span>
                <span class="separator">·</span>
                <span class="likes">♥ {{ post.likes }}</span>
            </div>
        </div>
    </article>
</template>

<script setup>
defineProps({
    post: {
        type: Object,
        required: true
    },
    formatDate: {
        type: Function,
        required: true
    }
});
</script>

<style scoped>
.post-item {
    padding: 20px 0;
    border-bottom: 1px solid #eee;
}

.post-title {
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 8px;
    color: #212529;
}

.post-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 14px;
}

.post-info {
    color: #868e96;
    display: flex;
    align-items: center;
    gap: 8px;
}

.separator {
    color: #868e96;
}

.likes {
    color: #868e96;
}
</style>