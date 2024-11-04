<template>
  <div class="analysis-card">
    <h2 class="analysis-card-title">{{ title }}</h2>
    <div class="analysis-card-content">
      <component
        :is="chartComponent"
        v-if="chartData.datasets.length"
        :data="chartData"
        :options="chartOptions"
        class="chart-container"
      />
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js'
import { Bar, Pie } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps<{
  title: string;
  chartType: 'pie' | 'bar';
  chartData: {
    labels: string[];
    datasets: any[];
  };
  chartOptions: any;
}>();

const chartComponent = computed(() => {
  return props.chartType === 'pie' ? Pie : Bar;
});
</script>

<style scoped>
.analysis-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.analysis-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.analysis-card-title {
  background-color: #f8f9fa;
  padding: 16px 20px;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e9ecef;
  text-align: left;
}

.analysis-card-content {
  padding: 20px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-container {
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .analysis-card-title {
    font-size: 14px;
    padding: 12px 16px;
  }

  .analysis-card-content {
    padding: 16px;
    height: 250px;
  }
}

@media (max-width: 480px) {
  .analysis-card {
    border-radius: 8px;
  }

  .analysis-card-content {
    padding: 12px;
    height: 200px;
  }
}
</style>