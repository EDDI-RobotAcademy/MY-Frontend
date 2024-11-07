<template>
  <div class="add-category-container">
    <button @click="showForm = true" v-if="!showForm" class="add-category-btn">카테고리 추가</button>
    <div v-else class="add-category-form">
      <input v-model="newCategory" placeholder="새 카테고리 이름" />
      <button @click="addCategory" class="confirm-btn">추가</button>
      <button @click="showForm = false" class="cancel-btn">취소</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFreeCommunityStore } from '../../stores/freeCommunityStore'

const freeCommunityStore = useFreeCommunityStore()
const showForm = ref(false)
const newCategory = ref('')

const addCategory = async () => {
  if (newCategory.value) {
    const message = await freeCommunityStore.addCategory(newCategory.value)
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

<style scoped>
.add-category-container {
  display: flex;
  align-items: center;
}

.add-category-btn,
.confirm-btn,
.cancel-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-category-btn {
  background-color: #e74c3c;
  color: white;
}

.add-category-form {
  display: flex;
  gap: 10px;
}

.add-category-form input {
  padding: 8px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
}

.confirm-btn {
  background-color: #2ecc71;
  color: white;
}

.cancel-btn {
  background-color: #95a5a6;
  color: white;
}

.add-category-btn:hover,
.confirm-btn:hover,
.cancel-btn:hover {
  opacity: 0.9;
}
</style>