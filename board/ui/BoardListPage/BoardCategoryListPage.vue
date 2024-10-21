<template>
    <nav class="category-nav">
        <ul class="category-buttons">
            <li v-for="category in categories" :key="category.categoryId">
                <button class="category-button" :class="{ 'selected': modelValue === category.categoryId }"
                    @click="selectCategory(category.categoryId)">
                    {{ category.name }}
                </button>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBoardStore } from '../../stores/boardStore'

const props = defineProps<{
    modelValue: number | null
}>()

const emit = defineEmits(['update:modelValue'])

const boardStore = useBoardStore()
const categories = ref<{ categoryId: number; name: string }[]>([])

const fetchCategories = async () => {
    try {
        categories.value = await boardStore.getCategories()
    } catch (error) {
        console.error('카테고리를 가져오는 중 오류 발생:', error)
    }
}

const selectCategory = (categoryId: number) => {
    emit('update:modelValue', categoryId)
}

onMounted(fetchCategories)
</script>

<style scoped>
.category-nav {
    flex: 1;
    overflow-x: auto;
}

.category-buttons {
    display: flex;
    list-style-type: none;
    padding: 0;
    margin: 0;
    gap: 10px;
}

.category-button {
    background-color: #3498db;
    color: white;
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 20px;
}

.category-button.selected,
.category-button:hover {
    background-color: #2980b9;
}
</style>