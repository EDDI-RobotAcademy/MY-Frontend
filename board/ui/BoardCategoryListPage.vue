<template>
    <div class="board-category-list">
      <h2>카테고리 목록</h2>
      <p>총 카테고리 수: {{ categories.length }}</p>
      <div class="category-buttons">
        <button 
          v-for="category in categories" 
          :key="category.categoryId"
          class="category-button"
          @click="selectCategory(category)"
        >
          {{ category.name }}
        </button>
      </div>
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
  import { ref, onMounted } from 'vue'
  import { useBoardStore } from '../stores/boardStore'
  
  interface Category {
    categoryId: number;
    name: string;
  }
  
  const boardStore = useBoardStore()
  const categories = ref<Category[]>([])
  const showAddCategoryForm = ref(false)
  const newCategory = ref('')
  
  const fetchCategories = async () => {
    try {
      categories.value = await boardStore.getCategories()
    } catch (error) {
      console.error('카테고리를 가져오는 중 오류 발생:', error)
    }
  }
  
  const selectCategory = (category: Category) => {
    console.log(`선택된 카테고리: ${category.name} (ID: ${category.categoryId})`)
  }
  
  const addCategory = async () => {
    if (newCategory.value) {
      const message = await boardStore.addCategory(newCategory.value)
      console.log("message 출력", message)
      alert(message)
      if (message === '카테고리 생성 완료') {
        newCategory.value = ''
        showAddCategoryForm.value = false
        await fetchCategories()
      }
    }
  }
  
  onMounted(fetchCategories)
  </script>
  
  <style scoped>
  .board-category-list {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .category-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
  }
  
  .category-button,
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
    transition: background-color 0.3s;
  }
  
  .category-button:hover,
  .addCategory__button:hover {
    background-color: #45a049;
  }
  
  .addCategory__form {
    margin-top: 10px;
  }
  
  .addCategory__input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-right: 10px;
  }
  </style>