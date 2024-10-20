<template>
    <button @click="goToWritePage" class="write-button">글쓰기</button>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const goToWritePage = () => {
    router.push('/board/create');
  };
  </script>
  
  <style scoped>
  .write-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;
  }
  
  .write-button:hover {
    background-color: #0056b3;
  }
  </style>