<template>
    <div class="posts-section">
        <PostItem v-for="post in posts" :key="post.id" :post="post" :format-date="formatDate" />
    </div>
</template>

<script setup>
import PostItem from './PostItem.vue';

defineProps({
    posts: {
        type: Array,
        default: () => []
    },
    formatDate: {
        type: Function,
        required: true
    }
});
</script>

<style scoped>
.posts-section {
    flex: 1;
}
</style>