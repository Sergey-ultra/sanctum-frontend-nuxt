<template>
<div>
    <reviewsAnswersNav></reviewsAnswersNav>
    <section>
        <div class="loader__wrapper" v-if="isLoadingMyArticles">
            <loader class="loader"></loader>
        </div>
        <div class="wrapper" v-else>
            <div>
                <h4 v-if="!myArticles.length">
                    У вас пока нет статей
                </h4>
                <my-article
                    @deleteItem="articleStore.deleteItem(article.id)"
                    v-for="article in myArticles"
                    :key="article.id"
                    :article="article"
                />

                <pagination
                    v-if="myArticles.length && myArticlesLastPage > 1"
                    v-model:currentPage="currentPageLocal"
                    :lastPage="myArticlesLastPage"
                />
            </div>
        </div>
    </section>
</div>
</template>

<script setup>
    import pagination from '../../../components/pagination'
    import reviewsAnswersNav from "~/components/profile/reviewsAnswersNav";
    import loader from "~/components/loader";
    import myArticle from "~/components/profile/my-article";

    import { storeToRefs } from "pinia";

    import {useArticleStore} from "../../../store/article";
    const articleStore = useArticleStore();
    const { isLoadingMyArticles, myArticles, myArticlesOptions, myArticlesLastPage } = storeToRefs(articleStore);

    let router =  useRouter();
    let route =  useRoute();
    const setPageQuery = value => {
        const query = {...route.query}

        if (value > 1) {
            query.page = value
        } else if (value === 1) {
            delete query.page
        }
        router.push({query})
    };

    const currentPageLocal = computed({
        get() {
            return myArticlesOptions.value.currentPage;
        },
        set(value) {
            setPageQuery(value);
        }
    });

    watch(
        () => ({params: route.query}),
        async (value) => {
            articleStore.setMyArticleOptionsByQuery(value.query);
            await articleStore.loadMyArticles();
        },
        {deep: true}
    );

    onMounted(async () => {
        articleStore.setMyArticleOptionsByQuery(route.query);
        await articleStore.loadMyArticles();
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