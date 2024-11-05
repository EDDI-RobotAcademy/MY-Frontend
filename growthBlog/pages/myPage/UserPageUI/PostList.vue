<template>
    <div class="posts-section">
        <div class="posts-item">
            <PostItem v-for="post in posts" :key="post.id" :post="post" :format-date="formatDate"
            @click="goToReadPage(post.id)" />
        </div>
    </div>
</template>

<script setup>
import PostItem from './PostItem.vue';
import { useRouter } from 'vue-router'; // Add router import

const router = useRouter(); // Initialize router

const goToReadPage = (id) => { // Removed TypeScript type annotation since setup isn't using TypeScript
    router.push({ name: 'growthBlogRead-page', params: { id } });
};

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

.posts-item:hover {
    cursor: pointer;
}
</style>