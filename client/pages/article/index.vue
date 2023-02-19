<template>
    <div class="articles">
        <h1>Статьи</h1>
        <div class="article__row article__row-flex" v-if="isLoadingArticlesByTag">
            <loader class="loader"/>
        </div>

        <article-item
            v-for="article in articlesWithPagination"
            :key="article.id"
            :article="article"
        >
        </article-item>
    </div>
</template>

<script setup>
    import articleItem from '../../components/article-item'
    import loader from "~/components/loader";

    import {useArticleStore} from "../../store/article";
    import { storeToRefs } from "pinia";

    const articleStore = useArticleStore();
    const { isLoadingArticlesWithPagination, articlesWithPagination } = storeToRefs(articleStore);

    await useAsyncData(async () => {
        await articleStore.loadArticlesWithPagination()
    })
</script>

<style scoped lang="scss">
.articles {
    width: 100%;
    background-color: #fff;
    padding:25px;
    border-radius: 8px;
    margin-top: 60px;
}
</style>