<template>
    <div>
        <h1>Написать в техподдержку</h1>
        <div class="wrapper">
            <div v-if="!$api.isAuth.value">
                Для обращения в техподдержку, пожалуйста, авторизуйтесь под своим логином вверху этой страницы.
            </div>
            <messageForm v-else/>
        </div>
    </div>
</template>
<script setup>
import messageForm from '~/components/message/form.vue';
import {useNuxtApp} from "#app";
const { $api } = useNuxtApp();
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
