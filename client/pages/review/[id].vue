<template>
    <div class="review">
        <loader
            class="loader"
            v-if="isLoadingCurrentReview"
        />
        <div v-else>
            <h2 class="title">{{ currentReview.title }}</h2>
            <metaInfo :currentEntity="currentReview"/>
            <ratingView :rating="Number(currentReview.rating)"/>
            <div class="review__items">
                <dl v-if="currentReview.plus" class="review__item">
                    <dt>Достоинства:</dt>
                    <dd>{{ currentReview.plus }}</dd>
                </dl>

                <dl v-if="currentReview.minus" class="review__item">
                    <dt>Недостатки:</dt>
                    <dd>{{ currentReview.minus }}</dd>
                </dl>


                <div v-if="currentReview.body" class="review__item">
                    <div v-html="currentReview.body"></div>
                </div>
            </div>

            <div  class="review__bottom" v-if="currentReview.plus && currentReview.minus && currentReview.body">

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
                            <div class="dropdown__inner"  @click="showComplaintForm">
                                <button class="dropdown__value">
                                    <span>Пожаловаться</span>
                                </button>
                            </div>
                        </template>
                    </drop-menu>
                </div>

                <div class="vote">
                    <likeUp
                        @addLike="addLike"
                        :likes="currentReview.likes"/>
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
    import loader from '../../components/loader';
    import metaInfo from '../../components/meta-info';
    import { storeToRefs } from "pinia";
    import { useReviewStore } from "~/store/review";
    import { useCommentStore } from "~/store/comments";
    import { useLikeStore } from "~/store/like";

    const likeStore = useLikeStore();
    const reviewStore = useReviewStore();
    const commentStore = useCommentStore();
    const { currentReview, isLoadingCurrentReview } = storeToRefs(reviewStore);
    const { isUpdatedLikeCount } = storeToRefs(likeStore);

    const route = useRoute();

    //let isShowComments = ref(false);
    let isShowComplaintForm = ref(false);
    const dropMenuItems =  ['complaint'];

    const sendComment = obj => {
        obj.review_id = props.currentReview.id;
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
        if (isUpdatedLikeCount.value) {
            currentReview.value.likes += 1;
        }
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
.loader {
    width: 200px;
    height: 200px;
}

.title {
    font-weight: 500;
    font-size: 45px;
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
            color: #46bd87;
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
@media (max-width: 500px) {
    .review {
        &__main__image {
            height: 150px;
        }
    }
}
</style>
