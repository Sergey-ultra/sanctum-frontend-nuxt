<template>
    <div>
        <h1>Блоги</h1>
        <div class="articles">
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
    </div>
</template>

<script setup>
    import articleItem from '../../components/article-item'
    import loader from "~/components/loader";

    import {useArticleStore} from "~/store/article";
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
    }
    h1 {
        color: #2c509a;
        margin: 50px 0 10px;
    }
</style>
