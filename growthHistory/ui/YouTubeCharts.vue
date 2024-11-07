<!-- components/YouTubeCharts.vue -->
<template>
  <div class="analytics-charts">
    <!-- 주요 지표 차트 -->
    <v-card class="mb-6">
      <v-card-title>주요 참여 지표</v-card-title>
      <v-card-text>
        <div class="chart-container">
          <Bar :data="engagementChartData" :options="barOptions" />
        </div>
      </v-card-text>
    </v-card>

    <v-row>
      <!-- 구독자 변동 차트 -->
      <v-col cols="12" md="6">
        <v-card class="mb-6">
          <v-card-title>구독자 변동</v-card-title>
          <v-card-text>
            <div class="chart-container">
              <Doughnut :data="subscriberChartData" :options="doughnutOptions" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 카드/주석 성과 차트 -->
      <v-col cols="12" md="6">
        <v-card class="mb-6">
          <v-card-title>카드/주석 성과</v-card-title>
          <v-card-text>
            <div class="chart-container">
              <Bar :data="cardChartData" :options="barOptions" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 시청 시간 차트 -->
    <v-card>
      <v-card-title>시청 시간 분석</v-card-title>
      <v-card-text>
        <div class="chart-container">
          <Bar :data="timeChartData" :options="horizontalBarOptions" />
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js'

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const props = defineProps({
  analyticsData: {
    type: Object,
    required: true
  }
})

// 차트 색상
const colors = {
  blue: '#1a73e8',
  red: '#ea4335',
  green: '#34a853',
  yellow: '#fbbc05',
  purple: '#9334e8',
  orange: '#fa7b17'
}

// 숫자 포맷팅 함수
const formatNumber = (num) => {
  return new Intl.NumberFormat('ko-KR').format(Number(num))
}

// 주요 참여 지표 차트 데이터
const engagementChartData = computed(() => ({
  labels: ['조회수', '좋아요', '댓글', '공유'],
  datasets: [{
    data: [
      props.analyticsData.views,
      props.analyticsData.likes,
      props.analyticsData.comments,
      props.analyticsData.shares
    ],
    backgroundColor: [colors.blue, colors.green, colors.yellow, colors.purple]
  }]
}))

// 구독자 변동 차트 데이터
const subscriberChartData = computed(() => ({
  labels: ['새 구독자', '구독 취소'],
  datasets: [{
    data: [
      props.analyticsData.subscribersGained,
      props.analyticsData.subscribersLost
    ],
    backgroundColor: [colors.green, colors.red]
  }]
}))

// 카드/주석 성과 차트 데이터
const cardChartData = computed(() => ({
  labels: ['노출', '클릭'],
  datasets: [{
    data: [
      props.analyticsData.cardImpressions,
      props.analyticsData.cardClicks
    ],
    backgroundColor: colors.purple
  }]
}))

// 시청 시간 차트 데이터
const timeChartData = computed(() => ({
  labels: ['총 시청시간(시간)', '평균 시청시간(초)'],
  datasets: [{
    data: [
      parseInt(props.analyticsData.watchTime),
      parseInt(props.analyticsData.avgViewDuration)
    ],
    backgroundColor: colors.orange
  }]
}))

// 차트 옵션들
const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => formatNumber(context.raw)
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => `${context.label}: ${formatNumber(context.raw)}명`
      }
    }
  }
}

const horizontalBarOptions = {
  ...barOptions,
  indexAxis: 'y'
}
</script>

<style scoped>
.analytics-charts {
  padding: 16px;
}

.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>