<template>
    <nav class="category-nav">
        <ul class="category-buttons">
            <li>
                <button class="category-button" :class="{ 'selected': modelValue === null }"
                    @click="selectCategory(null)">
                    전체
                </button>
            </li>
            <li v-for="category in visibleCategories" :key="category.categoryId">
                <button class="category-button" :class="{ 'selected': modelValue === category.categoryId }"
                    @click="selectCategory(category.categoryId)">
                    {{ category.name }}
                </button>
            </li>
            <li v-if="hasMoreCategories" class="more-button-container">
                <button ref="moreButtonRef" class="category-button more-button" @click="toggleMoreCategories">
                    {{ showAllCategories ? '접기' : '더보기' }}
                </button>
                
                <div ref="popupRef" v-if="showAllCategories && hasMoreCategories" class="more-categories-popup">
                    <ul class="more-categories-list">
                        <li v-for="category in hiddenCategories" :key="category.categoryId">
                            <button class="category-button" :class="{ 'selected': modelValue === category.categoryId }"
                                @click="selectCategory(category.categoryId)">
                                {{ category.name }}
                            </button>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, onUnmounted } from 'vue'
import { useFreeCommunityStore } from '../../stores/freeCommunityStore'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const props = defineProps<{
    modelValue: number | null
}>()

const emit = defineEmits(['update:modelValue', 'categoryContentLoaded'])

const freeCommunityStore = useFreeCommunityStore()
const categories = ref<{ categoryId: number; name: string }[]>([])

const showAllCategories = ref(false)
const VISIBLE_CATEGORIES_COUNT = 9 // 전체 버튼 제외하고 9개 표시

const visibleCategories = computed(() => {
    return categories.value.slice(0, VISIBLE_CATEGORIES_COUNT)
})

const hiddenCategories = computed(() => {
    return categories.value.slice(VISIBLE_CATEGORIES_COUNT)
})

const hasMoreCategories = computed(() => {
    return categories.value.length > VISIBLE_CATEGORIES_COUNT
})

const moreButtonRef = ref<HTMLElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)
const toggleMoreCategories = () => {
    showAllCategories.value = !showAllCategories.value
    
    if (showAllCategories.value) {
        nextTick(() => {
            const buttonEl = moreButtonRef.value
            const popupEl = popupRef.value
            
            if (buttonEl && popupEl) {
                const rect = buttonEl.getBoundingClientRect()
                popupEl.style.position = 'fixed'
                popupEl.style.top = `${rect.bottom + 5}px`
                popupEl.style.left = `${rect.left}px`
            }
        })
    }
}

const fetchCategories = async () => {
    try {
        categories.value = await freeCommunityStore.getCategories()
        const categoryFromQuery = route.query.category
        if (categoryFromQuery) {
            const categoryId = Number(categoryFromQuery)
            selectCategory(categoryId)
        } else {
            selectCategory(null)
        }
    } catch (error) {
        console.error('카테고리를 가져오는 중 오류 발생:', error)
    }
}

const selectCategory = async (categoryId: number | null) => {
    emit('update:modelValue', categoryId)
    emit('categoryContentLoaded', []);

    if (categoryId === null) {
        const { category, ...queryWithoutCategory } = route.query
        await router.push({ query: queryWithoutCategory })
    } else {
        await router.push({
            query: { ...route.query, category: categoryId.toString() }
        })
    }

    try {
        // 새로운 카테고리 데이터 요청
        const response = await freeCommunityStore.getCategoriesContent(categoryId);
        
        // 응답이 없거나 빈 배열인 경우 빈 배열 전달
        if (!response || (Array.isArray(response) && response.length === 0) || 
            (response?.data && Array.isArray(response.data) && response.data.length === 0)) {
            emit('categoryContentLoaded', []);
            return;
        }
        
        const contents = Array.isArray(response) ? response : 
                        (response?.data ? response.data : []);
        
        emit('categoryContentLoaded', contents);
    } catch (error) {
        console.error('카테고리 내용을 가져오는 중 오류 발생:', error);
        emit('categoryContentLoaded', []);
    }
};

const handleClickOutside = (event: MouseEvent) => {
    const popupEl = popupRef.value
    const buttonEl = moreButtonRef.value
    
    if (showAllCategories.value && popupEl && buttonEl) {
        if (!popupEl.contains(event.target as Node) && !buttonEl.contains(event.target as Node)) {
            showAllCategories.value = false
        }
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

onMounted(fetchCategories)
</script>

<style scoped>
.category-nav {
    position: relative;
    flex: 1;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.category-nav::-webkit-scrollbar {
    display: none;
}

.category-buttons {
    display: inline-flex;
    list-style-type: none;
    padding: 0;
    margin: 0;
    gap: 10px;
    flex-wrap: nowrap;
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

.more-button {
    background-color: #c9c9c9;
}

.more-button-container {
    position: relative;
}

.more-categories-popup {
    position: fixed;
    top: auto;
    left: auto;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 10px;
    z-index: 1000;
    min-width: 300px;
}

.more-categories-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
}

.more-categories-list .category-button {
    width: 100%;
    text-align: center;
}

.category-buttons > li {
    position: relative;
}
</style>