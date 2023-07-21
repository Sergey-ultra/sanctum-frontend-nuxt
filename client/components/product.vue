<template>
    <div>
        <loader
            class="loader"
            v-if="isLoadingCurrentSku"/>


        <div v-else-if="Object.keys(currentSku).length" class="sku">
            <div class="breadcrumb">
                <nuxt-link class="breadcrumb__item" to="/">Каталог</nuxt-link>
                <nuxt-link
                    class="breadcrumb__item"
                    :to="`/category/${currentSku.category_code}`"
                >
                    {{ currentSku.category }}
                </nuxt-link>
                <nuxt-link
                    class="breadcrumb__item"
                    :to="`/brand/${currentSku.brand_code}`"
                >
                    {{ currentSku.brand }}
                </nuxt-link>
            </div>


            <h4 class="sku__title sku__title-full">{{ skuName }}</h4>

            <div class="sku__meta">
                <tabs
                    :tabs="tabValues"
                />

                <div class="branch">
                    <tool-tip class="branch__inner" :position="'bottom'">
                        <template v-slot:content>
                            Добавить в избранное
                        </template>
                        <div class="branch__item" @click="addToFav(currentSku.id)">
                            <fa class="icon" :class="{'pink': favorites.includes( currentSku.id) }" icon="heart"></fa>
                            <span class="branch__text">В избранное</span>
                        </div>
                    </tool-tip>

                    <tool-tip class="branch__inner" :position="'bottom'">
                        <template v-slot:content>
                            <span v-if="!allComparedSkuIds.includes( currentSku.id)">Добавить к сравнению</span>
                            <span v-else>Удалить из сравнения</span>
                        </template>
                        <div class="branch__item" @click="getComparison">
                            <svg
                                :class="{'pink': allComparedSkuIds.includes( currentSku.id) }"
                                class="icon"
                                xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32">
                                <path fill="currentColor"
                                      d="M12 2h20v4h-20v-4zM12 14h20v4h-20v-4zM12 26h20v4h-20v-4zM0 4c0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4s-4-1.791-4-4zM0 16c0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4s-4-1.791-4-4zM0 28c0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4s-4-1.791-4-4z"></path>
                            </svg>
                            <span class="branch__text">Сравнить</span>
                        </div>
                    </tool-tip>
                </div>
            </div>

            <div class="product">
                <div class="header">
                    <div class="header__item header__item-sku">
                        <div class="header__images">
                            <div class="photos__inner">
                                <div class="photos__gallery" v-if="smallPhotos.length > 1">
                                    <div
                                        class="photos__item"
                                        :class="{'photos__item-selected': selectedPhotoIndex === index}"
                                        v-for="(img, index) in smallPhotos.slice(0, 6)"
                                        :key="index"
                                        @click="selectPhotoIndex(index)"
                                    >
                                        <img :src="`${$config.APP_URL}/${img}`" :alt="img"/>
                                    </div>
                                </div>
                                <button class="photos__more" v-if="smallPhotos.length > 6" @click="showLightBox">
                                    Еще {{ smallPhotos.length - 6 }}
                                </button>
                            </div>
                            <div class="photos__main" @click="showLightBox">
                                <img :src="`${$config.APP_URL}/${mainPhotos[selectedPhotoIndex]}`" alt="mainPhoto"/>
                            </div>
                        </div>

                        <mobile-slider
                            class="mobile-slider"
                            :images="mainPhotos"
                            v-model:selectedPhotoIndex="selectedPhotoIndex"
                        />


                        <div class="header__info">
                            <h3>Коротко о товаре</h3>
                            <div class="header__info-item" v-if="currentSku.active_ingredients && currentSku.active_ingredients.length">
                                <div class="header__el">
                                    <span>Активный ингредиент</span>
                                </div>
                                <div class="header__el header__el-ul">
                                    <nuxt-link :to="`/ingredient/${ingredient.id}`" v-for="ingredient in currentSku.active_ingredients" :key="ingredient.id">
                                        {{ ingredient.name }}
                                    </nuxt-link>
                                </div>
                            </div>
                            <div class="header__info-item" v-if="currentSku.country">
                                <div class="header__el"><span>Страна бренда</span></div>
                                <div class="header__el">{{ currentSku.country }}</div>
                            </div>
                            <div class="header__info-item">
                                <a href="#description">Подробней</a>
                            </div>
                            <div class="header__info-item">
                                <nuxt-link :to="`/product/${currentSku.code + '-' + currentSku.id }/questions`">
                                    Задать вопрос о товаре
                                </nuxt-link>
                            </div>
                            <div class="header__info-item">
                                <nuxt-link :to="`/brand/${currentSku.brand_code}`">
                                    Все товары
                                    <strong>{{ currentSku.brand }}</strong>
                                </nuxt-link>
                            </div>
                        </div>
                    </div>

                    <div class="header__item header__item-branch">
                        <div class="branch__item" @click="addToFav(currentSku.id)">
                            <fa class="icon" :class="{'pink': favorites.includes( currentSku.id) }" icon="heart"></fa>
                        </div>

                        <div class="branch__item branch__item-gray">
                            {{ selectedPhotoIndex + 1 }} из {{ mainPhotos.length }} фото
                        </div>

                        <div class="branch__item" @click="getComparison">
                            <svg
                                :class="{'pink': allComparedSkuIds.includes( currentSku.id) }"
                                class="icon"
                                xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32">
                                <path fill="currentColor"
                                      d="M12 2h20v4h-20v-4zM12 14h20v4h-20v-4zM12 26h20v4h-20v-4zM0 4c0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4s-4-1.791-4-4zM0 16c0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4s-4-1.791-4-4zM0 28c0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4s-4-1.791-4-4z"></path>
                            </svg>
                        </div>
                    </div>

                    <div class="header__item header__item-title">
                        <h4 class="sku__title">{{ skuName }}</h4>
                    </div>

                    <tabs class="header__item header__item-tabs" :tabs="tabValues"/>

                    <div class="header__item header__item-right">
                        <div class="header__item-prices">

                            <tool-tip
                                v-if="trackingSkuIds.includes(currentSku.id)"
                                :position="'bottom'"
                            >
                                <template v-slot:content>
                                    Вы следите за снижением цены товара
                                </template>
                                <div class="prices__tracking">
                                    <svg class="icon" data-tid="67c99287 3e657a83" data-tid-prop="3e657a83" width="16"
                                         height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M 7.383 7.768 L 9.748 5.472 L 15.135 10.7 L 16.7 9.18 L 18 15 L 12.004 13.738 L 13.569 12.219 L 9.783 8.545 L 7.453 10.807 L 3.342 6.817 C 2.9 6.388 2.884 5.708 3.307 5.297 C 3.73 4.887 4.43 4.903 4.872 5.332 L 7.382 7.768 Z"
                                            fill="currentColor"></path>
                                    </svg>
                                    <span>Следить за снижением цены</span>
                                </div>
                            </tool-tip>

                            <div v-else class="prices__tracking" @click="openTrackingModal">
                                <svg class="icon" data-tid="67c99287 3e657a83" data-tid-prop="3e657a83" width="16"
                                     height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M 7.383 7.768 L 9.748 5.472 L 15.135 10.7 L 16.7 9.18 L 18 15 L 12.004 13.738 L 13.569 12.219 L 9.783 8.545 L 7.453 10.807 L 3.342 6.817 C 2.9 6.388 2.884 5.708 3.307 5.297 C 3.73 4.887 4.43 4.903 4.872 5.332 L 7.382 7.768 Z"
                                        fill="currentColor"></path>
                                </svg>
                                <span>Следить за снижением цены</span>
                            </div>


                            <div class="prices__title">
                                <div>
                                           <span v-if="currentSku.prices.length > 1">
                                               <span>от</span>
                                               <span class="low-price">{{ currentSku.minPrice }}</span>
                                               <span>до</span>
                                          </span>
                                    <span class="high-price">{{ currentSku.maxPrice }}  р.</span>
                                </div>
                                <div class="goto-price-charts">
                                    <tool-tip class="goto-price-charts__wrapper" :position="'top'">
                                        <template v-slot:content>
                                            Динамика цен
                                        </template>
                                        <a class="goto-price-charts__link" href="#price__dynamics">
                                            <fa class="goto-price-charts__icon" icon="chart-line"></fa>
                                        </a>
                                    </tool-tip>
                                </div>
                            </div>
                            <div v-if="currentSku.prices.length > 1">Сравнить цены {{ currentSku.prices.length }}</div>
                            <div
                                class="prices__item"
                                v-for="price in currentSku.prices"
                                :key="price.price"
                            >

                                <a class="prices__item-link" :href="'/to/' + price.link_code">
                                    <span>{{ price.name }}</span>
                                    <span>→</span>
                                    <span>{{ price.price }}</span>
                                </a>

                                <div class="prices__item-img">
                                    <img v-lazyload :data-src="`${$config.APP_URL}/${price.image}`" alt="price.image"/>
                                </div>
                            </div>
                        </div>
                        <a href="/supplier" class="publish__prices">
                            Разместить цены
                        </a>
                    </div>
                </div>

                <slot></slot>
            </div>
        </div>

        <viewed-products></viewed-products>
        <tracking-modal
            v-model:isShowTrackingModal="isShowTrackingModal"
            :currentSku="currentSku"
        />
        <light-box
            class="light-box"
            v-if="isShowLightBox"
            :items="photos"
            v-model:selectedPhotoIndex="selectedPhotoIndex"
            v-model:isShowLightBox="isShowLightBox"
        />
    </div>
</template>

<script setup>
import tabs from '~/components/tabs';
import toolTip from '~/components/tool-tip';
import loader from '~/components/loader';
import trackingModal from '~/components/tracking-modal';
import viewedProducts from '~/components/viewed-products';
import lightBox from '~/components/light-box';
import mobileSlider from '~/components/mobile-slider';
import {storeToRefs} from "pinia";
import {useCurrentSkuStore} from "~/store/currentSku";
import {useComparisonStore} from "~/store/comparison";
import {useFavoritesStore} from "~/store/favorites";
import {useTrackingStore} from "~/store/tracking";
import {useViewedSkuStore} from "~/store/viewedSku";
import {useReviewStore} from "~/store/review";
import transformImagePath from '~/utils/transform-image-path';
import { useNuxtApp } from '#app';
const { $api } = useNuxtApp();

const currentSkuStore = useCurrentSkuStore();
const comparisonStore = useComparisonStore();
const favoritesStore = useFavoritesStore();
const trackingStore = useTrackingStore();
const viewedSkuStore = useViewedSkuStore();
const reviewStore = useReviewStore();

const {currentSku, isLoadingCurrentSku} = storeToRefs(currentSkuStore);
const {allComparedSkuIds} = storeToRefs(comparisonStore);
const {favorites} = storeToRefs(favoritesStore);
const {trackingSkuIds} = storeToRefs(trackingStore);

let selectedPhotoIndex = ref(0);
let isShowLightBox = ref(false);
let isShowTrackingModal = ref(false);

const route = useRoute();

const currentSkuProductCode = computed(() => {
    if (!Object.keys(currentSku.value).length) {
        return '';
    }
    return currentSku.value.code + '-' + currentSku.value.id;
});

const mainPhotos = computed(() => currentSku.value.images);
const smallPhotos = computed(() => {
    if (currentSku.value.images) {
        return currentSku.value.images.map(path => {
            return transformImagePath(path, 'small');
        })
    }
    return [];
});
const photos = computed(() =>  {
    return currentSku.value.images
        .map(path => {
            return { type: 'image', url: path, small: transformImagePath(path, 'small') }
        });
});

const skuName = computed(() => `${currentSku.value.name}, ${currentSku.value.volume}`);

const currentSkuId = computed(() => {
    if (route.params.product_code && route.params.product_code.includes('-')) {
        const urlParts = route.params.product_code.split('-');
        return Number(urlParts[urlParts.length - 1]);
    }
    return null;
});

const tabValues = computed(() => {
    return [
        {
            to: `/product/${currentSkuProductCode.value}`,
            name: "Описание"
        },
        {
            to: `/product/${currentSkuProductCode.value}/prices`,
            name: "Где купить ",
            sub: currentSku.value.prices ? currentSku.value.prices.length : ''
        },
        {
            to: `/product/${currentSkuProductCode.value}/reviews`,
            name: "Отзывы",
            sub: currentSku.value.reviews_count ?? ''
        },
        {
            to: `/product/${currentSkuProductCode.value}/questions`,
            name: currentSku.value.question_count ? "Вопросы" : "Задать вопрос",
            sub: currentSku.value.question_count ?? ''
        },
    ]
});

const showLightBox = () => isShowLightBox.value = true;

const getComparison = () => {
    comparisonStore.toggleComparison({
        id: currentSku.value.id,
        name: currentSku.value.name,
        volume: currentSku.value.volume,
        category_id: currentSku.value.category_id,
        category: currentSku.value.category,
        image: currentSku.value.images[0]
    })
};

const openTrackingModal = () => {
    if (!trackingSkuIds.value.includes(currentSku.value.id)) {
        isShowTrackingModal.value = true
    }
};

const selectPhotoIndex = index => selectedPhotoIndex.value = index;

const addToFav = id => {
    if (!$api.isAuth.value) {
        $api.setIsShowAuthModal(true)
    } else {
        if (!favorites.value.includes(id)) {
            favoritesStore.addToFavorites(id)
        } else {
            favoritesStore.removeFromFavorites(id)
        }
    }
};

const loadCurrentSkuAndAddItToViewed = async () => {
    await Promise.all([
        viewedSkuStore.addToViewedSkuIds(currentSkuId.value),
        currentSkuStore.loadCurrentSku()
    ]);
};



// const setSEO = name => {
//     const title = `Описание товара ${name}`;
//     const metaName = `${title} Smart-Beautiful - агрегатор цен косметических товаров`;
//     useHead({
//         title,
//         meta: [
//             {name: 'description', content: metaName},
//             {name: 'keywords', content: metaName}
//         ],
//     });
// };

watch(
    currentSkuId,
    (value) => {
        if (value !== null) {
            currentSkuStore.setCurrentSkuId(value);
            loadCurrentSkuAndAddItToViewed();
        }
    },
);

watch(
    currentSku,
    (value) => {
        selectPhotoIndex(0);
        // setSEO(value.name);
    }
);


// setSEO(currentSku.value.name);

await onMounted(async () => {
    if (currentSkuId.value !== null) {
        currentSkuStore.setCurrentSkuId(currentSkuId.value);
        await loadCurrentSkuAndAddItToViewed();
    }
});
</script>

<style lang="scss" scoped>
h3 {
    margin: 0;
}

a {
    text-decoration: none;
    color: #3757c5;
}

.loader {
    width: 200px;
    height: 200px;
}

.breadcrumb {
    color: gray;
    display: flex;
    padding-left: 0;
    padding-right: 0;
    border-radius: 0;
    font-size: 13px;
    background-color: transparent;
    margin-block-start: 0 !important;
    overflow: hidden;
    position: relative;
    max-height: 23px;
    margin-bottom: 8px;

    & a {
        color: #333;
    }

    &__item {
        list-style-type: none;
        white-space: nowrap;
    }

    & .breadcrumb__item + .breadcrumb__item::before {
        color: gray;
        content: "> ";
        padding: 0 5px;
    }
}

.sku {
    margin-top: 24px;

    &__title {
        color: #202020;
        font-weight: 700;
        font-size: 28px;
        margin: 0;
    }

    &__meta {
        padding-top: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}

.branch {
    display: flex;

    &__inner {
        &:first-child {
            margin-left: -15px;
        }

        &:last-child {
            margin-right: -15px;
        }
    }

    &__item {
        display: flex;
        align-items: center;
        padding: 6px 15px;
        font-size: 14px;
        line-height: 18px;
        cursor: pointer;

        &-gray {
            color: #cccccc;
        }

        & span {
            white-space: nowrap;
            margin-left: 5px;
        }
    }
    &__text {
        display:inline;
    }
}

.header {
    display: flex;
    justify-content: space-between;

    &__images {
        display: flex;
        height: 100%;
        flex-grow: 1;
        flex-shrink: 1;
    }

    &__item {
        margin-bottom: 20px;

        &-sku {
            display: flex;
            flex-grow: 1;
            flex-shrink: 1;
        }

        &-branch,
        &-title,
        &-tabs {
            display:none;
        }

        &-right {
            flex-shrink: 1;
            min-width: 340px;
            margin-left: 24px;

        }

        &-prices {
            width: 100%;
            font-size: 13px;
            box-shadow: 0 0 3px rgba(0, 0, 0, .12), 0 2px 4px rgba(0, 0, 0, .12);
            /*box-shadow: 0 8px 24px rgba(0,0,0,0.12);*/
            border-radius: 8px;
            display: block;
            padding: 20px;
            background-color: #fff;
        }
    }

    &__info {
        display:block;
        width: 284px;
        margin-left: 16px;
        flex-shrink: 0;

        &-item {
            display:flex;
            margin-top: 10px;
            width: 100%;
            line-height: 15px;
            font-size: 14px;
        }
    }
    &__el {
        background: #fff;
        position: relative;
        display: flex;
        width: 50%;
        z-index: 1;
        overflow:hidden;

        &-ul {
            flex-direction: column;
        }

        & span {
            position: relative;
            padding-right: 4px;
            background: inherit;
            z-index: 1;
            white-space: nowrap;
            display: inline-block;
            color: grey;

        }
        &:first-child::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            margin-top: .85em;
            height: 1px;
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAABCAAAAAA+i0toAAAAAnRSTlMA/1uRIrUAAAAMSURBVHheY7j1/z8ABY8C2UtBe8oAAAAASUVORK5CYII=) 0 0 repeat-x;
        }
        &:last-child {
            padding-left: 4px;
        }
    }
}

.product {
    margin-top: 20px;
    border-radius: 11px;
    background-color: #fff;
    padding: 20px;
}


.photos {
    &__inner {
        display:flex;
        flex-direction: column;
        margin-right: 16px;
    }
    &__gallery {
        display: grid;
        grid-template-rows: repeat(6, 50px);
        grid-gap: 5px;
        grid-auto-flow: column;
    }

    &__main {
        cursor: pointer;
        max-width: 400px;
        max-height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 20px;
        transition: all;
        transition-duration: .4s;

        & img {
            max-width: 100%;
            max-height: 100%;
        }
    }

    &__item {
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 3px;

        &-selected {
            border: 3px solid #42b983;
        }

        & img {
            max-height: 100%;
            max-width: 100%;
        }

        &:hover {
            cursor: zoom-in;
            transition: all .2s ease;
            transform: scale(1.2);
            border: 3px solid #42b983;
        }
    }
    &__more {
        border: none;
        width: 100%;
        padding: 7px 0;
        text-align: center;
        text-transform: uppercase;
        color: #33c;
        font-size: 10px;
        outline: none;
        outline-offset: 2px;
        margin: 0;
        overflow: visible;
        cursor: pointer;
        background: transparent;
        line-height: inherit;
        text-rendering: inherit;
        letter-spacing: inherit;
        word-spacing: inherit;
    }
}

.high-price,
.low-price {
    color: #ff8d02;
    font-size: 28px;
}

.prices {
    &__tracking {
        display: flex;
        align-items: center;
        margin-right: 15px;
        margin-bottom: 15px;
        line-height: 18px;
        cursor: pointer;
        font-weight: 600;
        font-size: 17px;

        &:hover {
            color: #5a5a5a;
        }

        & span {
            margin-left: 5px;
        }
    }

    &__title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;
    }

    &__item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 17px;

        &-link {
            display: flex;
            max-width: 60%;

            & span:not(:first-child) {
                margin-left: 10px;
            }
        }

        &-img {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            flex-shrink: 1;
            max-height: 25px;
            height: 25px;
            width: 35%;

            & img {
                max-width: 100%;
                max-height: 100%;
            }
        }
    }
}

.pink {
    color: red;;
}

.goto-price-charts {
    margin-left: 10px;
    width: 39px;
    display: flex;

    &__link {
        padding: 4px 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: content-box;
        border-radius: 3px;
        border: 2px solid #d3d3d3;
        height: 14px;
        width: 25px;

        &:hover {
            border-color: #bfbfbf;

            & svg {
                color: #bfbfbf;
            }
        }
    }

    &__icon {
        color: #d3d3d3;
    }
}

.publish__prices {
    display: inline-block;
    margin-top: 30px;
}

.mobile-slider {
    display:none;
}
.light-box {
    display:block;
}

@media (max-width: 1016px) {
    .branch {
        &__text {
            display: none;
        }
    }
}

@media (max-width: 960px) {
    .header {
        &__info {
            display: none;
        }
    }
}

@media (max-width: 800px) {
    .sku {
        &__meta {
            display:none;
        }
        &__title {
            font-size: 24px;
            &-full {
                display: none;
            }
        }
    }
    .mobile-slider {
        display:flex;
    }
    .header {
        flex-wrap: wrap;

        &__item {
            min-width: 100%;
            margin-left: 0;
            &-branch {
                display:flex;
                justify-content: space-between;
                align-items: center;
            }
            &-title {
                display:block;
            }
            &-tabs {
                display:flex;
            }
        }
        &__images {
            display:none;
        }
    }
    .light-box {
        display: none;
    }
}

@media (max-width: 700px) {
    .sku__title {
        font-size: 22px;
    }
    .product {
        margin-left: -8px;
        margin-right: -8px;
        border-radius: 0;
    }
}

@media (max-width: 400px) {
    .sku__title {
        font-size: 20px;
    }
    .prices {
        &__item {
            &-link {
                font-size: 14px;
            }
        }
    }
}
</style>
