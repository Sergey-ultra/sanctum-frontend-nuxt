<template>
    <div>
        <h4 class="title">Популярные бренды</h4>

        <div class="popular-brands" ref="slider">
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

            <div class="popular-brands__inner" :style="translateX" :class="{'no-transition': currentShiftX !== 0}">
                <div
                    @touchend="isMobileScreen ? mobileEnd() : ''"
                    @touchstart="isMobileScreen ? mobileStart($event) : ''"
                    @touchmove="isMobileScreen ? mobileMove($event) : ''"

                    class="popular-brands__item"
                    v-for="(brand, index) in popularBrands"
                    :key="index"
                >
                    <nuxt-link :to="{ name: 'brand-brand_code', params: { brand_code: brand.code }}">
                        <div class="brand__inner">
                            <img
                                v-if="brand.image"
                                v-lazyload
                                :data-src="`${$config.APP_URL}/${brand.image}`"
                            />
                            <span v-else>{{ brand.name }}</span>
                        </div>
                    </nuxt-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {storeToRefs} from "pinia";
    import {useBrandStore} from "../../store/brand";

    const brandStore = useBrandStore();
    const {popularBrands} = storeToRefs(brandStore);



    let slider = ref(null);
    const isMobileScreen = ref(false);

    let left = ref(0);
    let shiftX = ref(0);
    let currentShiftX = ref(0);

    let containerWidth = 0;
    const itemWidth = 160;

    const translateX = computed(() => `transform: translateX(${left.value + currentShiftX.value}px)`);


    const rightSideDiff = computed(() => {
        const contentWidth = popularBrands.value.length * itemWidth;
        return contentWidth + left.value - containerWidth;
    });

    const moveToLeft = () => {
        if (rightSideDiff.value > 0) {
            left.value = left.value - itemWidth;
        }
    };

    const moveToRight = () => {
        if (left.value < 0) {
            left.value = left.value + itemWidth;
        }
    };


    const mobileStart = (event) => shiftX.value = event.changedTouches[0].pageX;

    const mobileMove  = (event)  => currentShiftX.value = event.changedTouches[0].pageX - shiftX.value;



    const mobileEnd = () => {
        const diff = itemWidth * Math.round(currentShiftX.value / itemWidth);
        let leftLocal =  left.value + diff;

        if (leftLocal > 0) {
            leftLocal = 0;
        }
        if (leftLocal < -((popularBrands.value.length - 2) * itemWidth)) {
            leftLocal = -((popularBrands.value.length - 2) * itemWidth);
        }
        left.value = leftLocal;
        currentShiftX.value = 0;
    }


    onMounted(() => {
        if (slider.value) {
            containerWidth = slider.value.clientWidth;
            isMobileScreen.value =  document.documentElement.clientWidth < 800;
        }
    });

    useAsyncData(async () => {
        await brandStore.loadPopularBrands();
    });


</script>

<style scoped lang="scss">
    .title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 16px;
    }

    .popular-brands {
        display:block;
        height: 80px;
        overflow: hidden;
        pointer-events: auto;
        position: relative;

        &__inner {
            transition: transform .2s ease-out;
            white-space: nowrap;
            display: flex;
            flex-shrink: 0;
            flex-wrap: nowrap;
        }
        &__item {
            display:flex;
            align-items: center;
            justify-content: center;
            width: 176px;
            min-width: 160px;
            height: 72px;
            margin-top: 8px;
            border: 1px solid #ebebeb;
            border-radius: 4px;
            background: #fff;
            & a {
                width: 100%;
                height: 100%;
                color: #04b;
                cursor: pointer;
                transition: color .12s ease-out;
                text-decoration: none;
                touch-action: manipulation;
                outline: 0;
            }
        }
    }
    .brand {
        &__inner {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 14px 20px;
            & img {
                max-height: 100%;
                max-width: 100%;
            }
        }
    }
    .arrow {
        border:none;
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
        z-index:2;
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
</style>