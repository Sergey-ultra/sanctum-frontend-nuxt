<template>
    <form @submit.prevent="signUp">
        <div class="form-group">
            <input
                    v-model.trim="registrationForm.name"
                    id="name"
                    type="text"
                    name="name"
                    autofocus
                    placeholder="Имя"
                    class="form-control"
            >
            <div class="invalid-feedback" v-for="error of v$.registrationForm.name.$errors" :key="error.$uid">
                {{ error.$message }}
            </div>
        </div>

        <div class="form-group">
            <input
                    v-model.trim="registrationForm.email"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="E-Mail"
                    class="form-control"
            >
            <div class="invalid-feedback" v-for="error of v$.registrationForm.email.$errors" :key="error.$uid">
                {{ error.$message }}
            </div>
        </div>

        <div class="form-group">
            <input
                    v-model.trim="registrationForm.password"
                    id="password"
                    type="password"
                    name="password"
                    autocomplete="new-password"
                    placeholder="Пароль"
                    class="form-control"
            >
            <div class="invalid-feedback" v-for="error of v$.registrationForm.password.$errors" :key="error.$uid">
                {{ error.$message }}
            </div>
        </div>

        <div class="form-group">
            <input
                    v-model.trim="registrationForm.password_confirmation"
                    id="password-confirmation"
                    type="password"
                    name="password_confirmation"
                    class="form-control"
                    placeholder="Подтвердите пароль"
            >
            <div class="invalid-feedback" v-for="error of v$.registrationForm.password_confirmation.$errors" :key="error.$uid">
                {{ error.$message }}
            </div>
        </div>


        <button class="form-group btn btn-register" type="submit">Зарегистрироваться</button>

        <div class="form-group form__hint-text">
            <span>Есть аккаунт? </span>
            <button class="t-link" type="button" @click="showLogin">Войти</button>
        </div>
    </form>
</template>

<script setup>
    import btn from "../btn";
    import useVuelidate from '@vuelidate/core'
    import { required, email, minLength, helpers } from '@vuelidate/validators'
    import { useNuxtApp } from '#app'
    const { $api } = useNuxtApp();


    const registrationForm = ref({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const rules = {
        registrationForm: {
            name: {
                required:  helpers.withMessage('Поле должно быть заполнено', required),
                minLength: helpers.withMessage('Должно быть не меньше 2 символов', minLength(2))
            },
            email: {
                required:  helpers.withMessage('Поле должно быть заполнено', required),
                email: helpers.withMessage('Не правильно введен email', email)
            },
            password: {
                required:  helpers.withMessage('Поле должно быть заполнено', required),
                minLength: helpers.withMessage('Должно быть не меньше 8 символов', minLength(8))
            },
            password_confirmation: {
                required:  helpers.withMessage('Поле должно быть заполнено', required),
                minLength: helpers.withMessage('Должно быть не меньше 8 символов', minLength(8))
            },
        },
    };

    const v$ = useVuelidate(rules, { registrationForm });



    const props = defineProps({
        showMode: {
            type: String,
            default: 'login'
        }
    })
    const emit = defineEmits(['update:showMode']);

    const showLogin = () => emit('update:showMode', 'login');

    const signUp = async () => {
        const validated = await v$.value.registrationForm.$validate();

        if (validated) {
            await $api.register(registrationForm.value);
            registrationForm.value = {
                name: '',
                email: '',
                password: '',
                password_confirmation: ''
            }
            showLogin();
            v$.value.$reset();
        }
    }
</script>

<style lang="scss" scoped>
    .form {
        &-group {
          margin-bottom: 20px;
        }
        &-control {
            border: 1px solid #ccc;
            padding: 6px 12px;
            font-size: 16px;
            font-weight: 300;
            width: 100%;
            border-radius: 4px;
            height: 35px;
            outline: medium none #000;
            &:hover {
              border-color: #878585;
              transition: background-color .3s ease 0s,border-color .3s ease 0s;
            }
        }
        &__hint-text {
          color: #595959;
          margin-right: 1px;
        }
    }

    .btn {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 40px;
        border: 1px solid #ccc;
        transition: background-color .15s linear;
        border-radius: 4px;
        color: #000;
        text-transform: uppercase;
        font-weight: 600;

        &-register {
            background-color: #1867c0;
            color: #fff;
            border: none;

            &:hover {
                background-color: #3b75c0;
            }
        }

        &-back {
            margin-top: 16px;
            background-color: transparent;

            &:hover {
                background-color: #f7f7f7;
            }
        }
    }
    .invalid-feedback {
        color: #fc675c;
    }
    button {
        background: 0 0;
        font-size: inherit;
        margin: 0;
        padding: 0;
        border: 0;
    }
    .t-link {
        color: #3766a9;
        cursor: pointer;
        &:hover {
          color: #cd192e;
        }
    }
</style>