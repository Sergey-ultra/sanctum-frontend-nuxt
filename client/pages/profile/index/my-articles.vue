<template>
<div>
    <reviewsAnswersNav></reviewsAnswersNav>
    <section>
        <div class="loader__wrapper" v-if="isLoadingMyArticles">
            <loader class="loader"></loader>
        </div>
        <div class="wrapper" v-else>
            <div>
                <nuxt-link :to="{name: 'profile-index-add-article'}">Создать статью</nuxt-link>
            </div>

            <div>
                <h4 v-if="!myArticles.length">
                    У вас пока нет статей
                </h4>
                <div
                    class="item"
                    v-for="article in myArticles"
                    :key="article.id"
                >
                    {{ article.id }}
                </div>
            </div>
        </div>
    </section>
</div>
</template>

<script setup>
    import reviewsAnswersNav from "~/components/profile/reviewsAnswersNav";
    import { storeToRefs } from "pinia";

    import {useArticleStore} from "../../../store/article";
    const articleStore = useArticleStore();
    const { isLoadingMyArticles, myArticles } = storeToRefs(articleStore);


    onMounted(() => {
        articleStore.loadMyArticles();
    })
</script>

<style lang="scss" scoped>
.loader {
    width: 100px;
    height: 100px;
    &__wrapper {
        display: flex;
        justify-content: center;
        align-items:center;
    }
}
</style>