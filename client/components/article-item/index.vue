<template>
    <div class="article__item">
        <div class="article__details">
            <div class="article__avatar">
                <img :src="`${$config.APP_URL}/${article.user_avatar}`" :alt="article.user_name"/>
            </div>
            <div class="article__detail">{{article.user_name}}</div>
            <div class="article__detail">{{article.created_at}}</div>
            <div class="article__detail">
                <span class="article__viewsIcon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" data-tid="9bd43b8c">
                        <path fill="#999" d="M12 17c3.356 0 6.549-1.81 8.96-5.01C18.527 8.794 15.341 7 12 7c-3.356 0-6.549 1.81-8.96 5.01C5.473 15.206 8.659 17 12 17zm0-11c3.816 0 7.299 2.097 9.85 5.51.2.29.2.668 0 .958C19.3 15.903 15.816 18 12 18s-7.299-2.097-9.85-5.51c-.2-.29-.2-.668 0-.958C4.7 8.097 8.184 6 12 6zm-3.5 5.994c.458.349 1.04.541 1.671.5 1.224-.073 2.252-1.1 2.326-2.323A2.568 2.568 0 0 0 11.99 8.5a3.512 3.512 0 0 1 3.503 3.73 3.494 3.494 0 0 1-3.263 3.263 3.512 3.512 0 0 1-3.73-3.499z"></path>
                    </svg>
                </span>
                {{article.views_count}}
            </div>
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

        <tags :tags="article.tags"></tags>


        <div class="article__meta">
            <div class="article__comments">
                <nuxt-link :to="`/article/${article.slug}#comments`">
                    <fa  icon="comments"></fa>
                    {{ article.comments_count }}
                </nuxt-link>
            </div>
            <div class="article__likes">
                <likeUp
                    :isVote="localIsVote"
                    :likes="localLikes"
                    @addLike="addLike"
                />
                <likeDown :likesDown="article.dislikes ?? 0"/>
            </div>
        </div>

        <div class="article__preview">
            {{ article.preview }}
        </div>
    </div>
</template>

<script setup>
    import tags from '../tagsComponent'
    import likeUp from '../likes/like-up'
    import likeDown from '../likes/like-down';
    import { storeToRefs } from "pinia";
    import { useLikeStore } from "~/store/like";

    const likeStore = useLikeStore();
    const { newCount, isVote } = storeToRefs(likeStore);

    let likesCountLocal = ref(0);
    let isVoteLocal = ref(false);
    const isAddLike = ref(false);


    const props = defineProps({
        article: Object,
    });

    const localIsVote = computed(() => {
        if (!isAddLike.value) {
            return props.article.is_vote;
        }
        return newCount.value;
    });

    const localLikes = computed(() => {
        if (!isAddLike.value) {
            return props.article.likes;
        }
        return likesCountLocal.value;
    });

    const addLike = async() => {
        await likeStore.addLike({
            id: props.article.id,
            entity: 'article'
        });
        isAddLike.value = true;
        likesCountLocal.value = newCount.value;
        isVoteLocal.value = isVote.value;
    }
</script>

<style scoped lang="scss">
    h2 {
        font-size: 1.6rem;
        line-height: 2.4rem;
        margin: 0.4rem 0 .8rem 0;
        & a {
            text-decoration: none;
        }
    }
    .article {
        color: #212529 !important;
        background-color: #fff;
        border-radius: 8px;
        margin-top: 60px;
        padding: 25px;
        width: 100%;
        &__item {
            margin-bottom: 30px;
        }
        &__details {
            display: flex;
        }
        &__detail {
            display:flex;
            align-items: center;
            margin-right: 15px;
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
        &__viewsIcon {
            display:flex;
            align-items: center;
        }
        &__image {
            background: #f8f9fa;
            width: 100%;
            display:inline-flex;
            justify-content: center;
            max-height: 640px;
            margin-bottom:10px;
            & img {
                height: 100%;
                object-fit: cover;
                width: 100%;
            }
        }
        &__meta {
            display:flex;
            justify-content: space-between;
            align-items: center;
        }
        &__comments {
            cursor: pointer;
            padding: 10px 0;
            & a {
                color: #212529 !important;
                text-decoration: none;
            }
        }
        &__likes {
            display: flex;
            white-space: nowrap;
        }
    }
</style>
