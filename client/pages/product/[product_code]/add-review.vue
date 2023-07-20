<template>
    <compact-sku>
        <div class="review">
            <h2 class="">Отзыв о товаре</h2>
            <div v-if="isCheckingExistingReview" class="loader-wrapper">
                <loader class="loader"/>
            </div>
            <div v-else class="review__wrapper">
                <form  class="form review__form" @submit.prevent="saveReview" >
                    <div class="form__group">
                        <h4>Оценка модели</h4>
                        <div>
                            <ratingForm :initLoading="false"/>
                            <div class="invalid-feedback" v-for="error of r$.rating.$errors" :key="error.$uid">
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

                        <div class="label">
                            <span class="text-gray">Текст отзыва: (20 слов минимум)</span>
                        </div>
    <!--                        <textareaComponent-->
    <!--                            rows="10"-->
    <!--                            v-model.trim="editedReview.body"-->
    <!--                            :color="'white'"-->
    <!--                        />-->
                        <reviewBody
                            v-model="editedReview.body"
                            @saveAsDraft="saveAsDraft"
                            class="body"/>
    <!--                            <editor-js class="body" v-model="editedReview.body"/>-->
    <!--                            <ckEditorComponent v-model="editedReview.body"></ckEditorComponent>-->




                        <div class="invalid-feedback" v-for="error of v$.editedReview.body.$errors" :key="error.$uid">
                            {{ error.$message }}
                        </div>
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
                        <button class="add-btn" :disabled="isUploadingReview" type="submit">Опубликовать</button>

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
                <div class="review__notification">
                    Не пишите в поле <b>Ваше общее впечатление</b> название объекта отзыва, т.к. оно автоматически добавляется при просмотре Вашего отзыва.
                    <br>
                    <br>
                    <b>Не копируйте в отзыв текст и фото с других сайтов</b>, а также не вставляйте ссылки на другие сайты. За это модератор может серьезно наказать в соответствии с правилами сайта.
                    <br>
                    <br>
                    Если Вы вставляете ссылки на свои отзывы, то они должны быть уместны и не вводить в заблуждение читателя (он должен четко понимать куда ведет ссылка).
                    <br>
                    <br>
                    Кроме того, в некоторых разделах наложены ограничения на добавление фото.
                </div>
            </div>
        </div>
    </compact-sku>
</template>

<script setup>
import ratingForm from "~/components/rating-form";
import compactSku from '~/components/compact-sku';
import loader from "~/components/loader";
import inputComponent from '~/components/input-component';
import radioComponent from '~/components/radioComponent.vue';
import reviewBody from '~/components/review-body/index.vue';
 import multipleImageUpload from "~/components/image-upload-as-form/multiple-image-upload";
// import textareaComponent from '~/components/textareaComponent';
import editor from "~/components/editor/index.vue";
// import ckEditorComponent from "~/components/ckEditorComponent";

import { useNuxtApp } from '#app'
import useVuelidate from '@vuelidate/core'
import {required, minLength, helpers, maxLength} from '@vuelidate/validators';
import { storeToRefs } from "pinia";
import {useReviewStore} from "~/store/review";
import {useCurrentSkuStore} from "~/store/currentSku";
import calculateSymbolCount from '~/utils/symbolCount';


const { $api } = useNuxtApp();

const reviewStore = useReviewStore();
const currentSkuStore = useCurrentSkuStore();
const { isUploadingReview, existingReview, selectedRating, isCheckingExistingReview } = storeToRefs(reviewStore);
const { currentSkuId } = storeToRefs(currentSkuStore);

let router = useRouter();
let route = useRoute();

let rating = ref(0);

let editedReview = ref({
    title: '',
    body: {
        blocks: [
            {
                type: 'paragraph',
                data: {
                    text: ''
                }
            }
        ],
    },
    plus: '',
    minus: '',
    anonymously: 0,
    is_recommend: 1,
});
const mustBeRating = value => value > 0;
let rulesRating = {
    rating: {
        mustBeRating: helpers.withMessage('Нужно оценить товар', mustBeRating),
    },
}
let rulesReview = {
    editedReview: {
        title: {
            required: helpers.withMessage('Поле должно быть заполнено', required),
            minLength: minLength(5),
            maxLength: maxLength(256),
        },
        body: {
            symbolCount: helpers.withMessage('Поле должно быть заполнено', value => calculateSymbolCount(value) > 0),
        },
        plus: {
            required: helpers.withMessage('Поле должно быть заполнено', required),
            minLength: minLength(5),
        },
        minus: {
            required: helpers.withMessage('Поле должно быть заполнено', required),
            minLength: minLength(5),
        },
    },
};


const r$ = useVuelidate(rulesRating, { rating });
const v$ = useVuelidate(rulesReview, { editedReview });

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
        body: existingReview.value.body && Object.keys(existingReview.value.body).length
            ? existingReview.value.body
            : {
                blocks: [
                    {
                        type: 'paragraph',
                        data: {
                            text: ''
                        }
                    }
                ],
            },
    }
};

const clearForm = () => {
    editedReview.value = {
        title: '',
        body: '',
        plus: '',
        minus: '',
        is_recommend: 1,
    };
    rating.value = 0;
};

const saveAsDraft = async () => {
    if (!$api.isAuth.value) {
        $api.setIsShowAuthModal(true);
    } else {
        v$.value.$reset();
        r$.value.$reset();
        const validated = await r$.value.$validate();
        if (validated) {
            await reviewStore.updateOrCreateReview({
                ...editedReview.value,
                asDraft: true
            });
            r$.value.$reset();
        }
    }
}
const saveReview = async () => {
    if (!$api.isAuth.value) {
        $api.setIsShowAuthModal(true);
    } else {
        const mainFormValidated = await v$.value.$validate();
        const ratingValidated = await r$.value.$validate();

        if (mainFormValidated && ratingValidated) {
            await reviewStore.updateOrCreateReview(editedReview.value);

            clearForm();
            v$.value.$reset();

            await router.push(`/product/${route.params.product_code}`);
        }
    }
}

onMounted(async () => {
    rating.value = selectedRating.value;
    if ($api.isAuth.value && currentSkuId) {
        await reviewStore.checkExistingReview();
        if (existingReview.value) {
            initEditedReview();
        }
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
    &__wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 15px;
    }
    &__form {
        flex-grow: 1;
        //flex-shrink: 0;
    }
    & textarea {
        min-height: 60px;
    }
    &__notification {
        width: 264px;
        margin-top: 130px;
        //flex-shrink: 1;
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
@media (max-width: 900px) {
    .review {
        &__form {
           order: 2;
        }
        &__notification {
            padding: 10px;
            border-radius: 5px;
            background-color: #ffeaf2;
            margin-top: 0;
            order: 1;
            width: 100%;
        }
    }
}
</style>
