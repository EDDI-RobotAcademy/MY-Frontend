<template>
    <button @click="goToWritePage" :disabled="!selectedCategoryId">
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