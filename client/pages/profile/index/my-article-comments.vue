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
        </div>
    </div>
</template>

<script setup>
import reviewsAnswersNav from "~/components/profile/reviewsAnswersNav";
import {storeToRefs} from "pinia";
import {useArticleCommentStore} from "../../../store/article-comments";

const articleCommentStore = useArticleCommentStore();
const { isLoadingMyArticleComments, myArticleComments } = storeToRefs(articleCommentStore);


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

onMounted(() => {
    articleCommentStore.loadMyArticleComments();
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