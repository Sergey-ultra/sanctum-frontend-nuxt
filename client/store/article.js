import { useNuxtApp } from '#app'

export const useArticleStore = defineStore({
    id: 'article',
    state: () => ({
        articleCategories: [],
        availableArticleTags: [],
        isLoadingMyArticles: false,
        myArticles: [],
        myArticlesTotal: 0,
        myArticlesLastPage: 1,
        myArticlesOptions: {
            currentPage: 1
        },
        isLoadingLastArticles: false,
        lastArticles:[],
        isLoadingArticlesByTag: false,
        articlesByTag: {
            data:[],
            tag: {}
        },
        isLoadingCurrentArticle: false,
        currentArticle: null,
        isLoadingArticlesWithPagination: false,
        articlesWithPagination: [],
        currentPage: 1
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
        setMyArticleOptionsByQuery(query) {
            this.myArticlesOptions.currentPage = 1;
            for (let [key, value] of Object.entries(query)) {
                if (key === 'page') {
                    this.myArticlesOptions.currentPage = Number(value);
                }
            }
        },
        async loadMyArticles() {
            this.isLoadingMyArticles = true;
            const { $api } = useNuxtApp();
            const { data } = await $api.get('/articles/my', {params: { page: this.myArticlesOptions.currentPage }});

            if (data.data !== null) {
                this.myArticles = [...data.data];
                this.myArticlesTotal = data.total;
                this.myArticlesLastPage = data.last_page;
            }
            this.isLoadingMyArticles = false;
        },
        async loadArticlesWithPagination() {
            this.isLoadingArticlesWithPagination = true;
            const { $api } = useNuxtApp();
            const { data } = await $api.get('/articles', { params: {  page: this.currentPage }});
            if (data && Array.isArray(data)) {
                this.articlesWithPagination = [...data];
            }
            this.isLoadingArticlesWithPagination = false;
        },
        async loadLastArticles() {
            this.isLoadingLastArticles = true;
            const { $api } = useNuxtApp()
            const { data } = await $api.get('/articles/last');

            if (data !== null) {
                this.lastArticles = [...data];
            }
            this.isLoadingLastArticles = false;
        },
        async loadArticlesByTag(tag) {
            this.isLoadingArticlesByTag = true;
            const { $api } = useNuxtApp()
            const data = await $api.get(`/articles/by-tag/${tag}`);

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
        async createItem(obj) {
            const { $api } = useNuxtApp();
            const { data } = await $api.post(`/articles`, obj);
        },
        async updateItem (obj) {

        },
    }
})

