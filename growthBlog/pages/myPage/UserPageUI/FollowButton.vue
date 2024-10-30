<template>
  <button class="follow-button" :class="{
    'is-following': growthBlogStore.isFollowing,
    'is-loading': growthBlogStore.isLoading
  }" @click="handleClick" :disabled="growthBlogStore.isLoading">
    {{ buttonText }}
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { useGrowthBlogStore } from '~/growthBlog/stores/growthBlogStore';

const growthBlogStore = useGrowthBlogStore();

const emit = defineEmits(['follow', 'unfollow']);

const buttonText = computed(() => {
  if (growthBlogStore.isLoading) return '처리중...';
  return growthBlogStore.isFollowing ? '언팔로우' : '팔로우';
});

const handleClick = () => {
  if (growthBlogStore.isLoading) return;

  if (growthBlogStore.isFollowing) {
    emit('unfollow');
  } else {
    emit('follow');
  }
};
</script>

<style scoped>
.follow-button {
  padding: 8px 48px;
  border: 1px solid #12b886;
  border-radius: 25px;
  background-color: white;
  color: #12b886;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.follow-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.follow-button:hover:not(:disabled) {
  background-color: #12b886;
  color: white;
}

.follow-button.is-following {
  background-color: #12b886;
  color: white;
}

.follow-button.is-following:hover:not(:disabled) {
  background-color: #e03131;
  border-color: #e03131;
  content: "언팔로우";
}

.follow-button.is-loading {
  cursor: wait;
}
</style>