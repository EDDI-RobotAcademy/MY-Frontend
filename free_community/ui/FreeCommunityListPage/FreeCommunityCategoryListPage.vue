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
import { useFreeCommunityStore } from '../../stores/free_communityStore'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()  
const props = defineProps<{
    modelValue: number | null
}>()

const emit = defineEmits(['update:modelValue', 'categoryContentLoaded'])

const free_communityStore = useFreeCommunityStore()
const categories = ref<{ categoryId: number; name: string }[]>([])

const fetchCategories = async () => {
    try {
        categories.value = await free_communityStore.getCategories()
        const categoryFromQuery = route.query.category
        if (categoryFromQuery) {
            const categoryId = Number(categoryFromQuery)
            selectCategory(categoryId)
        }
    } catch (error) {
        console.error('카테고리를 가져오는 중 오류 발생:', error)
    }
}

const selectCategory = async (categoryId: number) => {
    router.push({
        query: { ...route.query, category: categoryId.toString() }
    })

    emit('update:modelValue', categoryId)
    try {
        const response = await free_communityStore.getCategoriesContent(categoryId)

        let dataToProcess = response;
        if (response && response.data !== undefined) {
            dataToProcess = response.data;
        }

        let filteredContent = [];
        if (Array.isArray(dataToProcess)) {
            filteredContent = dataToProcess.filter(
                (item: any) => item.categoryFreeCommunityId === categoryId
            );
        } else if (typeof dataToProcess === 'object' && dataToProcess !== null) {
            filteredContent = [dataToProcess].filter(
                (item: any) => item.categoryFreeCommunityId === categoryId
            );
        }

        emit('categoryContentLoaded', filteredContent)
    } catch (error) {
        console.error('카테고리 내용을 가져오는 중 오류 발생:', error)
        emit('categoryContentLoaded', [])
    }
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
    background-color: #c9c9c9;
    color: white;
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 20px;
}

.category-button.selected,
.category-button:hover {
    background-color: #ff9033;
}
</style>