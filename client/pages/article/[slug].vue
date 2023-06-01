<template>
    <div>
        <loader
            class="loader"
            v-if="isLoadingCurrentArticle"
        />

        <div v-else class="article">
            <h2 class="title">{{ currentArticle.title }}</h2>
            <nuxt-link :to="`/article/category/${currentArticle.category_id}`" class="article__category" :style="{backgroundColor: '#' + currentArticle.category_color }">
                {{ currentArticle.category_name }}
            </nuxt-link>
            <div class="article__preview">{{ currentArticle.preview }}</div>

            <metaInfo :currentEntity="currentArticle"/>

            <div class="article__img">
                <img :src="`${$config.APP_URL}/${currentArticle.image}`" :alt="currentArticle.image"/>
            </div>
            <div class="article__body" v-html="currentArticle.body"></div>

            <tags class="article__tags" :tags="currentArticle.tags"></tags>

            <div class="article__block" id="comments">
                <h4>Комментарии</h4>
                <comment-list
                    class="article__comments"
                    :isShowComments="true"
                    :entity="'article_comment'"
                    @sendComment="sendComment"
                    :comments="currentArticle.comments"
                    :isLoadingComments="false"
                />

                <form class="add-comment__form" @submit.prevent="sendNewComment">
                    <textareaComponent  v-model="userComment" name="comment" placeholder="Написать комментарий"></textareaComponent>
                    <div class="invalid-feedback" v-for="error of v$.userComment.$errors" :key="error.$uid">
                        {{ error.$message }}
                    </div>

                    <buttonComponent class="comment-btn" :color="'green-light'" :radius="true" type="submit">
                        Отправить комментарий
                    </buttonComponent>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
    import tags from '../../components/tagsComponent'
    import textareaComponent from '../../components/textareaComponent'
    import buttonComponent from '../../components/button-component'
    import loader from '../../components/loader'
    import commentList from '../../components/comment-list'
    import metaInfo from '../../components/meta-info';
    import { useArticleStore } from "~/store/article";
    import { useArticleCommentStore } from "~/store/article-comments";
    import { storeToRefs } from "pinia";
    import {helpers, minLength, required} from "@vuelidate/validators";
    import useVuelidate from '@vuelidate/core'
    import { useNuxtApp } from '#app'


    const { $api } = useNuxtApp();

    const route = useRoute();


    const articleStore = useArticleStore();
    const articleCommentStore = useArticleCommentStore();

    const { currentArticle, isLoadingCurrentArticle } = storeToRefs(articleStore);

    let userComment = ref('');

    const rules = {
        userComment: {
            required:  helpers.withMessage('Поле должно быть заполнено', required),
            minLength: helpers.withMessage('Поле должно быть не меньше 8 символов', minLength(8))
        }
    };

    const v$ = useVuelidate(rules, { userComment });

    const sendComment = obj => {
        obj.article_id = currentArticle.value.id;
        articleCommentStore.createArticleComment(obj);
    }


    const sendNewComment = async() => {
        if ($api.isAuth.value) {
            const validated = await v$.value.userComment.$validate();
            if (validated) {
                sendComment({comment: userComment.value});
                userComment.value = '';
                v$.value.$reset();
            }
        } else {
            $api.setIsShowAuthModal(true);
        }
    }

    const setSEO = (name, preview = '') => {
        const title = `Статья ${name}`;
        const metaName = `${title} Smart-Beautiful - агрегатор цен косметических товаров`;
        useHead({
            title,
            meta: [
                {name: 'description', content: preview ?? metaName},
                {name: 'keywords', content: metaName}
            ],
        });
    }

    // watch(
    //     () => route,
    //     async (value, oldValue) => {
    //         console.log(value)
    //         if (value.params.id) {
    //             if (value.params.id !== oldValue.params.id) {
    //
    //                 await articleStore.loadCurrentArticle(value.params.id);
    //                 setSEO(currentArticle.value.title);
    //             }
    //         }
    //     },
    //     { deep: true}
    // );



    watch(currentArticle, value => {
        if (value && value.title) {
            setSEO(value.title, value.preview)
        }
    });

    if (currentArticle.value && currentArticle.value.title) {
        setSEO(currentArticle.value.title, currentArticle.value.preview)
    }

    useAsyncData(async() => {
        await articleStore.loadCurrentArticle(route.params.slug);
    });
</script>

<style lang="scss" scoped>
    h4 {
        margin-bottom: 1rem !important;
        font-size: 1.3rem;
        font-weight: 500;
        line-height: 1.2;
    }
    .loader {
        width: 200px;
        height: 200px;
    }
    .title {
        font-weight: 500;
        font-size: 45px;
        line-height: 56px;
        margin: 16px 0 0;
        color: #222;
        max-width: 920px;
    }
    .article {
        width: 100%;
        background-color: #fff;
        padding:25px;
        border-radius: 8px;
        margin-top: 60px;

        &__category {
            margin-top: 8px;
            color: #fff;
            display: inline-block;
            padding: 3px 6px 2px;
            font-size: 11px;
            line-height: 15px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.1px;
        }
        &__preview {
            font-weight: 400;
            font-size: 24px;
            line-height: 36px;
            margin-top: 8px;
            letter-spacing: .2px;
            color: #999;
        }
        &__meta {
            margin-top: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            flex-wrap:wrap;
        }
        &__user {
            flex: 1 0 450px;
            display: flex;
            align-items: center;
        }
        &__userImg {
            flex: 0 0 62px;
            margin-right: 16px;
            width: 62px;
            height: 62px;
            border-radius: 50%;
            overflow:hidden;
            & img {
                object-fit: cover;
                width: 100%;
                height: 100%;
            }
        }
        &__userInfo {

        }
        &__userName {
            color: #222;
            font-weight: 600;
            font-style: normal;
            font-stretch: normal;
            font-size: 16px;
            line-height: 24px;
        }
        &__firstLetter {
            color: red;
            font-style: normal;
        }
        &__info {
            padding: 9px 0;
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
        &__infoItem {
            color: #999;
            font-family: YS Text,sans-serif;
            font-weight: 400;
            font-style: normal;
            font-stretch: normal;
            font-size: 14px;
            line-height: 20px;
            white-space: nowrap;
            &:not(:last-child) {
                padding-right: 16px;
            }
        }


        &__viewsIcon {
            display:inline-block;
            width: 20px;
            height: 20px;
            vertical-align: top;
        }


        &__img {
            margin-top: 24px;
            height: 580px;
            width: 100%;

            & img {
                height: 100%;
                width: 100%;
                object-fit:cover;
            }
        }


        &__body {
            font-size: 18px;
            line-height: 1.5;
        }
        &__tags {
            margin-top: 10px;
        }
        & .image {
            width: 400px;
            height: 300px;
            object-fit: cover;
        }
        &__comments {
            border-top: 1px solid #dee2e6;
            padding: 15px 0 0;
        }
    }

    .add-comment__form {
        margin-top:15px;
        display:flex;
        flex-direction: column;
        align-items:flex-end;
    }
    .comment-btn {
        margin-top:15px;
    }
</style>
