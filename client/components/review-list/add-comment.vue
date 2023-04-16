<template>
    <form class="add-comment" @submit.prevent="send">
        <textareaComponent v-model="commentField" placeholder="Написать комментарий"></textareaComponent>
        <buttonComponent type="submit" :color="'green-light'" :radius="true" class="btn">Добавьте коммент</buttonComponent>
    </form>
</template>

<script setup>
    import textareaComponent from '../../components/textareaComponent'
    import buttonComponent from '../../components/button-component.vue'
    import {useCommentStore} from "../../store/comments";
    import { useNuxtApp } from '#app'
    const { $api } = useNuxtApp();


    const commentField = ref('');

    const props = defineProps({
        reviewId: {
            type: Number
        }
    });


    const commentStore = useCommentStore();


    const send = () => {
        if (commentField.value) {
            if (!$api.isAuth.value) {
                $api.setIsShowAuthModal(true);
            } else {
                commentStore.sendComment({
                    comment: commentField.value,
                    review_id: props.reviewId
                });
                commentField.value = '';
            }
        }
    };
</script>

<style scoped lang="scss">
    .add-comment {
        margin-top:15px;
        display:flex;
        flex-direction: column;
        align-items:flex-end;
    }

    .btn {
        margin-top: 15px;
    }
</style>