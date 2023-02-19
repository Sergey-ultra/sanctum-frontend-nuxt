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
                    :item="review"
                    class="item"
                    v-for="(review, index) in myReviews"
                    :key="index"
            />
            <pagination
                v-if="myReviews.length && myReviewsLastPage > 1"
                v-model:currentPage="currentPageLocal"
                :lastPage="myReviewsLastPage"
            />
        </div>
    </div>
</template>

<script setup>
    import pagination from '../../../components/pagination'
    import reviewsAnswersNav from "~/components/profile/reviewsAnswersNav";
    import loader from "~/components/loader";
    import myReview from "~/components/profile/my-review";
    import { storeToRefs } from "pinia";
    import {useReviewStore} from "~/store/review";

    const reviewStore = useReviewStore();
    const { isLoadingMyReviews, myReviews, myReviewsOptions, myReviewsLastPage } = storeToRefs(reviewStore);

    let router =  useRouter();
    let route =  useRoute();
    const setPageQuery = value => {
        const query = {...route.query}

        if (value > 1) {
            query.page = value
        } else if (value === 1) {
            delete query.page
        }
        router.push({query})
    };

    const currentPageLocal = computed({
        get() {
            return myReviewsOptions.value.currentPage;
        },
        set(value) {
            setPageQuery(value);
        }
    });

    watch(
        () => ({params: route.query}),
        async (value) => {
            reviewStore.setMyReviewsOptionsByQuery(value.query);
            await reviewStore.loadMyRatingsWithReviews();
        },
        {deep: true}
    );

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


    onMounted(async () => {
        reviewStore.setMyReviewsOptionsByQuery(route.query);
        await reviewStore.loadMyRatingsWithReviews();
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
