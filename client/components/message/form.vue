<template>
    <form @submit.prevent="sendMessage">
        <div v-if="error" class="alert-warning">
            {{ error }}
        </div>
        <div class="form__group">
            <label>
                <div class="label">
                    <span class="text-gray">
                        Добавить сообщение
                    </span>
                </div>
                <textarea-component v-model="message" rows="6" :color="'white'"/>
            </label>
            <div v-for="error of v$.message.$errors" :key="error.$uid" class="invalid-feedback">
                {{ error.$message }}
            </div>
        </div>
        <buttonComponent type="submit">
            Отправить
        </buttonComponent>
    </form>
</template>
<script setup>
import textareaComponent from '~/components/textareaComponent.vue';
import buttonComponent from '~/components/button-component.vue';
import {useMessageStore} from "~/store/message";
import {helpers, minLength, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {storeToRefs} from "pinia";

const messageStore = useMessageStore();
const { dialogUserId } = storeToRefs(messageStore);

const message = ref('');
const error = ref('');

const rules = {
    message: {
        required: helpers.withMessage('Поле должно быть заполнено', required),
    },
}

const v$ = useVuelidate(rules, { message });

const sendMessage = async() => {
    const validated = await v$.value.$validate();
    error.value = '';

    if (validated) {
        const responseMessage = await messageStore.sendMessage({
            message: message.value,
            dialog_user_id: dialogUserId.value,
        });

        if (responseMessage) {
            error.value = responseMessage;
        }
        message.value = '';
        v$.value.$reset();
    }
};
</script>
