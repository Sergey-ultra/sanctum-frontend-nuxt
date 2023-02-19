<template>
<div>
    <reviewsAnswersNav></reviewsAnswersNav>
    <section>
        <div class="loader__wrapper" v-if="isLoadingMyArticles">
            <loader class="loader"></loader>
        </div>
        <div class="wrapper" v-else>
           <div class="box">
               <nuxt-link class="custom-btn create" :to="{name: 'profile-index-add-article'}">
                   <div class="icon">
                       <div class="icon-inner">
                           <svg><use xlink:href="#icons_attachment">
                               <symbol viewBox="0 0 24 24" id="icons_attachment">
                                   <path fill-rule="evenodd" d="M10.63 23.024L9.216 21.61l9.4-9.4c1.748-1.748 1.86-4.698.25-6.577l-.17-.197c-.754-.882-1.781-1.39-2.89-1.433-1.09-.04-2.17.387-2.992 1.208L4.76 13.264c-.49.49-.76 1.143-.761 1.838-.001.63.22 1.225.627 1.696a2.608 2.608 0 0 0 3.533-.143l8.27-8.27L17.844 9.8l-8.27 8.27a4.613 4.613 0 0 1-6.215.276l-.012.012-.275-.274-.006-.007h-.001l-.001-.002.012-.012A4.566 4.566 0 0 1 2 15.102a4.574 4.574 0 0 1 1.347-3.252L11.4 3.797c1.219-1.22 2.81-1.859 4.484-1.793 1.67.064 3.21.821 4.332 2.13l.17.198c2.274 2.653 2.115 6.822-.356 9.292l-9.4 9.4z"></path>
                               </symbol>
                           </use></svg>
                       </div>
                   </div>
                   <span>Создать статью</span>
               </nuxt-link>
           </div>

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

.box {
    margin-bottom: 16px;
}
.create {
    max-width:600px;
}
.icon {
    vertical-align: middle;
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-left: -12px;
    &-inner {
        display: inline-block;
        position: relative;
        width: 32px;
        height: 32px;
        & svg {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            width: 20px;
            height: 20px;
        }
    }
}
</style>