<template>
    <div>
        <div class="reviews__row reviews__row-flex" v-if="isLoadingReviews">
            <loader class="loader"/>
        </div>

        <div v-else>
            <div
                class="reviews__row"
                v-for="item in reviewsWithPagination"
                :key="item.id"
            >
                <review :review="item"/>
            </div>
        </div>
    </div>

</template>

<script setup>
    import review from "./review";
    import loader from '../loader'
    import { storeToRefs } from "pinia";
    import {useReviewStore} from "../../store/review";
    import {useCurrentSkuStore} from "../../store/currentSku";

    const reviewStore = useReviewStore();
    const currentSkuStore = useCurrentSkuStore();
    const { reviewsWithPagination, isLoadingReviews } = storeToRefs(reviewStore);
    const { currentSkuId } = storeToRefs(currentSkuStore);

    //const toggleShowComments = () => isShowComments.value = !isShowComments.value;

    watch(currentSkuId, () => reviewStore.loadReviewsWithPagination());

    onMounted(async ()=> await reviewStore.loadReviewsWithPagination());
</script>

<style lang="scss" scoped>
    .reviews__row {
        margin-top: 34px;
        padding:20px 48px 20px 0;
        width: 100%;
        &-flex {
            display:flex;
            justify-content: center;
        }
    }
    .loader {
        width: 100px;
        height: 100px;
    }
    @media (max-width: 900px) {
        .reviews__row {
            margin-top: 24px;
            padding: 20px 24px 20px 0;
        }
    }
    @media (max-width: 700px) {
        .reviews__row {
            margin-top: 14px;
            padding: 20px 0;
        }
    }
</style>