<template>
  <div class="search-bar">
    <select v-model="searchType" class="search-type">
      <option value="title">제목</option>
      <option value="content">내용</option>
      <option value="nickname">닉네임</option>
    </select>
    <input type="text" placeholder="검색어를 입력해주세요." v-model="searchQuery" class="search-bar input">
    <button class="search-button" @click="performSearch">검색</button>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'

const searchQuery = ref('')
const searchType = ref('title')  // 기본 검색 유형은 'title'로 설정
const emit = defineEmits(['search'])

const performSearch = () => {
  emit('search', { query: searchQuery.value, type: searchType.value })
}
</script>
  
  <style scoped>
  .search-bar {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .search-type {
  padding: 8px 12px;
  border: none;
  border-radius: 4px 0 0 4px;
  background-color: #ffffff;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  margin-right: -1px;
}
  
  .search-bar input {
    padding: 8px 12px;
    border: none;
    border-radius: 4px 0 0 4px;
    background-color: white;
    color: black;
    font-size: 14px;
  }
  
  .search-button {
    padding: 8px 16px;
    background-color: #ff9033;
    color: white;
    border: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    font-size: 14px;
  }
  
  .search-button:hover {
    background-color: #ffb04c;
  }
  </style>