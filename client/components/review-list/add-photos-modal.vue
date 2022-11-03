<template>
    <modal v-model:isShowModal="isShowImageLoadingFormLocal">
        <template v-slot:header>
            <h2>Добавление фото или видео</h2>
        </template>

        <nuxt-link
                :to="(!isAuth || (isAuth && !existingReview))
                 ? `/add-photos/${$route.params.product_code}`
                 : `/add-review/${$route.params.product_code}`"
                class="add-photos__btn"
        >
            Добавить фотографии
        </nuxt-link>

    </modal>
</template>

<script setup>
    import modal from '../modal'
    import { storeToRefs } from "pinia";
    import {useReviewStore} from "../../store/review";
    import {useAuthStore} from "../../store/auth";

    const emit = defineEmits(['update:isShowImageLoadingForm']);
    const props = defineProps({
        isShowImageLoadingForm: {
            type: Boolean,
            default: false
        }
    });

    const reviewStore = useReviewStore();
    const authStore = useAuthStore();
    const { existingReview } = storeToRefs(reviewStore);
    const { isAuth } = storeToRefs(authStore);


    const isShowImageLoadingFormLocal = computed({
        get() {
            return props.isShowImageLoadingForm;
        },
        set(value) {
            emit('update:isShowImageLoadingForm', value);
        }
    });



    onBeforeMount(() => {
        if (isAuth.value && existingReview.value === null) {
            reviewStore.checkExistingReview();
        }
    });
</script>

<style scoped lang="scss">
    .add-photos {
        &__btn {
            font-size: 16px;
            color: #222;
            background: #e8e8e8;
            border-radius: 4px;
            margin: 32px 0 12px;
            border: 0;
            position: relative;
            line-height: 48px;
            height: 48px;
            padding: 0 20px;
            display: inline-block;
            text-decoration: inherit;
            text-align: center;
        }
    }
</style>