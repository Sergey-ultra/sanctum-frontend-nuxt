<template>
    <div class="comment">
        <div class="comment__title">
            <div class="comment__avatar">
                <div class="comment__avatar-img">
                    <img v-if="comment.user_avatar" :src="`${$config.APP_URL}/${comment.user_avatar}`" :alt="comment.user_avatar"/>
                    <img v-else :src="`${$config.APP_URL}/storage/icons/user_avatar.png`" alt="avatar"/>
                </div>
            </div>
            <span class="comment__name">{{comment.user_name}}</span>
            <span class="comment__date">{{comment.created_at}}</span>
        </div>

        <div class="comment__body">
            <div class="comment__message">{{comment.comment}}</div>
            <div class="comment__bottom">
                <div class="comment__send" @click="toggleAnswerForm(comment)">
                    <span>+</span>
                    <span class="comment__send-dashed">Ответить</span>
                </div>


                <div class="dropdown">
                    <drop-menu :items="['complaint']">
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
                    <likeUp
                        @addLike="addLike"
                        :likes="localLikes"
                    />
                    <likeDown :likesDown="comment.dislikes ?? 0"/>
                </div>
            </div>
            <transition name="comment__answer">
                <form v-show="comment.isShowAnswerForm" class="comment__form" @submit.prevent="sendComment">
                    <textareaComponent v-model="commentField" placeholder="Написать ответ"></textareaComponent>
                    <div class="comment__buttons">
                        <buttonComponent :color="'grey'" :size="'small'" :radius="true" class="btn" @click="toggleAnswerForm(comment)">Отменить</buttonComponent>
                        <buttonComponent :color="'green-light'" :size="'small'" :radius="true" type="submit">Ответить</buttonComponent>
                    </div>
                </form>
            </transition>
        </div>
        <div v-if="comment.children" class="comment__nested">
            <comment
                v-for="child in comment.children"
                :key="child.id"
                :comment="child"
                :entity="entity"
                @toggleAnswerForm="toggleAnswerForm"
            />
        </div>
    </div>

    <modal v-model:isShowModal="isShowComplaintForm">
        <template v-slot:header>
            <h3>Жалоба на комментарий</h3>
        </template>
    </modal>
</template>

<script setup>
    import textareaComponent from '../../components/textareaComponent'
    import buttonComponent from '../../components/button-component.vue'
    import likeUp from '../likes/like-up'
    import likeDown from '../likes/like-down'
    import dropMenu from '../drop-menu'
    import modal from '../modal';
    import { useLikeStore } from "~/store/like";
    import { useNuxtApp } from '#app'
    import { storeToRefs } from "pinia";

    const { $api } = useNuxtApp();
    const likeStore = useLikeStore();
    const { isUpdatedLikeCount } = storeToRefs(likeStore);

    const emit = defineEmits(['toggleAnswerForm', 'sendComment']);

    const props = defineProps({
        comment: Object,
        entity: {
            type: String,
            default: null,
        },
    });

    const commentField = ref('');
    const isShowComplaintForm = ref(false);
    const plusLikes = ref(0);

    const localLikes = computed(() => props.comment.likes + plusLikes.value);

    const addLike = async() => {
        await likeStore.addLike({
            id: props.comment.id,
            entity: props.entity
        });
        if (isUpdatedLikeCount.value) {
            plusLikes.value = 1;
        }
    }

    const sendComment = () => {
        if (commentField.value) {
            if (!$api.isAuth.value) {
                $api.setIsShowAuthModal(true);
            } else {
                emit('sendComment',{
                    comment: commentField.value,
                    reply_id: props.comment.id,
                });
                commentField.value = '';
            }
        }
    };



    const toggleAnswerForm = comment => {
        if (!comment.isShowAnswerForm) {
            commentField.value = '';
        }
        emit('toggleAnswerForm', comment);
    };

    const showComplaintForm = () => isShowComplaintForm.value = true;
</script>

<style lang="scss" scoped>
    .comment {
        width: 100%;
        display: inline-block;
        vertical-align: top;
        &__title {
            margin: 12px 0;
            display: flex;
            align-items: center;
        }
        &__name{
            font-weight: 700;
        }
        &__date {
            margin-left:10px;
            color: #a9a9a9;
            font-size: 13px;
        }
        &__avatar {
            display: inline-block;
            vertical-align: top;
            width: 48px;
            &-img {
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

        &__body {

        }
        &__bottom {
            user-select: none;
            align-items: center;
            height: 36px;
            font-size: 14px;
            line-height: 16px;
            display: flex;
            margin-top: 8px;
        }
        &__send {
            flex: 1 0 auto;
            cursor:pointer;
            color: #a9a9a9;
            font-size: 15px;
            line-height:1;
            &-dashed {
                margin-left: 5px;
                border-bottom: 1px dashed currentColor;
            }
        }
        &__buttons {
            display:flex;
            margin-top: 15px;
        }
        &__form {
            margin-top:15px;
            display:flex;
            flex-direction: column;
            align-items:flex-end;
        }
        &__nested {
            margin-left: 30px;
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

    .btn {
        &:not(:last-child) {
            margin-right:15px;
        }
    }

</style>
