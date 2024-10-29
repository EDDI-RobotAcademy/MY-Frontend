<template>
    <div class="sort-dropdown">
        <select v-model="selectedSort" @change="handleSort" class="sort-select">
            <option value="date">최신순</option>
            <option value="views">인기순</option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedSort = ref('date');

const emit = defineEmits<{
    (e: 'sort', value: string): void
}>();

const handleSort = () => {
    emit('sort', selectedSort.value);
};
</script>

<style scoped>
.sort-dropdown {
    display: inline-block;
    margin: 10px 0;
}

.sort-select {
    appearance: none;
    background-color: #ff9033;
    color: white;
    padding: 8px 32px 8px 16px;
    border: none;
    border-radius: 4px;
    font-size: 0.9em;
    cursor: pointer;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 16px;
    min-width: 80px;
}

.sort-select:hover {
    background-color: #e67e22;
}

.sort-select:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.sort-select option {
    background-color: white;
    color: #333;
    padding: 8px;
}
</style>