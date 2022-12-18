<template>
    <nav class="nav">
        <div class="btn" :class="{'active': $route.name ===  'profile-index-my-articles'}">
            <nuxt-link :to="{name: 'profile-index-my-articles'}">Мои статьи</nuxt-link>
        </div>
        <div class="btn" :class="{'active': $route.name ===  'profile-index-my-reviews'}">
            <nuxt-link :to="{name: 'profile-index-my-reviews'}">Отзывы</nuxt-link>
        </div>
        <div class="btn" :class="{'active': $route.name ===  'profile-index-my-comments'}">
            <nuxt-link :to="{name: 'profile-index-my-comments'}">Комментарии</nuxt-link>
        </div>
        <div class="btn" :class="{'active': $route.name ===  'profile-index-my-article-comments'}">
            <nuxt-link :to="{name: 'profile-index-my-article-comments'}">Комментарии на статьи</nuxt-link>
        </div>
        <div class="btn" :class="{'active': $route.name ===  'profile-index-my-answers'}">
            <nuxt-link :to="{name: 'profile-index-my-answers'}">Ответы</nuxt-link>
        </div>
    </nav>
</template>
<script setup>
    import { storeToRefs } from "pinia";
    import {useAuthStore} from "../../store/auth";

    const authStore = useAuthStore();
    const { isWriter } = storeToRefs(authStore);
</script>

<style lang="scss" scoped>
    .nav {
        display: flex;
        white-space: nowrap;
        padding-bottom: 13px;
    }
    .btn {
        border-radius: 4px;
        display: flex;
        align-items: center;
        text-align: center;
        margin-right: 0;
        background-color: #e8e8e8;
        &:not(:first-child){
            margin-left: 12px;
        }
        & a {
            padding: 10px 16px;
            text-transform: capitalize;
            letter-spacing: .25px;
            font-size: 14px;
            line-height: 16px;
            color: #222;
            display: block;
            font-weight: 700;
            text-decoration: none;
            user-select: none;
        }
    }
    .active {
        background-color: #666;
        & a {
            color: #fff;
        }
    }
</style>