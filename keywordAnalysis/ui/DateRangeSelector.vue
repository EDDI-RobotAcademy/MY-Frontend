<template>
    <div class="date-range-container">
        <input type="date" :value="startDate"
            @input="$emit('update:startDate', ($event.target as HTMLInputElement).value)" class="date-input" />
        <input type="date" :value="endDate" @input="$emit('update:endDate', ($event.target as HTMLInputElement).value)"
            class="date-input" />
        <select :value="timeUnit" @change="$emit('update:timeUnit', ($event.target as HTMLSelectElement).value)"
            class="time-unit-select">
            <option value="date">일간</option>
        </select>
    </div>
</template>


<script setup lang="ts">
defineProps<{
    startDate: string;
    endDate: string;
    timeUnit: 'date' | 'week' | 'month';
}>();

defineEmits<{
    'update:startDate': [value: string];
    'update:endDate': [value: string];
    'update:timeUnit': [value: 'date' | 'week' | 'month'];
}>();
</script>

<style scoped>
.date-range-container {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.date-input {
    width: 140px;
    height: 35px;
    padding: 0 8px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
}

.time-unit-select {
    width: 80px;
    height: 35px;
    padding: 0 8px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    text-align: center;
}
</style>