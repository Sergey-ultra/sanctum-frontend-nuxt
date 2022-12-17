<template>
    <div class="article">
        <div class="article__row article__row-flex" v-if="isLoadingArticlesByTag">
            <loader class="loader"/>
        </div>

        <div v-else>
            <h1>{{articlesByTag.tag.tag}}</h1>
            <div
                v-for="article in articlesByTag.data"
                :key="article.id"
            >
                <div class="article__details">
                    <div class="article__avatar">
                        <img :src="`${$config.APP_URL}/${article.user_avatar}`" :alt="article.user_name"/>
                    </div>
                    <div class="article__detail">{{article.user_name}}</div>
                    <div class="article__detail">{{article.created_at}}</div>
                    <div class="article__detail">{{article.views_count}}</div>
                </div>
                <h2>
                    <nuxt-link :to="`/article/${article.slug}`">
                        {{ article.title }}
                    </nuxt-link>
                </h2>

                <nuxt-link  class="article__image" :to="`/article/${article.slug}`">
                    <picture>
                        <img :src="`${$config.APP_URL}/${article.image}`" :alt="article.title"/>
                    </picture>
                </nuxt-link>

                <div class="article__tags">
                    <nuxt-link
                        :to="`/article/tag/${tag}`"
                        class="article__tag"
                        v-for="tag in article.tagNames"
                        :key="tag"
                    >
                        {{tag}}
                    </nuxt-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {useArticleStore} from "../../../store/article";
    import { storeToRefs } from "pinia";

    const route =  useRoute();
    const articleStore = useArticleStore();
    const { isLoadingArticlesByTag, articlesByTag } = storeToRefs(articleStore);

    await useAsyncData(async () => {
        await articleStore.loadArticlesByTag(route.params.tag)
    })
</script>

<style scoped lang="scss">
    h2 {
        font-size: 2rem;
        line-height: 2.4rem;
        margin: 0 0 .8rem;
        & a {
            text-decoration: none;
        }
    }
    .article {
        background-color: #fff;
        border-radius: 8px;
        margin-top: 60px;
        padding: 25px;
        width: 100%;
        &__details {
          display: flex;
        }
        &__detail {
            color: #999;
        }
        &__avatar {
            height: 25px;
            width: 25px;
            border-radius: 50%;

            margin-right: 16px;
            overflow: hidden;
            & img {
                height: 100%;
                object-fit: cover;
                width: 100%;
            }
        }
        &__image {
            width: 100%;
            display:inline-flex;
            justify-content: center;
            max-height: 640px;
            & img {
                height: 100%;
                object-fit: cover;
                width: 100%;
            }
        }
        &__tags {
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            margin: .5rem 0;
        }
        &__tag {
            font-size: .875rem;
            line-height: 1.5;
            padding: .25rem .5rem;
            color: #555;
            background: #faf7ef;
            border-radius: 50rem !important;
            margin-right: .25rem !important;
            white-space: normal;
            flex: 0 0 auto;
            position: relative;
            text-decoration: none;
            transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        }
    }
</style>