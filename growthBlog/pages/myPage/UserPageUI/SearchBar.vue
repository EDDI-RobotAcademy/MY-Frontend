<template>
  <div class="search-bar">
    <input 
      type="text" 
      :placeholder="placeholder"
      v-model="searchText"
      @input="handleSearch"
    >
  </div>
  <div class="content-list">
    <div v-for="post in filteredPosts" :key="post.id">
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  posts: {
      type: Array,
      default: () => []
  },
  placeholder: {
      type: String,
      default: '검색어를 입력하세요'
  }
});

const searchText = ref('');

const filteredPosts = computed(() => {
  if (!searchText.value.trim()) {
      return props.posts;
  }
  
  const query = searchText.value.toLowerCase().trim();
  return props.posts.filter(post => {
      return post.title?.toLowerCase().includes(query);
  });
});

const emit = defineEmits(['filtered-posts']);

const handleSearch = () => {
  emit('filtered-posts', filteredPosts.value);
};
</script>

<style scoped>
.search-bar {
  margin-bottom: 40px;
}

.search-bar input {
  width: 100%;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 4px;
  font-size: 14px;
}

.search-bar input::placeholder {
  color: #aaa;
}

.content-list {
  margin-top: 20px;
}
</style>