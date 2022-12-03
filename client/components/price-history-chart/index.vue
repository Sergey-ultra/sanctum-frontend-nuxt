<template>

        <apexchart
            type="line"
            :options="chartOptions"
            :series="series"
            width="100%"
            height="100%"
        ></apexchart>

</template>


<script setup>

const props = defineProps({
    chartData: {
        type: Array,
        default: () => [{
            date: 0,
            avg: 0,
            min: 0,
            max: 0,
        }]
    }
});


const chartOptions = {
    chart: {
        id: "vuechart-example",
    },
    xaxis: {
        type: 'datetime'
    },
    stroke: {
        curve: 'smooth',
        lineCap: 'round',
        width: 2
    }
}

const series = computed(() => [
    {
        name: "Максимальная",
        data: props.chartData.map(el => {
            return {
                x: new Date(el.date).getTime(),
                y: el.max
            }
        }),
    }
]);

</script>

<style scoped>

</style>