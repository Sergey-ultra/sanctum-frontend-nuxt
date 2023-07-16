<template>
    <div class="wrapper">
            <tabsComponent class="review" :tabList="['Отзывы', 'На модерации', 'Черновики']">
                <template v-slot:tabPanel-1>
                    <div class="loader__wrapper" v-if="isLoadingMyReviews">
                        <loader class="loader"></loader>
                    </div>
                    <div v-else>
                        <div class="filter">
                            Статистика за:
                        </div>
                        <div class="table">
                            <div class="table__header">
                                <div class="table__date">Дата</div>
                                <div class="table__sku">Заголовок</div>
                                <div class="table__status">Статус</div>
                                <div class="table__viewsCount">Просмотры</div>
                                <div class="table__balance">Прибыль</div>
                                <div class="table__bonus">Бонусы</div>
                                <div class="table__likes">Лайки</div>
                                <div>Action</div>
                            </div>
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
                <template v-slot:tabPanel-2>
                  <myModeratesReviews/>
                </template>
                <template v-slot:tabPanel-3>
                    <myDrafts/>
                </template>
            </tabsComponent>
        </div>
</template>

<script setup>
    import pagination from '~/components/pagination';
    //import reviewsAnswersNav from "~/components/profile/reviewsAnswersNav";
    import loader from "~/components/loader";
    import myReview from "~/components/profile/my-review-new";
    import myDrafts from "~/components/profile/my-drafts";
    import myModeratesReviews from "~/components/profile/my-moderated-reviews.vue";
    import { storeToRefs } from "pinia";
    import { useReviewStore } from "~/store/review";

    const reviewStore = useReviewStore();
    const { isLoadingMyReviews, myReviews, myReviewsOptions, myReviewsLastPage } = storeToRefs(reviewStore);

    let router = useRouter();
    let route = useRoute();
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
        () => ({ params: route.query }),
        async (value) => {
            reviewStore.setMyReviewsOptionsByQuery(value.query);
            await reviewStore.loadMyReviews();
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
        await reviewStore.loadMyReviews();
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

    .wrapper {
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.16);
        background-color: #fff;
        display: flex;
        flex-wrap: wrap;
        min-height: 350px;
    }

    .review {
        width: 100%;
    }
    .filter {
        padding: 16px;
    }

    .table {
        overflow:hidden;
        width: 100%;
        &__header {
            display: flex;
            align-items: center;
        }
        & div {
            padding: 8px;
        }

        &__date {
            width: 10%;
        }
        &__sku {
            width: 35%;
        }
        &__status {
            width: 15%;
        }
        &__viewsCount,
        &__balance,
        &__bonus,
        &__likes {
            width: 10%;
        }
    }
</style>
