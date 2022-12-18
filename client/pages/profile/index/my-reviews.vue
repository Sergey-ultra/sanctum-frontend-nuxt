<template>
    <div class="reviews">
        <reviewsAnswersNav></reviewsAnswersNav>
        <div class="loader__wrapper" v-if="isLoadingMyReviews">
            <loader class="loader"></loader>
        </div>
        <div class="wrapper" v-else>
            <h4 v-if="!myReviews.length">
               У вас пока нет отзывов
            </h4>
            <my-review
                    :review="review"
                    class="item"
                    v-for="(review, index) in myReviews"
                    :key="index"
            />
        </div>
    </div>
</template>

<script setup>
    import reviewsAnswersNav from "~/components/profile/reviewsAnswersNav";
    import myReview from "~/components/profile/my-review";
    import loader from "~/components/loader";
    import { storeToRefs } from "pinia";
    import {useReviewStore} from "~/store/review";

    const reviewStore = useReviewStore();
    const { isLoadingMyReviews, myReviews } = storeToRefs(reviewStore);

    const setSEO = () => {
        const title = `Мои отзывы`;
        const metaName = `${title} Smart-Beautiful - агрегатор цен косметических товаров`;
        useHead({
            title,
            meta: [
                {name: 'description', content: metaName},
                {name: 'keywords', content: metaName}
            ],
        });
    }

    setSEO();


    onMounted(() => {
        reviewStore.loadMyRatingsWithReviews();
    });
</script>

<style lang="scss" scoped>
    .loader {
        width: 100px;
        height: 100px;
        &__wrapper {
            display: flex;
            justify-content: center;
            align-items:center;
        }
    }
</style>
