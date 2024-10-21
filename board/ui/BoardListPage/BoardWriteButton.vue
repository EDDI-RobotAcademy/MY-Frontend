<template>
    <button @click="goToWritePage" :disabled="!selectedCategoryId" class="write-button">
      글쓰기
    </button>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
  
  const props = defineProps<{
    selectedCategoryId: number | null
  }>()
  
  const router = useRouter()
  
  const goToWritePage = () => {
    if (props.selectedCategoryId) {
      router.push({
        path: '/board/register',
        query: { categoryId: props.selectedCategoryId.toString() }
      });
    }
  };
  </script>
  
  <style scoped>
  .write-button {
    background-color: #f39c12;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 4px;
  }
  
  .write-button:hover {
    background-color: #e67e22;
  }
  
  .write-button:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
  </style>