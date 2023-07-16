<template>
    <div class="comments">
        <div class="comments__row" v-if="isLoadingComments">
            <loader class="loader"/>
        </div>
        <div
            class="comments__row"
            v-for="commentItem in comments"
            :key="commentItem.id"
        >
            <comment
                :entity="entity"
                :comment="commentItem"
                @sendComment="sendComment"
                @toggleAnswerForm="toggleAnswerForm"
            />
        </div>
    </div>
</template>

<script setup>
    import comment from './comment';
    import loader from '../loader';

    const emit = defineEmits(['sendComment', 'addLike']);

    const props = defineProps({
        isShowComments: {
            type: Boolean,
            default: false
        },
        entity: {
          type: String,
          default: null,
        },
        comments: {
            type: Array,
            default: () => []
        },
        isLoadingComments: {
            type: Boolean,
            default: false
        }
    });

    const sendComment = obj => emit('sendComment', obj);
    //const toggleAddForm = () => {
    //     isShowAddForm.value = !isShowAddForm.value;
    //     setFalseToAnswerForms(comments.value);
    // },

    const toggleAnswerForm = comment => setAnswerForms(props.comments, comment.id);

    const setAnswerForms = (comments, id) => {
        comments.forEach(comment => {
            if (comment.id === id) {
                comment.isShowAnswerForm = !comment.isShowAnswerForm
            } else {
                comment.isShowAnswerForm = false
            }

            if (comment.children && Array.isArray(comment.children)) {
                setAnswerForms(comment.children, id)
            }
        })
    };

    const setFalseToAnswerForms = comments => {
        comments.forEach(comment => {
            comment.isShowAnswerForm = false

            if (comment.children && Array.isArray(comment.children)) {
                setFalseToAnswerForms(comment.children)
            }
        })
    };

    watch(
        props.isShowComments,
        value => {
            if (value) {
                setFalseToAnswerForms(props.comments);
            }
        }
    );


    onMounted(() => setFalseToAnswerForms(props.comments));
</script>

<style lang="scss" scoped>
    .comments {
        &__row {
            padding-top: 20px;
            width: 100%;
        }
    }
    .loader {
        height: 70px;
        width: 70px;
    }
    .title {
        cursor:pointer;
        color: #04b;
        font-size: 16px;
        line-height: 1;
        &:hover {
             color: #46bd87;
        }
    }
</style>
