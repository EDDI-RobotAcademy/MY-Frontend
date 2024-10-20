<template>
    <div class="addCategory">
      <div class="addCategory__container">
        <button class="addCategory__button" @click="showAddCategoryForm = true">카테고리 추가</button>
        <div v-if="showAddCategoryForm" class="addCategory__form">
          <input v-model="newCategory" placeholder="새 카테고리 이름" class="addCategory__input" />
          <button @click="addCategory" class="addCategory__button">추가</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useBoardStore } from '../stores/boardStore'
  
  const boardStore = useBoardStore()
  
  const showAddCategoryForm = ref(false)
  const newCategory = ref('')
  
  const addCategory = async () => {
    if (newCategory.value) {
      const message = await boardStore.addCategory(newCategory.value)
      console.log("message 출력", message)
      alert(message)
      if (message === '카테고리 생성 완료') {
        newCategory.value = ''
        showAddCategoryForm.value = false
      }
    }
  }
  </script>
  
  <style scoped>
  .addCategory {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .addCategory__container {
    text-align: center;
  }
  
  .addCategory__form {
    margin-top: 10px;
  }
  
  .addCategory__button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .addCategory__input {
    padding: 10px;
    margin-right: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  </style>