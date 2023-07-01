<template>
    <div class="wrapper">
        <h2 class="title">Сообщения</h2>
        <div>
            <div class="message" v-for="message in messages" :key="message.id">
                {{ message.message }}
            </div>
        </div>
    </div>
</template>
<script setup>
import {useNuxtApp} from "#app";

const { $api } = useNuxtApp();
const messages = ref([]);

onMounted(async () => {
    const { data } = await $api.get('/my-messages');

    if (data && Array.isArray(data.data)) {
        messages.value = [...data.data];
    }

});
</script>
<style scoped lang="scss">
.wrapper {
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.16);
    background-color: #fff;
    flex-wrap: wrap;
    height: 100%;
}
.message {
    position: relative;
    padding: 16px;
    cursor: pointer;
    overflow: hidden;
    border-bottom: 1px solid #e2e6e9;
    &:hover {
        background-color: #f5f7f9;
    }
}
</style>
