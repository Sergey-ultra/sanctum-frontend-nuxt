import { useNuxtApp } from '#app'

export const useArticleStore = defineStore({
    id: 'article',
    state: () => ({
        articleCategories: [],
        availableArticleTags: [],
        isLoadingMyArticles: false,
        myArticles: [],
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
        async loadArticleCategories() {
            const { $api } = useNuxtApp()
            const { data } = await $api.get(`/articles/categories`);
            if (data && Array.isArray(data)) {
                this.articleCategories = [...data];
            }
        },
        async loadAvailableArticleTags()  {
            const { $api } = useNuxtApp();
            const { data } = await $api.get(`/articles/tags`);
            if (data && Array.isArray(data)) {
                this.availableArticleTags = [...data];
            }
        },
        async loadMyArticles() {
            this.isLoadingMyArticles = true;
            const { $api } = useNuxtApp()
            const { data } = await $api.get('/articles/my');

            if (data.data !== null) {
                this.myArticles = [...data.data];
            }
            this.isLoadingMyArticles = false;
        },
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
            const { data } = await $api.get(`/articles/by-slug/${slug}`);
            if (data) {
                this.currentArticle = {...data };
            }
            this.isLoadingCurrentArticle = false;
        },
        async createItem() {

        },
        async updateItem () {

        },
    }
})

