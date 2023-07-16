<template>
    <div class="review">
        <loader
            class="loader"
            v-if="isLoadingCurrentReview"
        />
        <div v-else class="review__wrapper">
            <div class="review__inner">
                <div class="review__top">
                    <nuxt-link class="title" :to="`/product/${currentReview.sku_code}`">
                        <span>{{ currentReview.sku_name }}</span>
                    </nuxt-link>
                    <div class="review__image">
                        <img :src="currentReview.sku_image" alt="">
                    </div>
                </div>

                <div class="recommend-ratio">
                    <span>Рекомендуют {{ currentReview.recommend_reviews_percent }}%</span>
                </div>


                <div class="review__ratings">
                    <div class="review__rating">
                        <div class="review__rating-text">
                            {{ currentReview.common_rating }} <span class="text-gray">/ 5</span>
                        </div>
                        <preciseRatingView
                            class="review__rating-precise"
                            :rating="currentReview.common_rating"
                            :large="true"
                        />
                    </div>
                    <ratingPercentage class="review__percentage" :percentage="currentReview.rating_percentage"/>
                </div>


                <nuxt-link :to="`/product/${currentReview.sku_code}/reviews`" class="review__all">
                    <span>Все отзывы: {{ currentReview.reviews_count }}</span>
                </nuxt-link>
                <h2 class="title">{{ currentReview.title }}</h2>
                <metaInfo :currentEntity="currentReview"/>
                <div class="review__items">
                    <dl v-if="currentReview.plus" class="review__item">
                        <dt>Достоинства:</dt>
                        <dd>{{ currentReview.plus }}</dd>
                    </dl>

                    <dl v-if="currentReview.minus" class="review__item" >
                        <dt>Недостатки:</dt>
                        <dd>{{ currentReview.minus }}</dd>
                    </dl>


                    <p v-for="(block, index) in currentReview.body.blocks" :key="index" class="review__item">
                        <span v-if="block.type === 'paragraph'">{{ block.data.text }}</span>
                        <img
                            v-else-if="block.type === 'image'"
                            :src="`${$config.APP_URL}/${block.data.text}`"
                            :alt="block.data.description">
                    </p>

                </div>

                <div class="review__bottom" v-if="currentReview.plus && currentReview.minus && currentReview.body">

                    <div class="review__comment__btn review__comment__btn-add">
                    <span>
                        {{ getCommentCountText(currentReview.comments_count) }}
                    </span>
                    </div>


                    <div class="dropdown">
                        <drop-menu
                            :items="dropMenuItems"
                        >
                            <template v-slot:complaint>
                                <div class="dropdown__inner" @click="showComplaintForm">
                                    <button class="dropdown__value">
                                        <span>Пожаловаться</span>
                                    </button>
                                </div>
                            </template>
                        </drop-menu>
                    </div>

                    <div class="vote">
                        <likeUp
                            :isVote="currentReview.is_vote"
                            :likes="currentReview.likes"
                            @addLike="addLike"
                        />
                        <likeDown :likesDown="currentReview.dislikes ?? 0"/>
                    </div>
                </div>

                <comment-list
                    class="review__comments"
                    :entity="'review_comment'"
                    @sendComment="sendComment"
                    :isShowComments="true"
                    v-model:comments="currentReview.comments"
                />
                <add-comment
                    :reviewId="currentReview.id"
                />
            </div>
            <div class="review__right">

            </div>
        </div>
        <modal v-model:isShowModal="isShowComplaintForm">
            <template v-slot:header>
                <h3>Жалоба на отзыв</h3>
            </template>
        </modal>
    </div>
</template>
<script setup>
    import likeUp from '~/components/likes/like-up';
    import likeDown from '~/components/likes/like-down';
    import commentList from '~/components/comment-list';
    import addComment from '~/components/review-list/add-comment';
    import modal from '~/components/modal';
    import dropMenu from '~/components/drop-menu';
    import loader from '~/components/loader';
    import metaInfo from '~/components/meta-info';
    import preciseRatingView from '~/components/preciseRatingView.vue';
    import ratingPercentage from '~/components/ratingPercentage';
    import compactSku from '~/components/compact-sku';
    import { storeToRefs } from "pinia";
    import { useReviewStore } from "~/store/review";
    import { useCommentStore } from "~/store/comments";
    import { useLikeStore } from "~/store/like";

    const likeStore = useLikeStore();
    const reviewStore = useReviewStore();
    const commentStore = useCommentStore();
    const { currentReview, isLoadingCurrentReview } = storeToRefs(reviewStore);
    const { newCount, isVote } = storeToRefs(likeStore);

    const route = useRoute();

    //let isShowComments = ref(false);
    let isShowComplaintForm = ref(false);

    const dropMenuItems =  ['complaint'];


    const sendComment = obj => {
        obj.review_id = currentReview.value.id;
        commentStore.sendComment(obj);
    }

    //const toggleShowComments = () => isShowComments.value = !isShowComments.value;
    const showComplaintForm = () =>  isShowComplaintForm.value = true;
    const getCommentCountText = value => {
        switch (value) {
            case 1:
                return '1 комментарий';
            case 2:
            case 3:
            case 4:
                return '2 комментария';
            default:
                return `${value} комментариев`;
        }
    };

    const addLike = async() => {
        await likeStore.addLike({
            id: currentReview.value.id,
            entity: 'review'
        });
        currentReview.value.likes = newCount.value;
        currentReview.value.is_vote = isVote.value;
    }

    // watch(
    //     isShowComments,
    //     async (value) => {
    //         if (value && !comments.value.length) {
    //             await commentStore.loadComments(currentReview.id);
    //         }
    //     }
    // );

    useAsyncData(async() => {
        await reviewStore.loadCurrentReview(route.params.id);
    });
</script>
<style scoped lang="scss">
$greenColor: #46bd87;

.recommend-ratio {
    margin-bottom: 15px;
    color: $greenColor;
    & > span {
        font-size: larger;
        font-weight: bold;
    }
}

.loader {
    width: 200px;
    height: 200px;
}

.title {
    font-weight: 500;
    font-size: 30px;
    line-height: 56px;
    margin: 16px 0 0;
    color: #222;
    max-width: 920px;
}

.review {
    width: 100%;
    background-color: #fff;
    padding:25px;
    border-radius: 8px;
    margin-top: 60px;
    &__wrapper {
        display:flex;
    }
    &__inner {
        padding-right: 65px;
        width: 75%;
    }
    &__right {
        flex-grow: 1;
        margin-bottom: 8px;
        max-width: 336px;
        max-height: 300px;
        overflow: hidden;
    }
    &__top {
        display: flex;
    }
    &__item {
        margin: 12px 0;
        color: #2b2b2b;
        display: block;

        img {
            max-width: 100%;
            max-height: 100%;
        }

        & dt {
            font-size: 16px;
            line-height: 24px;
            font-weight: 700;
            display: inline-block;
            margin-right: 5px;
        }

        & dd {
            margin: 0;
            display: inline;
            max-width: 100%;
            word-wrap: break-word;
            word-break: break-word;
            white-space: pre-line;
        }
    }
    &__image {
        height: 200px;
        width: 200px;
        & img {
            max-height: 100%;
            max-width: 100%;
        }
    }
    &__ratings {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }
    &__rating {
        margin-bottom: 15px;
        display: flex;
        flex-direction: column;
        margin-right: 10px;
        &-text {
            font-size: 35px;
        }
        &-precise {
            margin-top: auto;
        }
    }
    &__percentage {
        margin-bottom: 15px;
    }
    &__main {
        position: relative;
        width: 100%;
        padding-left: 48px;
        display: inline-block;
        vertical-align: top;
    }
    &__bottom {
        display: flex;
        flex-wrap: wrap;
        user-select: none;
        align-items: center;
        height: 36px;
        font-size: 14px;
        line-height: 16px;
    }
    &__comment__btn {
        cursor:pointer;
        color: #04b;
        font-size: 16px;
        line-height: 1;
        &:not(:first-child) {
            margin-left: 10px;
        }
        &-add {
            flex: 1 0 auto;
        }
        &:hover {
            color: $greenColor;
        }
    }
}

.dropdown {
    margin: -5px 5px;
    &__inner {
        font-size: 14px;
        line-height: 16px;
    }
    &__value {
        margin: 0;
        border: none;
        outline: none;
        outline-offset: 2px;
        background: transparent;
        display: block;
        width: 100%;
        padding: 8px 12px;
        color: #222;
        cursor: pointer;
        user-select: none;
        text-align: left;
    }
}

.vote {
    display: flex;
    white-space: nowrap;
}

@media (max-width: 700px) {
    .review {
        &__avatar {
            position: static;
            transform: translateX(0);
        }
        &__main {
            padding: 0;
        }
        &__main__image {
            height: 200px;
        }
    }
}
@media (max-width: 900px) {
    .review {
        &__inner {
            width: 100%;
            padding: 0;
        }
    }
}
@media (max-width: 500px) {
    .title {
        font-weight: 500;
        font-size: 20px;
        line-height: 35px;
    }
    .review {
        &__main__image {
            height: 150px;
        }
    }
}
</style>
