<template>
    <div>
        <reviewsAnswersNav></reviewsAnswersNav>
        <div class="loader__wrapper" v-if="isLoadingMyComments">
            <loader class="loader"></loader>
        </div>
        <div v-else>
            <h4 v-if="!myComments.length">
                У вас пока нет комментариев
            </h4>
            <my-comment
                @deleteItem="commentStore.deleteItem(comment.id)"
                v-for="comment in myComments"
                :key="comment.id"
                :comment="comment"
            />

            <pagination
                v-if="myComments.length && myCommentLastPage > 1"
                v-model:currentPage="currentPageLocal"
                :lastPage="lastPage"
            />
        </div>
    </div>
</template>

<script setup>
    import reviewsAnswersNav from "~/components/profile/reviewsAnswersNav";
    import pagination from '~/components/pagination'
    import myComment from "~/components/profile/my-comment";
    import loader from "~/components/loader";
    import { storeToRefs } from "pinia";
    import {useCommentStore} from "~/store/comments";
    import {useRuntimeConfig} from "#app";

    const config = useRuntimeConfig();
    const commentStore = useCommentStore();
    const { isLoadingMyComments, myComments, myCommentOptions, myCommentLastPage } = storeToRefs(commentStore);

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
            return myCommentOptions.value.currentPage;
        },
        set(value) {
            setPageQuery(value);
        }
    });

    watch(
        () => ({params: route.query}),
        async (value) => {
            commentStore.setMyCommentsOptionsByQuery(value.query);
            await commentStore.loadMyComments();
        },
        {deep: true}
    );

    const setSEO = () => {
        const title = `Мои комменты`;
        const metaName = `${title} ${config.public.siteTitle}`;
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
        commentStore.setMyCommentsOptionsByQuery(route.query);
        await commentStore.loadMyComments();
    });
</script>

<style scoped lang="scss">
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
