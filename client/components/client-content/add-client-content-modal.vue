<template>
    <modal v-model:isShowModal="isShowImageLoadingFormLocal">
        <template v-slot:header>
            <h2>Добавление видео</h2>
        </template>
<!--        <div>-->
<!--            <div>-->
<!--                <nuxt-link-->
<!--                    :to="(!$api.isAuth.value || ($api.isAuth.value && !existingReview))-->
<!--                         ? `/product/${$route.params.product_code}/add-photos`-->
<!--                         : `/product/${$route.params.product_code}/add-review`"-->
<!--                    class="btn"-->
<!--                >-->
<!--                    Загрузить фотографии-->
<!--                </nuxt-link>-->
<!--            </div>-->
<!--            <span class="description">До 15 файлов; JPG, PNG, BMP</span>-->
<!--        </div>-->

        <div>
            <div>
                <nuxt-link :to="`/product/${$route.params.product_code}/add-video`" class="btn">
                    Загрузить видео
                </nuxt-link>
            </div>
            <span class="description">1 видео-файл; MP4, HD, MOV, WEBM</span>
        </div>
    </modal>
</template>

<script setup>
    import modal from '../modal'
    import { storeToRefs } from "pinia";
    import {useReviewStore} from "~/store/review";
    import { useNuxtApp } from '#app'
    const { $api } = useNuxtApp();


    const emit = defineEmits(['update:isShowImageLoadingForm']);
    const props = defineProps({
        isShowImageLoadingForm: {
            type: Boolean,
            default: false
        }
    });

    const reviewStore = useReviewStore();
    const { existingReview } = storeToRefs(reviewStore);



    const isShowImageLoadingFormLocal = computed({
        get() {
            return props.isShowImageLoadingForm;
        },
        set(value) {
            emit('update:isShowImageLoadingForm', value);
        }
    });



    onBeforeMount(() => {
        if ($api.isAuth.value && existingReview.value === null) {
            reviewStore.checkExistingReview();
        }
    });
</script>

<style scoped lang="scss">
    .btn {
        font-size: 16px;
        color: #222;
        background: #e8e8e8;
        border-radius: 4px;
        margin: 32px 0 12px;
        border: 0;
        position: relative;
        line-height: 48px;
        height: 48px;
        min-width: 200px;
        padding: 0 20px;
        display: inline-block;
        text-decoration: inherit;
        text-align: center;
    }
    .description {
        color: #999;
        font-size: 12px;
    }
    @media (max-width: 500px) {
       h2 {
           font-size: 20px;
       }
    }
</style>
