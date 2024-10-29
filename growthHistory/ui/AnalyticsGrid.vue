<template>
    <v-row class="analytics-grid">
        <v-col v-for="(card, index) in statsCards" :key="index" cols="12" md="6">
            <StatsCard :title="card.title" :items="card.items" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import StatsCard from './StatsCard.vue'

const props = defineProps<{
    analyticsData: any
}>()

const formatNumber = (num: string | number) => {
    return new Intl.NumberFormat('ko-KR').format(Number(num))
}

const statsCards = computed(() => [
    {
        title: '시청 관련',
        items: [
            { icon: 'mdi-eye', title: '조회수', value: `${formatNumber(props.analyticsData.views)}회` },
            { icon: 'mdi-clock-outline', title: '총 시청 시간', value: props.analyticsData.watchTime },
            { icon: 'mdi-timer', title: '평균 시청 시간', value: props.analyticsData.avgViewDuration }
        ]
    },
    {
        title: '상호작용',
        items: [
            { icon: 'mdi-thumb-up', title: '좋아요', value: `${formatNumber(props.analyticsData.likes)}개` },
            { icon: 'mdi-comment', title: '댓글', value: `${formatNumber(props.analyticsData.comments)}개` },
            { icon: 'mdi-share', title: '공유', value: `${formatNumber(props.analyticsData.shares)}회` }
        ]
    },
    {
        title: '구독자',
        items: [
            { icon: 'mdi-account-plus', title: '새 구독자', value: `${formatNumber(props.analyticsData.subscribersGained)}명` },
            { icon: 'mdi-account-minus', title: '구독 취소', value: `${formatNumber(props.analyticsData.subscribersLost)}명` }
        ]
    },
    {
        title: '카드/주석',
        items: [
            { icon: 'mdi-card-text', title: '카드 클릭률', value: props.analyticsData.cardClickRate },
            { icon: 'mdi-eye-outline', title: '카드 노출수', value: `${formatNumber(props.analyticsData.cardImpressions)}회` },
            { icon: 'mdi-cursor-pointer', title: '카드 클릭수', value: `${formatNumber(props.analyticsData.cardClicks)}회` }
        ]
    }
])
</script>