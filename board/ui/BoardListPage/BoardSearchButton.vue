<template>
    <div class="search-bar">
      <input type="text" placeholder="검색어를 입력해주세요." v-model="searchQuery">
      <button class="search-button" @click="performSearch">검색</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const searchQuery = ref('')
  
  const performSearch = () => {
    // Implement search functionality
    console.log('Searching for:', searchQuery.value)
  }
  </script>
  
  <style scoped>
  .search-bar {
    display: flex;
    align-items: center;
  }
  
  .search-bar input {
    padding: 8px 12px;
    border: none;
    border-radius: 4px 0 0 4px;
    background-color: #ecf0f1;
    color: #34495e;
    font-size: 14px;
  }
  
  .search-button {
    padding: 8px 16px;
    background-color: #2ecc71;
    color: white;
    border: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    font-size: 14px;
  }
  
  .search-button:hover {
    background-color: #27ae60;
  }
  </style>