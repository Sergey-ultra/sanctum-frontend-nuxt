<template>
    <div class="article">
        <div class="article__row article__row-flex" v-if="isLoadingArticlesByTag">
            <loader class="loader"/>
        </div>

        <div v-else>
            <h1>{{articlesByTag.tag.tag}}</h1>
            <article-item
                v-for="article in articlesByTag.data"
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

    const route = useRoute();
    const articleStore = useArticleStore();
    const { isLoadingArticlesByTag, articlesByTag } = storeToRefs(articleStore);

    await useAsyncData(async () => {
        await articleStore.loadArticlesByTag(route.params.tag)
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
