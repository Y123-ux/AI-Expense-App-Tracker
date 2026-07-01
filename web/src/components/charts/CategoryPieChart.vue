<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  data: Array<{ category_name: string; total: number; category_color: string }>
}>()

const chartData = {
  labels: props.data.map((d) => d.category_name || 'Uncategorized'),
  datasets: [
    {
      data: props.data.map((d) => d.total),
      backgroundColor: props.data.map((d) => d.category_color || '#6B7280'),
      borderWidth: 0,
    },
  ],
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { padding: 16, usePointStyle: true },
    },
  },
}
</script>

<template>
  <Doughnut :data="chartData" :options="options" />
</template>
