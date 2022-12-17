import { useNuxtApp } from '#app'
import {useNotificationStore} from "~/store/notification";

export const useArticleStore = defineStore({
    id: 'article',
    state: () => ({
        isLoadingArticles: false,
        articles:[],
        isLoadingArticlesByTag: false,
        articlesByTag: {
            data:[],
            tag: {}
        },
        isLoadingCurrentArticle: false,
        currentArticle: null
    }),
    actions: {
        async loadArticles() {
            this.isLoadingArticles = true;
            const { $api } = useNuxtApp()
            const { data } = await $api.get('/articles');

            if (data !== null) {
                this.articles = [...data];
            }
            this.isLoadingArticles = false;
        },
        async loadArticlesByTag(tag) {
            this.isLoadingArticlesByTag = true;
            const { $api } = useNuxtApp()
            const { data } = await $api.get(`/articles/by-tag/${tag}`);

            if (data !== null) {
                this.articlesByTag = {...data};
            }
            this.isLoadingArticlesByTag = false;

        },
        async loadCurrentArticle(slug) {
            this.isLoadingCurrentArticle = true;

            const { $api } = useNuxtApp();
            const { data } = await $api.get(`/articles/${slug}`);
            if (data) {
                this.currentArticle = {...data };
            }
            this.isLoadingCurrentArticle = false;
        },
        async createArticleComment(object) {
            const { $api } = useNuxtApp();
            const { data } = await $api.post('/article-comments', object);
            if (data.status) {
                const notificationStore = useNotificationStore()
                notificationStore.setSuccess('Комментарий успешно создан и будет опубликован после модерации');
            }
        }
    }
})

