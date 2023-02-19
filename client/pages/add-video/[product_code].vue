<template>
    <compact-sku>
        <h2>Новое видео о товаре</h2>
        <form class="form" @submit.prevent="addOrUpdateVideo">
            <h3>Добавьте видео</h3>

            <div class="form__item">
                <div class="form__item-file">
                    <div class="file-upload">
                        <div class="file-upload__content">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="38" height="31" viewBox="0 0 38 31"
                                     data-tid="9bd43b8c b04ef102">
                                    <path
                                        d="M27.556 5.167L25.403 0H12.486l-2.153 5.167h-8.34C.891 5.167 0 6.056 0 7.172v21.822C0 30.102.9 31 1.997 31h33.895c1.103 0 1.997-.89 1.997-2.006V7.172a2.003 2.003 0 0 0-1.992-2.005h-8.341zm-15.5 12.055a6.89 6.89 0 1 1 13.778 0 6.89 6.89 0 0 1-13.778 0z"
                                        fill="#D4D4D4" fill-rule="evenodd" data-tid="ef468e04"></path>
                                </svg>
                            </div>
                            <div>Добавьте видео файл сюда</div>
                        </div>
                        <input type="file" @change="setVideo($event)" name="video" accept="video/*">
                    </div>
                </div>

                <div class="invalid-feedback" v-for="error of v$.form.file.$errors" :key="error.$uid">
                    {{ error.$message }}
                </div>
            </div>



            <h3>Напишите, о чём оно</h3>
            <div class="form__item">
                <div class="form__item-description">
                    <textarea v-model.trim="form.description" placeholder="Максимум 100 символов" rows="1"></textarea>
                </div>
                <div class="invalid-feedback" v-for="error of v$.form.description.$errors" :key="error.$uid">
                    {{ error.$message }}
                </div>
            </div>


            <div class="form-group mt-4">
                <button
                    class="custom-btn btn-mod"
                    :disabled=" form.description === '' || !form.file"
                    type="submit"
                >
                    Отправить
                    <loader class="btn-loader" v-if="isUploadingVideo"/>
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
    import loader from '../../components/loader'
    import compactSku from '../../components/compact-sku'
    import {useReviewStore} from "../../store/review";
    import {helpers, minLength, required} from "@vuelidate/validators";
    import useVuelidate from "@vuelidate/core";
    import {storeToRefs} from "pinia";

    const reviewStore = useReviewStore();
    const { isUploadingVideo } = storeToRefs(reviewStore);


    let route =  useRoute();
    let router =  useRouter();
    let form = ref({
        file: '',
        description: ''
    });

    let rules = {
        form: {
            description: {
                required:  helpers.withMessage('Поле должно быть заполнено', required),
                minLength: helpers.withMessage('Должно быть не меньше 5 символов', minLength(5))
            },
            file: {
                required:  helpers.withMessage('Поле должно быть заполнено', required),
            }
        },
    }
    const v$ = useVuelidate(rules, { form });

    const clearForm = () => {
        form.value = {
            description: '',
            file: ''
        }
    }

    const setVideo = event => {
        const file  = event.target.files[0] || event.dataTransfer.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => form.value.file = e.target.result;
    }


    const addOrUpdateVideo = async () => {
        const validated = await v$.value.form.$validate();

        if (validated) {
            await reviewStore.addOrUpdateVideo(form.value);
            clearForm();
            v$.value.$reset();

            router.push({ name: 'reviews-product_code', params: { ...route.params }});
        }
    }
</script>

<style lang="scss" scoped>
    h3 {
        margin: 0;
        padding: 0;
        display: flex;
        flex-basis: 30%;
        font-family: YS Text,sans-serif;
        font-weight: 400;
        font-style: normal;
        font-stretch: normal;
        font-size: 16px;
        line-height: 24px;
        color: #222;
    }
    .form {
        display: flex;
        flex-wrap: wrap;
        &__item {
            display: flex;
            flex-basis: 70%;
            margin-bottom: 20px;
            flex-direction: column;
            color: #999;
            &-file {
                width: 500px;
                height: 118px;
            }
            &-description {
                width: 500px;
                & textarea {
                    resize: none;
                }
            }
        }
    }
    .file-upload {
        position: relative;
        border-radius: 4px;
        border: 1px solid #e6e6e6;
        height: 100%;
        &__content {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            position: absolute;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        & input {
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
        }
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
    .btn-loader {
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.82);
        display:flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        & svg {
            width: 40px;
            height: 40px;
        }
    }
    .agreement {
        font-size:14px;
        margin-top: 20px;
    }
</style>