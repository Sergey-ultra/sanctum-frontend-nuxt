<template>
    <section class="users">
        <div class="title">Лучшие пользователи</div>
        <div class="users__wrapper">
            <div
                v-for="user in bestUsers"
                :key="user.id"
                class="users__item">
                <img :src="`${$config.APP_URL}/${user.avatar}`" :alt="user.name">
                <div>
                    <nuxt-link :to="`/users/${user.id}`">{{ user.name }}</nuxt-link>
                    <div>Отзывов {{ user.review_count }}</div>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup>
import {useUserStore} from "~/store/user";
import {storeToRefs} from "pinia";

const userStore = useUserStore();
const { bestUsers } = storeToRefs(userStore);

useAsyncData(async () => {
    await userStore.loadBestUsers();
});
</script>
<style scoped lang="scss">
.title {
    font-weight: 500;
    line-height: 32px;
    font-size: 26px;
    color: #222;
    margin-bottom:20px;
    display:block;
}
    .users {
        &__wrapper {
            height: calc(100% - 52px);
            border-radius: 8px;
            background-color: #ffeaf2;
            padding: 20px;
        }
        &__item {
            display: flex;
            margin-bottom: 20px;
            & img {
                margin-right: 15px;
                border-radius: 50%;
                width: 50px;
                height: 50px;
            }
        }
    }
</style>
