<template>
    <div class="keyword-input-wrapper">
        <input :value="keywords[0]" @input="updateKeyword(($event.target as HTMLInputElement).value)"
            class="search-input" placeholder="검색어를 입력하세요" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    keywords: string[];
}>();

const emit = defineEmits<{
    'update:keywords': [value: string[]];
}>();

const updateKeyword = (value: string) => {
    emit('update:keywords', [value]);
};
</script>

<style scoped>
.keyword-input-wrapper {
    display: inline-flex;
    flex: 1;
}

.search-input {
    flex: 1;
    height: 35px;
    padding: 0 16px;
    background-color: #fff;
    color: #000;
    border: none;
    border: 1px solid #ccc;
    border-radius: 8px;
}
</style>