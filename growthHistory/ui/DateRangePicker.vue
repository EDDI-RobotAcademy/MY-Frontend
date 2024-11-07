<template>
    <v-card class="mb-4 date-picker-card">
        <v-card-item> <!-- v-card-title 대신 v-card-item 사용 -->
            <v-card-title class="text-subtitle-1">기간 설정</v-card-title>
        </v-card-item>
        <v-card-text>
            <div class="d-flex align-center justify-center gap-4">
                <input type="date" v-model="startDateModel" class="date-input" />
                <span class="date-separator">~</span>
                <input type="date" v-model="endDateModel" class="date-input" />
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

const props = defineProps<{
    startDate: string
    endDate: string
    isLoading: boolean
}>()

const emit = defineEmits<{
    (e: 'update:startDate', value: string): void
    (e: 'update:endDate', value: string): void
    (e: 'fetch'): void
}>()

const startDateModel = computed({
    get: () => props.startDate,
    set: (value) => {
        emit('update:startDate', value)
        emit('fetch')
    }
})

const endDateModel = computed({
    get: () => props.endDate,
    set: (value) => {
        emit('update:endDate', value)
        emit('fetch')
    }
})
</script>

<style scoped>
.date-picker-card {
    max-width: 1200px;
    margin: 0 auto;
    width: 90%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.date-input {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 14px;
    outline: none;
    background: transparent;
    width: 142px;
}

.date-input:focus {
    border-color: #1976d2;
}

.date-separator {
    font-size: 16px;
    color: #666;
    margin: 0 8px;
}

.v-card-text {
    flex-grow: 1;
    /* 남은 공간 채우기 */
    display: flex;
    align-items: center;
}
</style>