<template>
    <Line
        :chart-options="chartOptions"
        :chart-data="chartData"

    />
</template>

<script setup>
import {Line} from 'vue-chartjs'
import {Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
    chartData: {
        type: Array,
        default: () => [{
            date: 0,
            count: 0,
            min: 0,
            max: 0,
        }]
    }
});
</script>

<style scoped>

</style>