<template>
    <compact-sku>
        <section class="reviews">
            <div  class="reviews__body">
                <div class="reviews__header" v-if="reviewsWithPagination.length === 0">
                    Отзывов с текстом ещё нет — ваш может стать первым.
                </div>
                <div class="reviews__header" v-else>Отзывы</div>

                <client-content></client-content>

                <reviewList></reviewList>

                <pagination
                    v-if="reviewsWithPagination.length && lastPage > 1"
                    v-model:currentPage="currentPageLocal"
                    :lastPage="lastPage"
                />
            </div>
            <div class="reviews__actions">
                <router-link  class="reviews__add" :to="`/product/${$route.params.product_code}/add-review`">
                    <span v-if="!$api.isAuth || ($api.isAuth && !existingReview)">Добавить</span>
                    <span v-else>Изменить</span>
                </router-link>
                <filter-by-rating
                    :mode="'review'"
                    class="reviews__filter"
                />
            </div>
        </section>
    </compact-sku>
</template>

<script setup>
import reviewList from "~/components/review-list/index.vue";
import clientContent from '~/components/client-content/index.vue'
import compactSku from '~/components/compact-sku/index.vue'
import filterByRating from "~/components/review-list/filter-by-rating.vue";
import pagination from "~/components/pagination.vue";
import { storeToRefs } from "pinia";
import {useReviewStore} from "~/store/review";
import {useCurrentSkuStore} from "~/store/currentSku";
import { useNuxtApp } from '#app'
const { $api } = useNuxtApp();

const reviewStore = useReviewStore();

const currentSkuStore = useCurrentSkuStore();
const { reviewsWithPagination, existingReview, lastPage, tableOptions } = storeToRefs(reviewStore);
const { currentSkuId  } = storeToRefs(currentSkuStore);

const route = useRoute();
const router = useRouter();

const currentPageLocal = computed({
    get() {
        return tableOptions.value.currentPage;
    },
    set(value) {
        setPageQuery(value);
    }
});

const setPageQuery = value => {
    const query =  { ...route.query }

    if (value > 1) {
        query.page = value
    } else if (value === 1) {
        delete query.page
    }
    router.push({ query,  params: { ...route.params, savePosition: true }})
};



watch(currentSkuId, value => {
    if (value && $api.isAuth.value) {
        reviewStore.checkExistingReview();
    }
});

watch(
    () => ({params: route.params, query: route.query}),
    value => {
        if (value) {
            reviewStore.setTableOptionsByQuery(value.query);
            reviewStore.loadReviewsWithPagination();
        }
    },
    {deep: true}
);



useAsyncData(() => {
    if ($api.isAuth.value) {
        reviewStore.checkExistingReview()
    }
    reviewStore.setTableOptionsByQuery(route.query);
});
</script>

<style lang="scss" scoped>
.sku {
    justify-content: space-between;
    display: flex;
    &__image a {
        display: block;
        position: relative;
        width: 70px;
        height: 70px;
        margin: 0 16px 16px 0;
        border-right: none;
        & img {
            position: absolute;
            top: 50%;
            right: 0;
            bottom: 0;
            left: 50%;
            max-width: 100%;
            max-height: 100%;
            transform: translate(-50%,-50%);
        }
    }
    &__text {
        margin-top: 8px;
        margin-bottom: 16px;
        flex: 1;
    }
    &__title {
        color: #2b2b2b;
        display: inline-block;
        vertical-align: middle;
        font-size: 18px;
        line-height: 24px;
        font-weight: 700;
    }
}
.reviews {
    display: flex;
    flex-wrap:wrap;
    justify-content: space-between;
    margin:20px 0;

    &__header {
        border-bottom: 1px solid #e8e8e8;
        flex-shrink: 1;
        margin-right:10px;
        line-height: 28px;
        color: #222;
        padding-bottom: 19px;
        font-size: 28px;
        font-weight: 500;
    }
    &__body {
        width: 75%;
        padding-right: 65px;
    }
    &__actions {
        width: 25%;
        margin-top: 50px;
    }
    &__add {
        display: inline-block;
        width: 100%;
        border-radius: 4px;
        transition: all .12s ease-out;
        background-color: #fc0;
        padding: 0 20px;
        line-height: 48px;
        height: 48px;
        color: inherit;
        text-decoration: none;
        text-align: center;
        flex-shrink: 0;
        & span {
            font-weight: 400;
            font-style: normal;
            font-stretch: normal;
            font-size: 16px;
            line-height: 24px;
        }
        &:hover {
            background-color: #f5c423;
        }
    }
    &__filter {
        margin-top: 20px;
    }
    &__form {
        margin-top: 15px;
    }
}
@media (max-width: 800px) {
    .reviews {
        &__body {
            width: 100%;
            padding-right: 0;
        }
        &__actions {
            width: 100%;
        }
        &__add {
            line-height: 36px;
            height: 36px;
        }
    }
}
</style>
