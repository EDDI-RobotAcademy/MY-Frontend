<template>
    <v-card class="mb-6">
        <v-card-title>기간 설정</v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="5">
                    <v-text-field v-model="startDateModel" label="시작일" type="date" prepend-icon="mdi-calendar" />
                </v-col>
                <v-col cols="12" sm="5">
                    <v-text-field v-model="endDateModel" label="종료일" type="date" prepend-icon="mdi-calendar" />
                </v-col>
                <v-col cols="12" sm="2">
                    <v-btn color="primary" @click="onFetch" :loading="isLoading" :disabled="!startDateModel || !endDateModel">
                        데이터 조회
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
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
    set: (value) => emit('update:startDate', value)
})

const endDateModel = computed({
    get: () => props.endDate,
    set: (value) => emit('update:endDate', value)
})

const onFetch = () => emit('fetch')
</script>