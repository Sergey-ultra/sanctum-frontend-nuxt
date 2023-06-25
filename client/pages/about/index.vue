<template>
  <div>
    <h1 class="title">О нас</h1>
    <div class="block">
        <div class="row">
            <div class="row__item">
                <h4>Отзывы и предложения по работе сайта Smart-Beautiful.ru</h4>
<!--                <blockquote>-->
                    <p>Smart-Beautiful - это сервис отзывов и сравнения цен на косметические товары.</p>

                    <p>Сайт создан для удобного сравнения цен на косметику в популярных интернет-магазинах России.</p>

                    <p>Мы не занимаемся непосредственной продажей и коммерческой деятельностью.
                    По вопросам работы сайта можно написать на почту admin@smart-beautiful.ru</p>
<!--                </blockquote>-->

                <div>
                    Если у вас есть предложение по работе сайта, или вы нашли ошибку,
                    Напишите отзыв ниже в комментариях.
                </div>
            </div>
        </div>

        <h4>Комментарии пользователей</h4>
        <div>
            <div v-for="message in messages">
                <div>
                    <span>{{ message.message }}</span>
                    <span>{{ message.author }}</span>
                </div>
            </div>
        </div>
        <form class="form" @submit.prevent="sendMessage">
            <div class="form__row">
                <label>
                    <div class="label">
                        <span class="text-gray">Добавить сообщение</span>
                    </div>

                    <textareaComponent v-model.trim="form.message" placeholder="Комментарий"></textareaComponent>
                </label>

                <div class="invalid-feedback" v-for="error of v$.form.message.$errors" :key="error.$uid">
                    {{ error.$message }}
                </div>
            </div>

            <div class="form__row">
                <div class="form__item">
                    <inputComponent  v-model.trim="form.author" placeholder="Ваше имя"/>
                    <div class="invalid-feedback" v-for="error of v$.form.author.$errors" :key="error.$uid">
                        {{ error.$message }}
                    </div>
                </div>

                <buttonComponent class="form__item" :color="'yellow'" :radius="true" type="submit">Отправить</buttonComponent>
            </div>
        </form>
    </div>
  </div>
</template>

<script setup>
    import textareaComponent from '~/components/textareaComponent';
    import inputComponent from '~/components/input-component';
    import buttonComponent from '~/components/button-component';
    import {useNuxtApp} from "#app";
    import {helpers, minLength, required} from "@vuelidate/validators";
    import useVuelidate from "@vuelidate/core";
    const { $api } = useNuxtApp();

    const messages = ref([]);
    const form = ref({
        message: '',
        author: '',
    });
    const rules = {
        form: {
            message: {
                required:  helpers.withMessage('Поле должно быть заполнено', required),
                minLength: helpers.withMessage('Должно быть не меньше 10 символов', minLength(10)),
            },
            author: {
                required:  helpers.withMessage('Поле должно быть заполнено', required),
                minLength: helpers.withMessage('Должно быть не меньше 2 символов', minLength(2)),
            },
        }
    };

    const v$ = useVuelidate(rules, { form });
    const sendMessage = async () => {
        const validated = await v$.value.form.$validate();
        if (validated) {
            await $api.post('client-messages', form.value);
            v$.value.$reset();
            form.value = {
                message: '',
                author: '',
            };
        }
    }

    const setSEO = () => {
        const name = `О нас`;
        const metaName = `Smart-Beautiful - агрегатор цен косметических товаров ${name}`;
        useHead({
            title: name,
            meta: [
                {name: 'description', content: metaName},
                {name: 'keywords', content: metaName}
            ],
        });
    }
    setSEO();

    useAsyncData(async () => {
        const { data } = await $api.get('client-messages');
        if (Array.isArray(data)) {
            messages.value = [...data];
        }
    });
</script>

<style lang="scss" scoped>
    .input {
        width: 200px;
    }

    .block {
        width: 100%;
        margin: 20px 0;
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        align-items: center;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 6px 40px 0 rgba(56,69,94,.07);
        padding: 54px 32px;
    }
    .row {
        display: flex;
        flex-flow: column wrap;
        &__item {
            width: 50%;
            text-align: justify;
        }
    }

    .form {
        width: 100%;
        &__row {
            width: 100%;
        }
        &__item {
            margin-bottom: 20px;
        }
    }

    @media (max-width: 700px) {
        .row {
            &__item {
                width: 100%;
            }
        }
        .form {
            &__item {
                width: 100%;
            }
        }
    }
</style>
