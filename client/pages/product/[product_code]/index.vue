<template>
    <product>
        <div class="description">
            <div class="skus">
                <div
                    class="skus__item"
                    :class="{'skus__item-selected': sku.id === currentSku.id }"
                    v-for="sku in currentSku.skus"
                    :key="sku.id"
                >
                    <nuxt-link
                        v-if="sku.id !== currentSku.id"
                        :to="`/product/${currentSku.code + '-' + sku.id }`"
                    >
                        {{ sku.volume }}
                    </nuxt-link>
                    <div v-else>
                        {{ sku.volume }}
                    </div>
                </div>
            </div>


            <section class="description__item description__item-description" id="description">
                <h2 class="title">Описание</h2>
                <div>{{ currentSku.description }}</div>
            </section>

            <section
                class="description__item characteristics"
                v-if="currentSku.options && Object.keys(currentSku.options).length"
            >
                <h2 class="title">Характеристики</h2>
                <div
                    class="characteristics__item"
                    v-for="(char, index) in currentSku.options"
                    :key="index"
                >
                    <div class="characteristics__key">
                        <div class="characteristics__key-name">
                            <span> {{ getCharacteristicsTitle(index) }}</span>
                        </div>
                    </div>
                    <div class="characteristics__value">{{ char }}</div>
                </div>
            </section>


            <div class="description__item price__dynamics" id="price__dynamics">
                <h2 class="title">Динамика цен</h2>
                <ClientOnly>
                    <!--            <sku-price-history-chart :chartData="priceHistory"/>-->
                    <price-history-chart class="chart" :chartData="priceHistory"/>
                </ClientOnly>
            </div>

            <section class="description__item ingredients" v-if="currentSku.ingredients.length">
                <h2 class="title">Ингредиенты</h2>
                <div class="ingredients__row">
                    <div
                        class="ingredients__column"
                        v-for="(ingredientBlock, ingredientBlockIndex) in spliceIntoChunks(currentSku.ingredients, 2)"
                        :key="ingredientBlockIndex"
                    >
                        <div
                            class="ingredients__item"
                            v-for="ingredient in ingredientBlock"
                            :key="ingredient"
                        >
                            {{ ingredient }}
                        </div>
                    </div>
                </div>
            </section>

            <section class="description__item" v-if="currentSku.reviews_count">
                <div class="reviews reviews-title">
                    <div class="reviews__body">
                        <h2 class="title title-review">
                            <span>Отзывы</span>
                            <nuxt-link
                                v-if="currentSku.reviews_count"
                                class="title__count"
                                :to="`/product/${currentSkuProductCode}/reviews`"
                            >
                                {{ currentSku.reviews_count }}
                            </nuxt-link>
                        </h2>
                    </div>
                    <div class="reviews__actions">
                        <button class="reviews__button reviews__button-full reviews__button-transform">
                            <nuxt-link :to="`/product/${ currentSkuProductCode }/add-review`">
                                <span v-if="!$api.isAuth || ($api.isAuth && !existingReview)">Добавить</span>
                                <span v-else>Изменить</span>
                            </nuxt-link>
                        </button>
                    </div>

                </div>


                <div class="reviews">
                    <div class="reviews__body">
                        <client-content class="reviews__client"/>
                        <reviewList></reviewList>
                        <button class="reviews__button reviews__button-link reviews__button-full">
                            <nuxt-link :to="`/product/${currentSkuProductCode }/reviews`">
                                Перейти к отзывам
                            </nuxt-link>
                        </button>
                    </div>
                    <div class="reviews__actions reviews__actions-filter">
                        <filterByRating/>
                        <button class="reviews__button reviews__button-link reviews__button-full">
                            <nuxt-link :to="`/product/${currentSkuProductCode }/reviews`">
                                Показать все отзывы
                            </nuxt-link>
                        </button>
                    </div>
                </div>

            </section>
            <section class="description__item" v-else>
                <h2 class="title">Отзывов ещё нет — ваш может стать первым</h2>

                <div v-if="selectedRating">Спасибо, оценка принята</div>
                <div v-else>Для начала оцените товар</div>

                <ratingForm></ratingForm>

                <div class="reviews__explain">
                    Будет здорово, если вы напишете свои впечатления о товаре.
                    <br>
                    Это поможет другим покупателям
                </div>
                <button class="reviews__button  reviews__button-full">
                    <nuxt-link :to="`/product/${currentSkuProductCode }/add-review`">
                        <span v-if="!$api.isAuth || ($api.isAuth && !existingReview)">Оставить отзыв</span>
                        <span v-else>Изменить</span>
                    </nuxt-link>
                </button>
            </section>
        </div>
    </product>
</template>

<script setup>
    // import skuPriceHistoryChart from '~/components/sku-price-history-chart'
    import priceHistoryChart from '~/components/price-history-chart';
    import product from '~/components/product';
    import ratingForm from '~/components/rating-form';
    import reviewList from "~/components/review-list";
    import clientContent from "~/components/client-content";
    import filterByRating from "~/components/review-list/filter-by-rating";
    import { storeToRefs } from "pinia";
    import {useCurrentSkuStore} from "~/store/currentSku";
    import {usePriceHistoryStore} from "~/store/pricehistory";
    import {useReviewStore} from "~/store/review";
    import {useNuxtApp, useRuntimeConfig} from '#app'
    const { $api } = useNuxtApp();
    const config = useRuntimeConfig();

    const currentSkuStore = useCurrentSkuStore();
    const priceHistoryStore = usePriceHistoryStore();
    const reviewStore = useReviewStore();
    const { currentSku, isLoadingCurrentSku } = storeToRefs(currentSkuStore);
    const { priceHistory } = storeToRefs(priceHistoryStore);
    const { existingReview, selectedRating } = storeToRefs(reviewStore);



    const route = useRoute();

    const currentSkuProductCode = computed (() => {
      if (!Object.keys(currentSku.value).length) {
        return '';
      }
      return currentSku.value.code + '-' +  currentSku.value.id;
    });

    const skuId = computed(() => {
        if (route.params.product_code) {
            const urlParts = route.params.product_code.split('-');
            return urlParts[urlParts.length - 1];
        }
        return null;
    })

    const loadCurrentPriceDynamics = () => {
        if (skuId.value) {
            priceHistoryStore.loadPriceHistory(skuId.value);
        }
    };

    const getCharacteristicsTitle = value => {
        switch (value) {
            case 'application':
                return 'Применение';
            case 'purpose':
                return 'Цель';
            case 'age':
                return 'Возраст';
            case 'effect':
                return 'Эффект';
            case 'type_of_skin':
                return 'Тип кожи';
        }
    };

    const spliceIntoChunks = (arr, countOfChunks) => {
        let res = [];
        const chunkSize = Math.ceil(arr.length / countOfChunks);

        for (let i = 0; i < countOfChunks; i++) {
            const chunk = arr.slice(chunkSize * i, chunkSize * (i + 1));
            res.push(chunk);
        }
        return res;
    };

    const setSEO = name => {
        const title = `Описание товара ${name}`;
        const metaName = `${title} ${config.public.siteTitle}`;
        useHead({
            title,
            meta: [
                {name: 'description', content: metaName},
                {name: 'keywords', content: metaName}
            ],
        });
    };


    watch(currentSku, value => setSEO(value.name));

    setSEO(currentSku.value.name);


    onMounted(() => {
        loadCurrentPriceDynamics();

        if ($api.isAuth.value) {
            reviewStore.checkExistingReview();
        }
    });
</script>

<style lang="scss" scoped>
    .title {
        margin: 32px 0 18px;
        padding: 0;
        color: #04b;
        font-size: 28px;
        font-weight: 500;
        &-review {
            margin: 0;
            padding: 0;
        }
        &__count {
            text-decoration: none;
            font-size: 24px;
            line-height: 32px;
            font-weight: 400;
            color: #999;
            margin-left: 10px;
        }
    }
    .skus {
        display:inline-flex;
        align-items: center;

        border-radius:5px;
        /*height:32px;*/
        width:auto;
        &__item {
            border: 2px solid #2c509a;
            padding: 3px 15px;
            &:first-child {
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
            }
            &:last-child {
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
            }
            &.skus__item-selected {
                border: 3px solid #ff8d02;
                color: #ff8d02;
            }
        }
    }

    .description {
        &__item {
            &:not(:last-child) {
                margin-bottom: 45px;
            }
        }
    }

    .characteristics {
        background: inherit;
        &__item {
            background: inherit;
            display: flex;
            margin-bottom: 12px;
        }
        &__key {
            flex:0 0 auto;
            width: 30%;
            margin-bottom: 7px;
            position: relative;
            background: inherit;
            &-name {
                position: relative;
                padding-right: 10px;
                background: #fff;
                z-index: 1;
                display: inline-block;
                color: grey;
            }
            &:after {
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                margin-top: .85em;
                height: 1px;
                background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAABCAAAAAA+i0toAAAAAnRSTlMA/1uRIrUAAAAMSURBVHheY7j1/z8ABY8C2UtBe8oAAAAASUVORK5CYII=) 0 0 repeat-x;
            }
        }
        &__value {

        }
    }
    .ingredients {
        &__row {
            display: flex;
        }
        &__column {
            width: 50%;
            &:not(:last-child) {
                margin-right: 10px;
            }
            &:not(:first-child) {
                margin-left: 10px;
            }
        }
    }
    .reviews {
        display: flex;
        flex-wrap:wrap;
        justify-content: space-between;
        margin-bottom:20px;
        &-title {
            margin-top: 36px;
            margin-bottom: 20px;
        }
        &__body {
            width: 75%;
            padding-right: 65px;
        }
        &__actions {
            width: 25%;
        }
        &__button {
            transition: all .12s ease-out;
            background-color: #fc0;
            -webkit-appearance: none;
            border: 0;
            border-radius: 4px;
            position: relative;
            line-height: 36px;
            height: 36px;
            cursor: pointer;
            display:flex;
            justify-content: center;
            align-items: center;
            color: inherit;
            text-align: center;
            & a {
                width: 100%;
                color: inherit;
                text-decoration:none;
            }
            &:hover {
                background-color: #f5c423;
            }
            &-full {
                width: 100%;
            }
            &-link {
                margin-top: 16px;
                background-color: inherit;
                box-sizing: border-box;
                border: 1px solid rgba(0,0,0,.2);
                &:hover {
                    background-color: rgba(0,0,0,.04);
                }
            }
        }
        &__client {
            padding-top: 0;
        }
        &__chunk {
            color: #04b;
            text-decoration: none;
            display: flex;
            align-items: center;
            user-select: none;
            cursor: pointer;
            padding: 8px 0;
            &__count {
                padding-left: 12px;
            }
        }
        &__explain {
            margin: 10px 0;
        }
    }

    .chart {
        width: 100%;
        height: 300px;
    }



    @media (max-width: 1000px) {
        .reviews {
            &__body {
                padding-right: 30px;
            }
        }
    }
    @media (max-width: 900px) {
        .reviews {
            &__body {
                padding-right: 20px;
            }
        }
    }
    @media (max-width: 800px) {
        .reviews {
            &__body {
                width: 100%;
                padding: 0 0 30px 0;
            }
            &__actions {
                width: 45%;
                &-filter {
                    display: none;
                }
            }
            &__button-transform {
                background-color: inherit;
                box-sizing: border-box;
                border: 2px solid rgba(0,0,0,.2);
                &:hover {
                    background-color: rgba(0,0,0,.04);
                }
            }
        }
    }
    @media (max-width: 700px) {
        .chart {
            height: 250px;
        }
    }

    @media (max-width: 500px) {
        .chart {
            height: 200px;
        }
    }
</style>
