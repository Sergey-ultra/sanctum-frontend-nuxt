<template>
    <form class="form" @submit.prevent="changePassword">
        <div class="form__title">Смена пароля</div>
        <div class="form__row">
            <label>
                <div class="label">
                    <span class="text-gray">Текущий пароль</span>
                </div>
                <inputComponent v-model="changePasswordForm.password"/>
            </label>
            <div class="invalid-feedback" v-for="error of v$.changePasswordForm.password.$errors" :key="error.$uid">
                {{ error.$message }}
            </div>
        </div>
        <div class="form__row">
            <label>
                <div class="label">
                    <span class="text-gray">Новый пароль</span>
                </div>
                <inputComponent v-model="changePasswordForm.new_password"/>
            </label>
            <div class="invalid-feedback" v-for="error of v$.changePasswordForm.new_password.$errors" :key="error.$uid">
                {{ error.$message }}
            </div>
        </div>
        <div class="buttons">
            <buttonComponent :color="'blue'" :radius="true" type="submit">Сохранить</buttonComponent>
        </div>
    </form>
</template>
<script setup>
    import buttonComponent from "~/components/button-component.vue";
    import inputComponent from "~/components/input-component.vue";
    import { helpers, minLength, required } from "@vuelidate/validators";
    import useVuelidate from "@vuelidate/core";
    import { useNuxtApp } from "#app";
    const { $api } = useNuxtApp();

    const changePasswordForm = ref({
        password: '',
        new_password: '',
    });
    const rules = {
        changePasswordForm: {
            password: {
                required:  helpers.withMessage('Поле должно быть заполнено', required),
                minLength: helpers.withMessage('Должно быть не меньше 8 символов', minLength(8))
            },
            new_password: {
                required:  helpers.withMessage('Поле должно быть заполнено', required),
                minLength: helpers.withMessage('Должно быть не меньше 8 символов', minLength(8))
            },
        },
    };

    const v$ = useVuelidate(rules, { changePasswordForm });
    const changePassword = async () => {
        const validated = await v$.value.changePasswordForm.$validate();

        if (validated) {
            await $api.changePassword(changePasswordForm.value);
            changePasswordForm.value = {
                password: '',
                new_password: ''
            }
            v$.value.$reset();
        }
    }
</script>
<style scoped lang="scss">

</style>
