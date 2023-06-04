<template>
    <div class="percentage">
        <div v-for="percent in percentage" :key="percent.rating" class="percentage__item">
            <div class="percentage__stars">
                <span class="star" v-for="star in Array.from({length: percent.rating})" :key="star"></span>
            </div>
            <div class="percentage__progress">
                <div class="percentage__progress-active" :style="{width:`${percent.count_percent}%`}"></div>
            </div>
        </div>
    </div>
</template>
<script setup>
    const props = defineProps({
        percentage: {
            type: Array,
            default: () => []
        }
    })
</script>
<style scoped lang="scss">
.percentage {
    &__item {
        display: flex;
        align-items: center;
    }
    &__stars {
        width: 75px;
        display: flex;
        justify-content: flex-end;
        margin-right: 5px;
    }
    &__progress {
        position:relative;
        height: 6px;
        border-radius: 3px;
        width: 250px;
        background-color: gray;

       &-active {
           border-top-left-radius: 3px;
           border-bottom-left-radius: 3px;
           background-color: #fcb166;
           position: absolute;
           height: 100%;
           top: 0;
           left:0;
           overflow:hidden;
       }
    }
}
.star {
    display: inline-block;
    width: 15px;
    position:relative;
    &::before {
        content:"★";
        display: inline-block;
        color: #ffda66;
    }
}
</style>
