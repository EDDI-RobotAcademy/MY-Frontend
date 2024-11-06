<template>
    <div>
        <div class="keyword-container">
            <button v-for="i in 20" :key="i" class="keyword-button" @click="handleKeywordClick(keywords[i])">
                {{ keywords[i] }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useKeywordAnalysisStore } from '../stores/keywordAnalysisStore';

const emit = defineEmits(['keyword-selected']);
const keywordAnalysisStore = useKeywordAnalysisStore();
const keywords = ref({});
const selectedKeyword = ref('');

const handleKeywordClick = (keyword: string) => {
    selectedKeyword.value = keyword;
    emit('keyword-selected', keyword);
};

onMounted(async () => {
    try {
        const result = await keywordAnalysisStore.requestTrendKeywordToDjango();
        keywords.value = result;
        console.log("response 출력", result);
    } catch (error) {
        console.error("Error fetching keywords:", error);
    }
});
</script>

<style scoped>
.keyword-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 20px;
}

.keyword-button {
    background-color: #121212;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
}

.keyword-button:hover {
    background-color: #444444;
}
</style>