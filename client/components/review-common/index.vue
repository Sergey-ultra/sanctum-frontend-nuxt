<template>
    <div>
        <div class="review__meta">
            <div
                class="review__avatar"
                :class="{'review__avatar-is-right': isRight === true}"
            >
                <nuxt-link :to="`/users/${review.user_id}`" class="review__avatar-img">
                    <img :src="`${$config.APP_URL}/${review.user_avatar}`" alt="avatar"/>
                </nuxt-link>
            </div>
            <div>
                <nuxt-link :to="`/users/${review.user_id}`" class="review__user">{{ review.user_name }}</nuxt-link>
                <span class="review__date">{{ review.created_at }}</span>
                <ratingView :rating="Number(review.rating)"/>
            </div>
        </div>


        <h3 class="review__title">
            <nuxt-link :to="`/review/${review.id}`">
                {{ review.title }}
            </nuxt-link>
        </h3>


        <review-images
            v-if="review.images && review.images.length"
            :images="review.images"
        />

        <div class="review__items">
            <dl v-if="review.plus" class="review__item">
                <dt>Достоинства:</dt>
                <dd>{{ review.plus }}</dd>
            </dl>

            <dl v-if="review.minus" class="review__item">
                <dt>Недостатки:</dt>
                <dd>{{ review.minus }}</dd>
            </dl>


            <div v-if="review.body" class="review__item">
                <div v-html="review.body"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import ratingView from "../ratingView";
    import reviewImages from "../review-images";

    const props = defineProps({
        review: Object,
        isRight: {
            type: Boolean,
            default: false
        }
    });
</script>

<style scoped lang="scss">
    .review {
        &__meta{
            display: flex;
            align-items: center;
        }
        &__title a {
            color: #2b2b2b;
        }
        &__avatar {
            position: absolute;
            transform: translateX(-100%);
            display: inline-block;
            vertical-align: top;
            width: 48px;
            &-is-right {
                position: static;
                transform: translateX(0);
            }
            &-img {
                display: block;
                overflow: hidden;
                border-radius: 50%;
                height: 36px;
                width: 36px;
                & img {
                    object-fit: cover;
                    width: 100%;
                    height:100%;
                }
            }
        }
        &__user {
            font-weight: 700;
        }

        &__date {
            font-size: 16px;
            color: #878787;
            margin-left: 10px;
        }
        &__items {

        }

        &__item {
            color: #2b2b2b;
            display: block;
            margin-top: 12px;
            margin-bottom: 2px;

            & dt {
                font-size: 16px;
                line-height: 24px;
                font-weight: 700;
                display: inline-block;
                margin-right: 5px;
            }
            & dd {
                margin:0;
                display: inline;
                max-width: 100%;
                word-wrap: break-word;
                word-break: break-word;
                white-space: pre-line;
            }
        }
    }
    @media (max-width: 700px) {
        .review {
            &__avatar {
                position: static;
                transform: translateX(0);
            }
        }
    }
</style>
