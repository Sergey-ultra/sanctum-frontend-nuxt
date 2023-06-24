<template>
    <div class="slider" ref="slider">
        <div class="slider__wrapper">
            <button
                v-if="left < 0"
                class="arrow left"
                @click="moveToRight"
            >
                <fa class="icon" icon="arrow-left"></fa>
            </button>
            <button
                v-if="rightSideDiff > 0"
                class="arrow right"
                @click="moveToLeft"
            >
                <fa class="icon" icon="arrow-right"></fa>
            </button>

            <div class="slider__inner" :style="translateX" :class="{'no-transition': currentShiftX !== 0}">

                <div
                    @touchend="isMobileScreen ? mobileEnd() : ''"
                    @touchstart="isMobileScreen ? mobileStart($event) : ''"
                    @touchmove="isMobileScreen ? mobileMove($event) : ''"
                    v-for="(item, index) in sliderItems"
                    :key="index"
                    class="slider__item"
                    ref="sliderItem"

                >
                    <slot
                        name ="item"
                        :item="item"
                        :index="index"
                    ></slot>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
    const props = defineProps({
        sliderItems: {
            type: Array,
            default: () => []
        },
    });

    let slider = ref(null);
    let sliderItem = ref(null);
    const isMobileScreen = ref(false);

    let left = ref(0);
    let shiftX = ref(0);
    let currentShiftX = ref(0);

    let containerWidth = 0;
    let itemWidth = ref(0);

    const translateX = computed(() => `transform: translateX(${left.value + currentShiftX.value}px)`);

    const rightSideDiff = computed(() => {
        const contentWidth = props.sliderItems.length * itemWidth.value;
        return contentWidth + left.value - containerWidth;
    });

    const moveToLeft = () => {
        if (rightSideDiff.value > 0) {
            left.value = left.value - itemWidth.value;
        }
    };

    const moveToRight = () => {
        if (left.value < 0) {
            left.value = left.value + itemWidth.value;
        }
    };


    const mobileStart = (event) => shiftX.value = event.changedTouches[0].pageX;

    const mobileMove  = (event)  => currentShiftX.value = event.changedTouches[0].pageX - shiftX.value;



    const mobileEnd = () => {
        const diff = itemWidth.value * Math.round(currentShiftX.value / itemWidth.value);
        let leftLocal =  left.value + diff;

        if (leftLocal > 0) {
            leftLocal = 0;
        }
        if (leftLocal < -((props.sliderItems.length - 2) * itemWidth.value)) {
            leftLocal = -((props.sliderItems.length - 2) * itemWidth.value);
        }
        left.value = leftLocal;
        currentShiftX.value = 0;
    }


    onMounted(() => {
        if (sliderItem.value && Array.isArray(sliderItem.value) && sliderItem.value) {
            itemWidth.value = sliderItem.value[0].clientWidth
        }
        if (slider.value) {
            containerWidth = slider.value.clientWidth;
            isMobileScreen.value =  document.documentElement.clientWidth < 800;
        }
    });
</script>

<style scoped lang="scss">
.slider {
    height:100%;
    display:block;
    overflow: hidden;
    pointer-events: auto;
    position: relative;
    &__wrapper {
        display: block;
        overflow: hidden;
        height:100%;
    }

    &__inner {
        transition: transform .2s ease-out;
        height: 100%;
        display: flex;
    }

    &__item {
        flex-shrink: 0;
        height: 100%;

        &:not(:last-child) {
            padding-right: 15px;
        }
    }
}

.arrow {
    border: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
    padding: 0;
    width: 40px;
    height: 40px;
    line-height: 40px;
    transition: all .12s ease-out;
    background-color: #fc0;
    cursor: pointer;
    z-index: 2;

    &:hover {
        background-color: #f5c423;
    }
}

.left {
    left: 20px;
}

.right {
    right: 20px;
}

.no-transition {
    transition: none;
}


@media (max-width: 800px) {
    .arrow {
        display: none;
    }
}

@media (max-width: 700px) {
    .journal {
        &__inner {
            padding: 15px;
        }
    }
}

@media (max-width: 400px) {
    .journal {
        &__inner {
            padding: 10px;
        }
    }
}
</style>
