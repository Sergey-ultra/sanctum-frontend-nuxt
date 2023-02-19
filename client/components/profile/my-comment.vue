<template>
    <my-published
            @showEditForm="showEditForm"
            @showDeleteForm="showDeleteForm"
    >
        <template v-slot:status v-if="['moderated', 'rejected'].includes(comment.status)">
            <div
                v-if="comment.status === 'moderated'"
                class="status status-moderated"
            >
                <span class="status__icon">
                    <svg><use xlink:href="#icons_question-circle">
                        <symbol viewBox="0 0 24 24" id="icons_question-circle">
                            <path fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1m0 1.75c5.1 0 9.25 4.15 9.25 9.25S17.1 21.25 12 21.25 2.75 17.1 2.75 12 6.9 2.75 12 2.75zm-1.5 13.293c0 .718.479 1.162 1.244 1.162.766 0 1.237-.444 1.237-1.162 0-.725-.471-1.169-1.237-1.169-.765 0-1.244.444-1.244 1.169zm1.456-8.996c-2.099 0-3.288 1.176-3.322 2.878h1.852c.041-.752.561-1.237 1.347-1.237.779 0 1.299.451 1.299 1.086 0 .636-.267.964-1.149 1.491-.943.553-1.319 1.169-1.23 2.262l.014.376h1.811v-.362c0-.656.253-.991 1.162-1.518.964-.567 1.463-1.285 1.463-2.31 0-1.579-1.292-2.666-3.247-2.666z"></path>
                        </symbol>
                    </use></svg>
                </span>
                <span>Ожидает публикации</span>
            </div>
            <div
                v-else-if="comment.status === 'rejected'"
                class="status status-rejected"
            >
                <span>Комментарий отклонен</span>
            </div>
        </template>

        <template v-slot:title>
            <div class="comment__title">
                <div class="comment__title-name">
                    <span>Комментарий на</span>
                    <nuxt-link class="ml" v-if="comment.url" :to="comment.url">{{ comment.body }}</nuxt-link>
                    <span  class="ml" v-else>{{ comment.body }}</span>
                </div>
            </div>
        </template>
        <div>{{ comment.comment }}</div>
    </my-published>

    <delete-form
            :selectedName="`Отзыв на ${comment.body}`"
            v-if="isShowDeleteForm"
            v-model:isShowDeleteForm="isShowDeleteForm"
            @delete="deleteCurrentComment"
    />
</template>

<script setup>
    import deleteForm from '../delete-form'
    import myPublished from "./my-published";

    const emit = defineEmits(['deleteItem']);
    const props = defineProps({
        comment: {
            default: null
        }
    });

    const isShowDeleteForm = ref(false);
    const showDeleteForm = () => isShowDeleteForm.value = true;

    const deleteCurrentComment = () => {
        emit('deleteItem');
        isShowDeleteForm.value = false;
    };

    const showEditForm = () => {
       // navigateTo({ name: 'edit-comment'});
    };
</script>

<style scoped lang="scss">
    .status {
        margin: -16px -16px 16px;
        padding: 14px 16px 14px 20px;
        font-size: 15px;
        line-height: 18px;
        &__icon svg{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            width: 20px;
            height: 20px;
        }
        &-moderated {
            background-color: #fff8d9;
            & .status__icon {
                display: inline;
                color: #ffa300;
                margin: 8px;
                position: relative;
                & svg {
                    fill: #ffa300 !important;
                }

            }
            & span {
                display: inline;
                margin: 8px;
                color: #ffa300;
            }
        }
        &-rejected {
            background-color: #ffe1e1;
            & span {
                display: inline;
                color: #c70000;
                margin: 8px;
            }
        }
    }
    a {
        text-decoration: none;
    }
    .comment {
        &__title {
            display: flex;
            align-items: center;
            letter-spacing: .1px;
            min-height: 40px;
            &-name {
                display: flex;
            }
        }
    }
    .ml {
        margin-left: 10px;
    }
</style>