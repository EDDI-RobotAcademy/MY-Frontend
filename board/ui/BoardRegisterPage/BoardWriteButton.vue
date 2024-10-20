<template>
    <button @click="register" :disabled="!isValid">글 등록</button>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  interface PostData {
    writer: string;
    title: string;
    content: string;
    category_id: number | null;
  }
  
  const props = defineProps<{
    postData: PostData;
  }>();
  
  const emit = defineEmits<{
    (e: 'register', data: PostData): void;
  }>();
  
  const isValid = computed(() => {
    return props.postData.writer && 
           props.postData.title && 
           props.postData.content && 
           props.postData.category_id !== null;
  });
  
  const register = () => {
    if (isValid.value) {
      emit('register', props.postData);
    }
  };
  </script>
  
  <style scoped>
  button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 15px;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  </style>