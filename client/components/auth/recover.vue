<template>
    <form @submit.prevent="recover">
        <div class="form-group">
            <input
                v-model.trim="mail"
                name="email"
                autofocus
                placeholder="Email"
                class="form-control"
            >
            <div class="invalid-feedback" v-for="error of v$.mail.$errors" :key="error.$uid">
              {{ error.$message }}
            </div>
        </div>

      <button class="form-group btn btn-register" type="submit">Отправить</button>

      <button class="t-link form-group" type="button" @click="showRegistration">
        <span>Регистрация</span>
      </button>
    </form>
</template>

<script setup>
    import {email, helpers, required} from "@vuelidate/validators";
    import useVuelidate from "@vuelidate/core";
    import { useNuxtApp } from '#app'
    const { $api } = useNuxtApp();

    let mail = ref('');

    const rules = {
        mail: {
            required: helpers.withMessage('Поле должно быть заполнено', required),
            email: helpers.withMessage('Не правильно введен email', email)
        }
    };

    const props = defineProps({
        showMode: {
          type: String,
          default: 'login'
        }
    })
    const emit = defineEmits(['update:showMode']);

    const v$ = useVuelidate(rules, { mail });

    const showRegistration = () => emit('update:showMode', 'registration');
    const showLogin = () => emit('update:showMode', 'login');

    const recover = async () => {
        const validated = await v$.value.mail.$validate();

        if (validated) {
            await $api.recover(mail.value);
            mail.value = ''
            showLogin();
            v$.value.$reset()
        }
    }
</script>

<style scoped lang="scss">
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