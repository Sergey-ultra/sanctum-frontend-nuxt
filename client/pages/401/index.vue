<template>
   <div class="main">
      <img :src="`${$config.APP_URL}/storage/icons/401.svg`"/>
      <h2>{{ text }}</h2>
      <button class="btn">
         <nuxt-link :to="route.query.from">Назад</nuxt-link>
      </button>
      <button class="btn btn-login" @click="$api.setIsShowAuthModal(true)">
         <span>Войти</span>
      </button>
   </div>
</template>

<script setup>
    import {useNuxtApp, useRuntimeConfig} from '#app'
    const { $api } = useNuxtApp();
    const config = useRuntimeConfig();
    const route = useRoute();

    const text = computed(() => {
        switch (route.query.to) {
            case 'add-photos':
                return 'Войдите, чтобы оставить фото о товаре'
            case 'add-review':
                return 'Войдите, чтобы оставить отзыв о товаре'
            default:
                return 'Вы не авторизованы'
        }
    });



    const setSEO = (text) => {
        const metaName = `${config.public.siteTitle} ${text}`;
        useHead({
            title: text,
            meta: [
                {name: 'description', content: metaName},
                {name: 'keywords', content: metaName}
            ],
        });
    }

    setSEO(text.value);


</script>

<style scoped lang="scss">
   .main {
      padding: 20px;
      min-height: 400px;
      background-color: #fff;
      border-radius: 8px;
      width: 100%;
      margin: 48px auto;
      text-align: center;
   }
   .btn {
      transition: all .12s ease-out;
      background-color: #e8e8e8;
      padding: 0 16px;
      height: 44px;
      border: 0;
      border-radius: 4px;
      position: relative;
      line-height: 36px;
      &:not(:last-child) {
         margin-right: 10px;
      }
      & a {
         text-decoration: none;
         color: #2b2b2b;
         font-size: 16px;
         font-weight: 700;
         line-height: 44px;
      }
      &-login {
         background-color: #fc0;
         color: #2b2b2b;
         font-size: 16px;
         font-weight: 700;
         line-height: 44px;
      }
   }
</style>
