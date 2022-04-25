<template>
  <DoughnutChart
    :chart-data="data"
    :options="options"
    css-classes="chart-container"
  />
</template>

<script setup>
import pattern from "patternomaly"
import { ref, computed } from "vue"
import { DoughnutChart } from "vue-chart-3"
import { Chart, DoughnutController, ArcElement } from "chart.js"
Chart.register(DoughnutController, ArcElement)
const dataValues = ref([30, 70])
const data = computed(() => ({
  labels: ["Free", "Not free"],
  datasets: [
    {
      data: dataValues.value,
      backgroundColor: pattern.generate(["#859900", "#d33682"])
    }
  ]
}))
const options = ref({
  plugins: {
    title: {
      text: "Doughnut"
    }
  }
})
</script>
