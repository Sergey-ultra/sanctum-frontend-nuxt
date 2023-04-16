<template>
    <div class="review__main">
        <review-common :review="review"/>

        <div  class="review__bottom" v-if="review.plus && review.minus && review.comment">
            <div class="review__comment__btn" @click="toggleShowComments" v-if="review.comments_count">
                <span v-if="isShowComments">Скрыть комментарии</span>
                <span v-else>
                    {{ getCommentCountText(review.comments_count) }}
                </span>
            </div>

            <div class="review__comment__btn review__comment__btn-add" @click="toggleAddComment">
                Комментировать
            </div>

            <div class="dropdown">
                <drop-menu
                        :items="dropMenuItems"
                >
                    <template v-slot:complaint>
                        <div class="dropdown__inner"  @click="showComplaintForm()">
                            <button class="dropdown__value">
                                <span>Пожаловаться</span>
                            </button>
                        </div>
                    </template>
                </drop-menu>
            </div>

            <div class="vote">
                <likeUp :likesUp="review.likes ?? 0"></likeUp>
                <likeDown :likesDown="review.dislikes ?? 0"></likeDown>
            </div>
        </div>

        <comment-list
                class="review__comments"
                v-if="isShowComments"
                @sendComment="sendComment"
                :isShowComments="isShowComments"
                :comments="comments"
                :isLoadingComments="isLoadingComments"
        />
        <add-comment
                v-if="isAddComment"
                :reviewId="review.id"
        />

        <modal v-model:isShowModal="isShowComplaintForm">
            <template v-slot:header>
                <h3>Жалоба на отзыв</h3>
            </template>
        </modal>
    </div>
</template>

<script setup>
    import likeUp from '../likes/like-up'
    import likeDown from '../likes/like-down'
    import commentList from '../comment-list'
    import addComment from './add-comment'
    import modal from '../modal'
    import dropMenu from '../drop-menu'
    import reviewCommon from '../review-common'
    import {useCommentStore} from "../../store/comments";
    import { storeToRefs } from "pinia";


    const commentStore = useCommentStore();
    const { comments, isLoadingComments } = storeToRefs(commentStore);


    const props = defineProps({
        review: {
            type: Object
        }
    });

    let isShowComments = ref(false);
    let isAddComment = ref(false);
    let isShowComplaintForm = ref(false);
    const dropMenuItems =  ['complaint'];

    const sendComment = obj => {
        obj.review_id = props.review.id;
        commentStore.sendComment(obj);
    }
    const toggleShowComments = () => isShowComments.value = !isShowComments.value;
    const toggleAddComment = () => isAddComment.value = !isAddComment.value;
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

    watch(
        isShowComments,
        async (value) => {
            if (value && !comments.value.length) {
                await commentStore.loadComments(props.review.id);
            }
        }
    );
</script>

<style scoped lang="scss">
    .review {
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