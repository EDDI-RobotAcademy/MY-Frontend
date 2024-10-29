<template>
  <button 
    class="write-button"
    @click="handleClick"
  >
    글쓰기
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps<{
  selectedCategoryId?: number | null
}>();

const router = useRouter();

const handleClick = () => {
  router.push({
    path: '/free-community/register',
    query: {
      category: props.selectedCategoryId || null
    }
  });
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
  background-color: #ff9033;
  color: #fff;
}

.write-button:hover {
  background-color: #e67e22;
}

.write-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}
</style>