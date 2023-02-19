<template>
    <compact-sku>
        <h2>Новые фотографии о товаре</h2>
        <form @submit.prevent="addReviewPhotos">
            <div class="form-group">
                <h4>Оценка модели</h4>

                <div>
                    <ratingForm/>
                    <div class="invalid-feedback" v-for="error of v$.rating.$errors" :key="error.$uid">
                        {{ error.$message }}
                    </div>
                </div>
            </div>

            <div class="form-group ">
                <textarea v-model.trim="editedReview.comment" placeholder="Комментарий" rows="6"></textarea>
                <div class="invalid-feedback" v-for="error of v$.editedReview.comment.$errors" :key="error.$uid">
                    {{ error.$message }}
                </div>
            </div>


            <multiple-image-upload
                class="image-upload"
                :folder="'premoderatedReviews'"
                v-model:initialImageUrls="editedReview.images"
            />

            <div class="form-group mt-4">
                <button
                        class="custom-btn btn-mod"
                        :disabled=" editedReview.comment === '' || !editedReview.images.length"
                        type="submit"
                >
                    Отправить
                </button>

                <div class="agreement">
                    Нажимая кнопку «Отправить», Вы соглашаетесь c
                    <span>
                      <nuxt-link :to="'/policy'" target="_blank">
                          условиями политики конфиденциальности.
                      </nuxt-link>
                    </span>
                </div>
            </div>
        </form>
    </compact-sku>
</template>

<script setup>
    import multipleImageUpload from "../../components/image-upload-as-form/multiple-image-upload";
    import compactSku from '../../components/compact-sku'
    import ratingForm from "../../components/rating-form";
    import useVuelidate from '@vuelidate/core'
    import { required, minLength, helpers } from '@vuelidate/validators'
    import { storeToRefs } from "pinia";
    import {useReviewStore} from "../../store/review";

    const reviewStore = useReviewStore();
    const { selectedRating, existingReview } = storeToRefs(reviewStore);

    definePageMeta({
      middleware: ["auth"]
    });

    const mustBeRating = value => value > 0;

    let rating = ref(0);
    let editedReview = ref({
        comment:'',
        images:[]
    });

    let rules = {
        rating: {
            mustBeRating:  helpers.withMessage('Нужно оценить товар', mustBeRating)
        },
        editedReview: {
            comment: {
                required:  helpers.withMessage('Поле должно быть заполнено', required),
                minLength: minLength(2)
            },
        },
    }

    const v$ = useVuelidate(rules, {editedReview, rating});

    const resetForm = () => {
        editedReview.value = {
            comment: '',
            images: []
        }
        rating.value = 0;
    }


    let route =  useRoute();
    let router =  useRouter();

    const addReviewPhotos = async () => {
        if (!existingReview.value) {
            const validated = await v$.value.editedReview.$validate();


            if (validated) {
                await reviewStore.updateOrCreateReview(editedReview.value);

                resetForm();
                v$.value.$reset();
                router.push({ name: 'reviews-product_code', params: { ...route.params }});
            }
        }
    }

    watch(() => selectedRating, value => rating.value = value);




    onMounted(async () => {
        rating.value = selectedRating
        if (existingReview === null) {
            await reviewStore.checkExistingReview()
        }
    });
</script>

<style scoped lang="scss">
    .form-group {
        margin: 12px 0;
    }
    .mt-4 {
        margin-top:20px;
    }

    .btn-mod {
        line-height: 48px;
        height: 48px;
        margin-top: 50px;
        min-width: 230px;

        &[disabled] {
            color: #ccc;
            background-color: #ffeba0;
        }

        &:not(:disabled):hover {
            background-color: #f5c423;
        }
    }
    .agreement {
        font-size:14px;
        margin-top: 20px;
    }
    .image-upload {
        height: 168px;
    }
</style>