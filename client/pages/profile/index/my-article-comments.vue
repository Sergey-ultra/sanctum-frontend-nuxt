<template>
    <div>
        <reviewsAnswersNav></reviewsAnswersNav>
        <div class="loader__wrapper" v-if="isLoadingMyArticleComments">
            <loader class="loader"></loader>
        </div>
        <div class="wrapper" v-else>
            <h4 v-if="!myArticleComments.length">
                У вас пока нет отзывов на статьи
            </h4>
            <my-comment
                @deleteItem="articleCommentStore.deleteItem(comment.id)"
                v-for="comment in myArticleComments"
                :key="comment.id"
                :comment="comment"
            />
            <pagination
                v-if="myArticleComments.length && lastPage > 1"
                v-model:currentPage="currentPageLocal"
                :lastPage="lastPage"
            />
        </div>
    </div>
</template>

<script setup>
    import pagination from '../../../components/pagination'
    import reviewsAnswersNav from "~/components/profile/reviewsAnswersNav";
    import loader from "~/components/loader";
    import myComment from "~/components/profile/my-comment";

    import {storeToRefs} from "pinia";
    import {useArticleCommentStore} from "../../../store/article-comments";

    const articleCommentStore = useArticleCommentStore();
    const { isLoadingMyArticleComments, myArticleComments, currentPage, lastPage } = storeToRefs(articleCommentStore);

    let router = useRouter();
    let route = useRoute();
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
            return currentPage.value;
        },
        set(value) {
            setPageQuery(value);
        }
    });

    watch(
        () => ({params: route.query}),
        async (value) => {
            articleCommentStore.setMyArticleCommentsOptionsByQuery(value.query)
            await articleCommentStore.loadMyArticleComments();
        },
        {deep: true}
    );

    const setSEO = () => {
        const title = `Мои отзывы на статьи`;
        const metaName = `${title} Smart-Beautiful - агрегатор цен косметических товаров`;
        useHead({
            title,
            meta: [
                {name: 'description', content: metaName},
                {name: 'keywords', content: metaName}
            ],
        });
    }

    setSEO();

    onMounted(async () => {
        articleCommentStore.setMyArticleCommentsOptionsByQuery(route.query)
        await articleCommentStore.loadMyArticleComments();
    });

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