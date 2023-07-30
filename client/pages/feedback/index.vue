<template>
    <div>
        <h1>Написать в техподдержку</h1>
        <div class="wrapper">
            <form @submit.prevent="sendMessage">
                <textarea-component v-model="message"/>
                <buttonComponent type="submit">
                    Отправить
                </buttonComponent>
            </form>
        </div>
    </div>
</template>
<script setup>
import textareaComponent from '~/components/textareaComponent.vue';
import buttonComponent from '~/components/button-component.vue';

const message = ref('');

const sendMessage = () => {

};
</script>
<style scoped lang="scss">
.wrapper {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.16);
    width: 100%;
    padding: 20px;
}
</style>
