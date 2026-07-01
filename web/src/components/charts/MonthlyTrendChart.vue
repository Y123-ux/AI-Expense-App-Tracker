<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler)

const props = defineProps<{
  data: Array<{ month: string; total: number }>
}>()

const chartData = {
  labels: props.data.map((d) => d.month),
  datasets: [
    {
      label: 'Monthly Spending',
      data: props.data.map((d) => d.total),
      borderColor: '#5E244E',
      backgroundColor: 'rgba(94, 36, 78, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#5E244E',
    },
  ],
}

const options = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true } },
}
</script>

<template>
  <Line :data="chartData" :options="options" />
</template>
