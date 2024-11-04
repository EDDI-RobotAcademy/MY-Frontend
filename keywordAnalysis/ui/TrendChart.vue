<template>
  <div class="chart-container">
    <Line 
      v-if="chartData.datasets.length" 
      :data="chartData" 
      :options="chartOptions"
    />
  </div>
</template>


<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface TrendData {
  period: string;
  ratio: number;
}

interface DataLabResult {
  title: string;
  data: TrendData[];
}

const props = defineProps<{
  title: string;
  results: DataLabResult[];
}>();

const chartData = computed(() => ({
  labels: props.results[0]?.data.map(item => item.period) || [],
  datasets: props.results.map((result, index) => ({
    label: result.title,
    data: result.data.map(item => item.ratio),
    fill: false,
    borderColor: `hsl(${index * 137.5}, 70%, 50%)`,
    tension: 0.1
  }))
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: props.title,
      font: {
        size: 16,
        weight: 'bold'
      }
    }
  },
  scales: {
    y: {
      type: 'linear' as const,
      beginAtZero: true,
      ticks: {
        callback: function(value: any) {
          return value + '%';
        }
      }
    },
    x: {
      type: 'category' as const,
      ticks: {
        autoSkip: true,
        maxRotation: 45
      }
    }
  }
};
</script>


<style scoped>
.chart-container {
  position: relative;
  height: 400px;
}
</style>