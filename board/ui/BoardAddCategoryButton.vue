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