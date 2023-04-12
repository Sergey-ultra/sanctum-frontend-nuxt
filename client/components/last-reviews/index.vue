<template>
    <section class="last-reviews">
         <div class="title">Последние отзывы</div>
        <slider
            :sliderItems="lastReviews"
            class="last-reviews__slider"
        >
            <template v-slot:item="{ item }">
                {{ item }}
            </template>
        </slider>
    </section>
</template>

<script setup>
    import slider from '../slider';
    import {useReviewStore} from "~/store/review";
    import {storeToRefs} from "pinia";
    const reviewStore = useReviewStore();
    const { lastReviews, isLoadingLastReviews } = storeToRefs(reviewStore);

    useAsyncData(async() => await reviewStore.loadLastReviews());
</script>

<style lang="scss" scoped>
    .title {
        font-weight: 500;
        line-height: 32px;
        font-size: 26px;
        color: #222;
        margin-bottom:20px;
        display:block;
    }
    .last-reviews {
        width: 100%;
        min-height: 300px;

        &__slider {
            height: 360px;
            border-radius: 8px;
            background-color: #fff;
            padding: 20px;
        }
    }
</style>