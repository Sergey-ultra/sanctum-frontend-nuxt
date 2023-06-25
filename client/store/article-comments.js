import { useNuxtApp } from '#app'


export const useArticleCommentStore = defineStore({
    id: 'articleComment',
    state: () => ({
        isLoadingMyArticleComments: false,
        myArticleComments:[],
        currentPage: 1,
        total: 0,
        lastPage: 1
    }),
    actions: {
        setMyArticleCommentsOptionsByQuery(query) {
            this.currentPage = 1;
            for (let [key, value] of Object.entries(query)) {
                if (key === 'page') {
                    this.currentPage = Number(value);
                }
            }
        },
        async loadMyArticleComments()  {
            this.isLoadingMyArticleComments = true;

            const { $api } = useNuxtApp();
            const { data } = await $api.get('/article-comments/my', {params: { page: this.currentPage }});
            if (data) {
                this.myArticleComments = [...data.data];
                this.total = data.total;
                this.lastPage = data.last_page;
            }
            this.isLoadingMyArticleComments = false;
        },
        async createArticleComment(object) {
            const { $api } = useNuxtApp();
            const { data } = await $api.post('/article-comments', object);
            if (data.status) {
                $api.$toast.setSuccess('Комментарий успешно создан и будет опубликован после модерации');
            }
        }
    }
})

