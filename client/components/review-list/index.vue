<template>
    <div>
        <div class="reviews__row reviews__row-flex" v-if="isLoadingReviews">
            <loader class="loader"/>
        </div>

        <div v-else>
            <div
                class="reviews__row"
                v-for="review in reviewsWithPagination"
                :key="review.id"
            >
                <div class="reviews__main">
                    <review-common :review="review"/>
                    <nuxt-link :to="`/review/${review.id}`">
                        Читать весь отзыв
                    </nuxt-link>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
    import reviewCommon from '../review-common';
    import loader from '../loader'
    import { storeToRefs } from "pinia";
    import {useReviewStore} from "~/store/review";
    import {useCurrentSkuStore} from "~/store/currentSku";

    const reviewStore = useReviewStore();
    const currentSkuStore = useCurrentSkuStore();
    const { reviewsWithPagination, isLoadingReviews } = storeToRefs(reviewStore);
    const { currentSkuId } = storeToRefs(currentSkuStore);

    watch(currentSkuId, () => reviewStore.loadReviewsWithPagination());

    onMounted(async ()=> await reviewStore.loadReviewsWithPagination());
</script>

<style lang="scss" scoped>
.loader {
    width: 100px;
    height: 100px;
}

.reviews {
    &__row {
        margin-top: 34px;
        padding: 20px 48px 20px 0;
        width: 100%;

        &-flex {
            display: flex;
            justify-content: center;
        }
    }

    &__main {
        position: relative;
        width: 100%;
        padding-left: 48px;
        display: inline-block;
        vertical-align: top;
    }
}


@media (max-width: 900px) {
    .reviews__row {
        margin-top: 24px;
        padding: 20px 24px 20px 0;
    }
}

@media (max-width: 700px) {
    .reviews {
        &__row {
            margin-top: 14px;
            padding: 20px 0;
        }

        &__main {
            padding: 0;
        }
    }
}
</style>