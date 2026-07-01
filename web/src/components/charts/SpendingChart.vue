<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps<{
  data: Array<{ category_name: string; total: number; category_color: string }>
}>()

const chartData = {
  labels: props.data.map((d) => d.category_name || 'Uncategorized'),
  datasets: [
    {
      label: 'Spending',
      data: props.data.map((d) => d.total),
      backgroundColor: props.data.map((d) => d.category_color || '#5E244E'),
      borderRadius: 6,
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
  <Bar :data="chartData" :options="options" />
</template>
