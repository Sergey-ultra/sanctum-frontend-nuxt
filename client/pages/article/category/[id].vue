<template>
    <div class="article">
        <div class="article__row article__row-flex" v-if="isLoadingArticlesByCategory">
            <loader class="loader"/>
        </div>

        <div v-else>
            <h1>{{ articlesByCategory.category.name }}</h1>
            <article-item
                    v-for="article in articlesByCategory.data"
                    :key="article.id"
                    :article="article"
            >
            </article-item>
        </div>
    </div>
</template>
<script setup>
    import articleItem from '../../../components/article-item'
    import {useArticleStore} from "~/store/article";
    import { storeToRefs } from "pinia";

    const route =  useRoute();
    const articleStore = useArticleStore();
    const { isLoadingArticlesByCategory, articlesByCategory } = storeToRefs(articleStore);

    await useAsyncData(async () => {
        await articleStore.loadArticlesByCategory(route.params.id)
    })
</script>
<style scoped lang="scss">
    .article {
        background-color: #fff;
        border-radius: 8px;
        margin-top: 60px;
        padding: 25px;
        width: 100%;
    }
</style>