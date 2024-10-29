<template>
    <v-card v-if="channelData" class="mb-6 channel-card">
        <v-card-item>
            <template v-slot:prepend>
                <v-avatar size="large" rounded="0">
                    <v-img :src="channelData.snippet?.thumbnails?.default?.url" :alt="channelData.snippet?.title" />
                </v-avatar>
            </template>
            <v-card-title>{{ channelData.snippet?.title }}</v-card-title>
            <v-card-subtitle>{{ channelData.snippet?.description }}</v-card-subtitle>
        </v-card-item>
        <v-card-text v-if="channelData.statistics">
            <v-row>
                <v-col v-for="(stat, index) in statistics" :key="index" cols="12" sm="4">
                    <div class="stat-box">
                        <div class="stat-label">{{ stat.label }}</div>
                        <div class="stat-value">{{ formatNumber(stat.value) }}</div>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{
    channelData: any
}>()

const statistics = computed(() => [
    { label: '구독자', value: props.channelData.statistics.subscriberCount },
    { label: '총 조회수', value: props.channelData.statistics.viewCount },
    { label: '동영상 수', value: props.channelData.statistics.videoCount }
])

const formatNumber = (num: string | number) => {
    return new Intl.NumberFormat('ko-KR').format(Number(num))
}
</script>