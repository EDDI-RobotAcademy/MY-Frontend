<template>
  <div class="add-write-container">
    <button @click="goToWritePage" :disabled="!selectedCategoryId" class="write-button">
      글쓰기
    </button>
  </div>
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
.add-write-container {
  display: flex;
  align-items: center;
}

.write-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background-color: #e67e22;
  color: #fff;
}

.write-button:hover {
  background-color: #e67e22;
  transform: translateY(-2px);
}

.write-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}
</style>