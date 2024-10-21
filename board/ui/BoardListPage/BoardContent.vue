<template>
    <div class="board-content">
      <h2>게시글 목록</h2>
      <ul v-if="posts.length > 0">
        <li v-for="post in posts" :key="post.id" class="post-item">
          <h3>{{ post.title }}</h3>
          <p>{{ post.content.substring(0, 100) }}...</p>
          <div class="post-meta">
            <span>작성자: {{ post.author }}</span>
            <span>작성일: {{ new Date(post.createdAt).toLocaleDateString() }}</span>
          </div>
        </li>
      </ul>
      <p v-else>게시글이 없습니다.</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  
  // 임시로 게시글 데이터를 생성하는 함수
  const generateDummyPosts = () => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `게시글 제목 ${i + 1}`,
      content: `이것은 게시글 ${i + 1}의 내용입니다. 실제 게시글은 더 길고 자세한 내용을 포함할 것입니다.`,
      author: `사용자${i + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    }));
  };
  
  const posts = ref([]);
  
  onMounted(() => {
    posts.value = generateDummyPosts();
  });
  </script>
  
  <style scoped>
  .board-content {
    padding: 20px;
  }
  
  .post-item {
    border-bottom: 1px solid #eee;
    padding: 15px 0;
  }
  
  .post-item h3 {
    margin: 0 0 10px 0;
    color: #333;
  }
  
  .post-item p {
    margin: 0 0 10px 0;
    color: #666;
  }
  
  .post-meta {
    font-size: 0.8em;
    color: #999;
  }
  
  .post-meta span {
    margin-right: 15px;
  }
  </style>