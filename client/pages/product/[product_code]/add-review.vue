<template>
    <compact-sku>
        <div class="review">
            <h2 class="">Отзыв о товаре</h2>
            <div v-if="isCheckingExistingReview" class="loader-wrapper">
                <loader class="loader"/>
            </div>
            <form v-else class="form review__form" @submit.prevent="saveReview" >
                <div class="form__group">
                    <h4>Оценка модели</h4>
                    <div>
                        <ratingForm :initLoading="false"/>
                        <div class="invalid-feedback" v-for="error of v$.rating.$errors" :key="error.$uid">
                            {{ error.$message }}
                        </div>
                    </div>
                </div>

                <div class="form__group">
                    <label>
                        <div class="label">
                            <span class="text-gray">Ваше общее впечатление в двух словах: (от 1 до 15 слов)</span>
                        </div>
                        <inputComponent v-model="editedReview.title" :color="'white'"/>
                    </label>

                    <div class="invalid-feedback" v-for="error of v$.editedReview.title.$errors" :key="error.$uid">
                        {{ error.$message }}
                    </div>
                </div>

                <div class="form__group">
                    <label>
                        <div class="label">
                            <span class="text-gray">Достоинства</span>
                        </div>
                        <inputComponent v-model.trim="editedReview.plus" :color="'white'"/>
                    </label>

                    <div class="invalid-feedback" v-for="error of v$.editedReview.plus.$errors" :key="error.$uid">
                        {{ error.$message }}
                    </div>
                </div>

                <div class="form__group">
                    <label>
                        <div class="label">
                            <span class="text-gray">Недостатки</span>
                        </div>
                        <inputComponent v-model.trim="editedReview.minus" :color="'white'"/>
                    </label>

                    <div class="invalid-feedback" v-for="error of v$.editedReview.minus.$errors" :key="error.$uid">
                        {{ error.$message }}
                    </div>
                </div>

                <div class="form__group">
                    <label>
                        <div class="label">
                            <span class="text-gray">Текст отзыва: (20 слов минимум)</span>
                        </div>
                        <textareaComponent
                            rows="10"
                            v-model.trim="editedReview.body"
                            :color="'white'"
                        >
                        </textareaComponent>
                    </label>

                    <div class="invalid-feedback" v-for="error of v$.editedReview.body.$errors" :key="error.$uid">
                        {{ error.$message }}
                    </div>
                </div>

                <h4>Фотографии отзыва</h4>

                <multiple-image-upload
                    class="image-upload"
                    :entity="`review`"
                    v-model:initialImageUrls="editedReview.images"
                />

                <div class="form__group ">
                    <label>
                        <input v-model="anonymouslyLocal" type="checkbox"/>
                        <span>Оставить отзыв анонимно</span>
                    </label>
                </div>

                <div class="form__group">
                    <div class="label">
                        <span class="text-gray">Порекоммендовали бы друзьям?</span>
                    </div>
                    <div>
                        <radioComponent
                            v-model="editedReview.is_recommend"
                            :value="1"
                        >
                            <span>Да</span>
                        </radioComponent>
                        <radioComponent
                            v-model="editedReview.is_recommend"
                            :value="0"
                        >
                            <span>Нет</span>
                        </radioComponent>

                    </div>
                </div>


                <div class="form__group mt-4">
                    <button class="add-btn" :disabled="isUploadingReview" type="submit">Отправить</button>

                    <div class="agreement">
                        Нажимая кнопку «Отправить», Вы соглашаетесь c
                        <span>
                            <nuxt-link :to="{ name: 'policy' }" target="_blank">
                                условиями политики конфиденциальности.
                            </nuxt-link>
                        </span>
                    </div>
                </div>
            </form>
        </div>
    </compact-sku>
</template>

<script setup>
import multipleImageUpload from "~/components/image-upload-as-form/multiple-image-upload";
import ratingForm from "~/components/rating-form";
import compactSku from '~/components/compact-sku';
import loader from "~/components/loader";
import textareaComponent from '~/components/textareaComponent';
import inputComponent from '~/components/input-component';
import radioComponent from '~/components/radioComponent.vue';
import { useNuxtApp } from '#app'
import useVuelidate from '@vuelidate/core'
import {required, minLength, helpers, maxLength} from '@vuelidate/validators';
import { storeToRefs } from "pinia";
import {useReviewStore} from "~/store/review";
import {useCurrentSkuStore} from "~/store/currentSku";

const { $api } = useNuxtApp();

const reviewStore = useReviewStore();
const currentSkuStore = useCurrentSkuStore();
const { isUploadingReview, existingReview, selectedRating, isCheckingExistingReview } = storeToRefs(reviewStore);
const { currentSkuId } = storeToRefs(currentSkuStore);



let rating = ref(0);

let editedReview = ref({
    title: '',
    body:'',
    plus:'',
    minus:'',
    images:[],
    anonymously: 0
});
const mustBeRating = value => value > 0;
let rules = {
    rating: {
        mustBeRating:  helpers.withMessage('Нужно оценить товар', mustBeRating)
    },
    editedReview: {
        title: {
            required:  helpers.withMessage('Поле должно быть заполнено', required),
            minLength: minLength(5),
            maxLength: maxLength(256)
        },
        body: {
            required:  helpers.withMessage('Поле должно быть заполнено', required),
            minLength: minLength(5)
        },
        plus: {
            required:  helpers.withMessage('Поле должно быть заполнено', required),
            minLength: minLength(5)
        },
        minus: {
            required:  helpers.withMessage('Поле должно быть заполнено', required),
            minLength: minLength(5)
        },
    }
};
const v$ = useVuelidate(rules, {editedReview, rating});



const anonymouslyLocal = computed({
    get() {
        return Boolean(editedReview.value.anonymously);
    },
    set(value) {
        editedReview.value.anonymously = Number(value);
    }
});

watch(
    existingReview,
    value => {
        if (value) {
            initEditedReview();
        }
    }
);

watch(selectedRating, value => rating.value = value);

watch(currentSkuId, async (value) => {
        if (value && $api.isAuth.value) {
            await reviewStore.checkExistingReview();
        }
    }
);

const initEditedReview = () => {
    editedReview.value = {
        ...existingReview.value,
        images: Array.isArray(existingReview.value.images)
            ? [...existingReview.value.images]
            : []
    }
};

let router =  useRouter();
let route =  useRoute();

const saveReview = async () => {
    if (!$api.isAuth.value) {
        $api.setIsShowAuthModal(true);
    } else {
        const validated = await v$.value.$validate();

        if (validated) {
            await reviewStore.updateOrCreateReview(editedReview.value);
            editedReview.value = {
                title: '',
                body: '',
                plus: '',
                minus: '',
                images: []
            };
            rating.value = 0;
            v$.value.$reset();
            router.push(`/product/${route.params.product_code}`);
        }
    }
}





onMounted(async () => {
    rating.value = selectedRating.value;
    if ($api.isAuth.value && currentSkuId) {
        await reviewStore.checkExistingReview();
    }
});
</script>

<style lang="scss" scoped>
.loader {
    width: 70px;
    height: 70px;

    &-wrapper {
        display: flex;
        justify-content: center;
        position: absolute;
        z-index: 3;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.82);
    }
}



input[type=checkbox] {
    margin-right: 10px;
}

.review {
    position: relative;
    &__form {
        width: 100%;
    }
    & textarea {
        min-height: 60px;
    }
}


.form-label {
    color:#42b983;
    font-size:20px;
}
.form-check {
    margin-right: 25px;
}

.add-btn {
    margin-top: 50px;
    min-width: 230px;
    border-radius: 4px;
    transition: all 0.12s ease-out;
    background-color: #fc0;
    padding: 0 20px;
    width: 25%;
    line-height: 48px;
    height: 48px;
    color: inherit;
    text-decoration: none;
    text-align: center;
    border:0;
    &:hover {
        background-color: #f5c423;
    }
}
.agreement {
    font-size:14px;
    margin-top: 20px;
}
.mt-4 {
    margin-top:20px;
}

.invalid-feedback {
    color: #fc675c;
}
.image-upload {
    // height: 168px;
}
</style>
