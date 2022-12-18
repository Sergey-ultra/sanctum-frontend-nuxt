<template>
    <div>
        <loader
            class="loader"
            v-if="isLoadingCurrentArticle"
        />

        <div v-else class="article">
            <div class="article__title">{{ currentArticle.title }}</div>
            <div class="article__preview">{{ currentArticle.preview }}</div>
            <div class="article__meta">
                <div class="article__user">
                    <div class="article__userImg">
                        <img :src="`${$config.APP_URL}/${currentArticle.user_avatar}`" :alt="currentArticle.user_name"/>
                    </div>
                    <div class="article__userInfo">
                        <div class="article__userName">
                            <span>
                                {{ currentArticle.user_name }}
                            </span>
                        </div>

                    </div>
                </div>
                <div class="article__info">
                    <div class="article__infoItem">{{ currentArticle.created_at }}</div>
                    <div class="article__infoItem">
                        <span class="article__viewsIcon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                 data-tid="9bd43b8c">
                                <path fill="#999"
                                      d="M12 17c3.356 0 6.549-1.81 8.96-5.01C18.527 8.794 15.341 7 12 7c-3.356 0-6.549 1.81-8.96 5.01C5.473 15.206 8.659 17 12 17zm0-11c3.816 0 7.299 2.097 9.85 5.51.2.29.2.668 0 .958C19.3 15.903 15.816 18 12 18s-7.299-2.097-9.85-5.51c-.2-.29-.2-.668 0-.958C4.7 8.097 8.184 6 12 6zm-3.5 5.994c.458.349 1.04.541 1.671.5 1.224-.073 2.252-1.1 2.326-2.323A2.568 2.568 0 0 0 11.99 8.5a3.512 3.512 0 0 1 3.503 3.73 3.494 3.494 0 0 1-3.263 3.263 3.512 3.512 0 0 1-3.73-3.499z"></path>
                            </svg>
                        </span>
                        {{ currentArticle.views_count }}
                    </div>
                </div>
            </div>

            <div class="article__img">
                <img :src="`${$config.APP_URL}/${currentArticle.image}`" :alt="currentArticle.image"/>
            </div>
            <div class="article__body" v-html="currentArticle.body"></div>

            <div class="article__tags">
                <nuxt-link
                    :to="`/article/tag/${tag}`"
                    class="article__tag"
                    v-for="tag in currentArticle.tags"
                    :key="tag"
                >
                    {{tag}}
                </nuxt-link>
            </div>

            <div class="article__block">
                <h4>Комментарии</h4>
                <comment-list
                    class="article__comments"
                    :isShowComments="true"
                    @sendComment="sendComment"
                    :comments="currentArticle.comments"
                    :isLoadingComments="false"
                />

                <form class="add-comment__form" @submit.prevent="sendNewComment">
                    <textarea class="textarea" v-model.trim="userComment" name="comment" placeholder="Написать комментарий"></textarea>
                    <div class="invalid-feedback" v-for="error of v$.userComment.$errors" :key="error.$uid">
                        {{ error.$message }}
                    </div>

                    <button type="submit" class="btn">Отправить комментарий</button>
                </form>

            </div>
        </div>
    </div>
</template>

<script setup>
    import loader from '../../components/loader'
    import commentList from '../../components/comment-list'
    import {useArticleStore} from "../../store/article";
    import { storeToRefs } from "pinia";
    import {useAuthStore} from "../../store/auth";
    import {helpers, minLength, required} from "@vuelidate/validators";
    import useVuelidate from '@vuelidate/core'
    import {useArticleCommentStore} from "../../store/article-comments";


    const route = useRoute();

    const articleStore = useArticleStore();
    const articleCommentStore = useArticleCommentStore();
    const authStore = useAuthStore();
    const { currentArticle, isLoadingCurrentArticle } = storeToRefs(articleStore);
    const { isAuth } = storeToRefs(authStore);

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
        if (isAuth.value) {
            const validated = await v$.value.userComment.$validate();
            if (validated) {
                sendComment({comment: userComment.value});
                userComment.value = '';
                v$.value.$reset();
            }
        } else {
            authStore.setIsShowAuthModal(true);
        }
    }

    const setSEO = name => {
        const title = `Статья ${name}`;
        const metaName = `${title} Smart-Beautiful - агрегатор цен косметических товаров`;
        useHead({
            title,
            meta: [
                {name: 'description', content: metaName},
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
            setSEO(value.title)
        }
    });

    if (currentArticle.value && currentArticle.value.title) {
        setSEO(currentArticle.value.title)
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
    .article {
        width: 100%;
        background-color: #fff;
        padding:25px;
        border-radius: 8px;
        margin-top: 60px;
        &__title {
            font-weight: 500;
            font-size: 45px;
            line-height: 56px;
            margin: 16px 0 0;
            color: #222;
            max-width: 920px;
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
            font-size: 20px;
            line-height: 1.5;
        }
        & .image {
            width: 400px;
            height: 300px;
            object-fit: cover;
        }
        &__tags {
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            margin-bottom:30px;
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
    .textarea {
        width: 100%;
        resize: vertical;
        outline: #000 none medium;
        overflow: visible;
        transition: background-color 0.3s ease 0s, border-color 0.3s ease 0s;
        border: 1px solid transparent;
        border-radius: 8px;
        padding: 8px;
        background-color: rgb(240, 242, 252);
        &:hover {
            border-color: rgb(192, 201, 240);
            transition: border-color 0.3s ease 0s;
        }
        &:focus {
            background-color: white;
            border-color: rgb(59, 87, 208);
            transition: background-color 0.3s ease 0s, border-color 0.3s ease 0s;
        }
    }

    .btn {
        margin-top: 15px;
        color: #fff;
        background-color: #42b983;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        line-height: 36px;
        padding:0 20px;
    }
</style>