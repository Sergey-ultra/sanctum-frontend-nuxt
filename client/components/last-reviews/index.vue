<template>
    <section class="review">
        <div class="title">Последние отзывы</div>
        <div class="review__wrapper">
            <div
                v-for="review in lastReviews"
                :key="review.id"
                class="review__row">
                <div class="review__left">
                    <nuxt-link :to="`/product/${review.product_code}-${review.sku_id}`" class="review__skuPhoto">
                        <img :src="`${$config.APP_URL}/${review.sku_image}`" :alt="review.sku_name">
                    </nuxt-link>
                    <preciseRatingView
                        class="review__rating-precise"
                        :rating="review.common_rating"
                        :large="true"
                    />
                    <nuxt-link :to="`/product/${review.product_code}-${review.sku_id}`" class="review__product">
                        <span>{{ review.views_count}} отзывов</span>
                    </nuxt-link>
                </div>
                <div class="review__right">
                    <h3>
                        <nuxt-link :to="`/product/${review.product_code}-${review.sku_id}/reviews`" class="review__skuPhoto">
                            {{ review.sku_name }}
                        </nuxt-link>
                    </h3>
                    <div>
                        <img class="review__avatar" :src="`${$config.APP_URL}/${review.user_avatar}`" :alt="review.user_name">
                        <span>{{ review.user_name }}</span>
                        <br>
                        <span class="review__created">{{ review.created_at }}</span>
                    </div>
                    <div>
                        <div>{{ review.title }}</div>

                        <div class="review__plusTitle">
                            <svg height="17" width="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"
                                 fill="#8D9399">
                                <path
                                    d="M25,0C11.2,0,0,11.2,0,25s11.2,25,25,25s25-11.2,25-25S38.8,0,25,0z M25,46.7C13.1,46.7,3.3,36.9,3.3,25   S13.1,3.3,25,3.3S46.7,13.1,46.7,25S36.9,46.7,25,46.7z"/>
                                <polygon
                                    points="26.7,16.7 23.3,16.7 23.3,23.3 16.7,23.3 16.7,26.7 23.3,26.7 23.3,33.3 26.7,33.3 26.7,26.7    33.3,26.7 33.3,23.3 26.7,23.3  "/>
                            </svg>
                            Достоинства:
                        </div>
                        <div>{{ review.plus }}</div>


                        <div class="review__minusTitle">
                            <svg height="17" width="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="#8D9399">
                                <path d="M25,0C11.2,0,0,11.2,0,25c0,13.8,11.2,25,25,25c13.8,0,25-11.2,25-25C50,11.2,38.8,0,25,0z M25,46.7   C13.1,46.7,3.3,36.9,3.3,25S13.1,3.3,25,3.3S46.7,13.1,46.7,25S36.9,46.7,25,46.7z"/>
                                <polygon points="26.7,23.3 16.7,23.3 16.7,26.7 26.7,26.7 33.3,26.7 33.3,23.3 27.1,23.3  "/>
                            </svg>
                            Недостатки:
                        </div>
                        <div>{{ review.minus }}</div>
                        <nuxt-link :to="`/review/${review.review_id}`" class="review__link">
                            <svg height="16" width="16"  xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 50 50" fill="#969FA9">
                                <path d="M49.6,21.2c-1.4-2.2-3-4.3-4.7-6.1c-1.8-1.8-3.7-3.4-5.8-4.7c-2.1-1.3-4.4-2.3-6.7-3C30,6.7,27.5,6.4,25,6.4   c-2.5,0-5,0.4-7.4,1.1c-2.3,0.7-4.6,1.7-6.7,3c-2.1,1.3-4,2.9-5.8,4.7C3.4,17,1.8,19,0.4,21.2c-0.8,1.3-0.4,2.9,0.9,3.7   c0.4,0.3,0.9,0.4,1.4,0.4c0.9,0,1.8-0.4,2.3-1.3c4.9-7.9,12.2-12.4,20-12.4s15.2,4.5,20,12.4c0.8,1.3,2.4,1.6,3.7,0.9   C50,24.2,50.4,22.5,49.6,21.2z"/>
                                <path d="M37,30c-1.4,1.1-3.2,1.8-5.1,1.8c-4.5,0-8.1-3.6-8.1-8.1c0-1.9,0.7-3.7,1.8-5.1c0.3-0.4,0-1.1-0.5-1.1   c-0.1,0-0.1,0-0.2,0c-7.2,0-13.1,5.9-13.1,13.1c0,7.2,5.9,13.1,13.1,13.1c7.2,0,13.1-5.9,13.1-13.1c0,0,0,0,0,0   C38.1,30,37.4,29.7,37,30z"/>
                            </svg>
                            Читать весь отзыв
                        </nuxt-link>

                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
    import preciseRatingView from '~/components/preciseRatingView.vue'
    import {useReviewStore} from "~/store/review";
    import {storeToRefs} from "pinia";
    const reviewStore = useReviewStore();
    const { lastReviews, isLoadingLastReviews } = storeToRefs(reviewStore);

    useAsyncData(async() => await reviewStore.loadLastReviews());
</script>

<style lang="scss" scoped>
    h3 {
        margin: 0;
    }
    .title {
        font-weight: 500;
        line-height: 32px;
        font-size: 26px;
        color: #222;
        margin-bottom:20px;
        display:block;
    }
    .review {
        width: 100%;
        min-height: 300px;

        &__wrapper{
            border-radius: 8px;
            background-color: #fff;
            padding: 20px;
        }
        &__row {
            display:flex;
            border-bottom: 1px solid #e2e6e9;
            padding-bottom: 16px;
            padding-top: 16px;
        }
        &__left {
            position: relative;
            text-align: center;
            width: 120px;
        }
        &__product {
            color: #4e4e4e;
        }
        &__right {
            margin-left: 16px;
        }
        &__skuPhoto {
            font-size: 18px;
            color: #4e4e4e;
           & img {
               display: block;
               width: 120px;
               height: 120px;
               border: 0;
           }
        }
        &__avatar {
            float: left;
            margin-right: 8px;
            display: block;
            font-size: 0;
            width: 44px;
            height: 44px;
            overflow: hidden;
            border-radius: 50%;
            & img {
                width: 100%;
                height: 100%;
                max-height: 142px;
                object-fit: cover;
                object-position: center;
            }
        }
        &__created {
            font-size: 13px;
            color: #8d9399;
        }
        &__plusTitle,
        &__minusTitle {
            margin-top: 10px;
            display:flex;
            align-items: center;
            gap: 5px;
            color: #8d9399;
            text-transform: uppercase;
        }
        &__link {
            align-items: center;
            gap: 5px;
            display: flex;
            color: #8d9399;
            margin-top: 16px;
        }
    }
</style>
