<template>
  <div class="add-category-container">
    <button @click="showForm = true" v-if="!showForm">카테고리 추가</button>
    <div v-else class="add-category-form">
      <input v-model="newCategory" placeholder="새 카테고리 이름" />
      <button @click="addCategory">추가</button>
      <button @click="showForm = false">취소</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBoardStore } from '../../stores/boardStore'

const boardStore = useBoardStore()
const showForm = ref(false)
const newCategory = ref('')

const addCategory = async () => {
  if (newCategory.value) {
    const message = await boardStore.addCategory(newCategory.value)
    alert(message)
    if (message === '카테고리 생성 완료') {
      newCategory.value = ''
      showForm.value = false
      emit('categoryAdded')
    }
  }
}

const emit = defineEmits(['categoryAdded'])
</script>