import { useNuxtApp } from '#app'

export const useCommentStore = defineStore({
    id: 'comment',
    state: () => ({
        comments: [],
        myComments: [],
        myCommentOptions: {
            currentPage: 1
        },
        myCommentTotal: 0,
        myCommentLastPage: 1,
        isLoadingMyComments: false
    }),
    actions: {
        setMyCommentsOptionsByQuery(query) {
            this.myCommentOptions.currentPage = 1;
            for (let [key, value] of Object.entries(query)) {
                if (key === 'page') {
                    this.myCommentOptions.currentPage = Number(value);
                }
            }
        },
        async loadMyComments()  {
            this.isLoadingMyComments = true;
            const { $api } = useNuxtApp()
            const { data } = await $api.get('/comments/my', { params: { page: this.myCommentOptions.currentPage } });
            if (data) {
                this.myComments = [...data.data];
                this.myCommentTotal = data.total;
                this.myCommentLastPage = data.last_page;
            }
            this.isLoadingMyComments = false;
        },
        async loadComments(review_id) {
            const { $api } = useNuxtApp()
            const { data } = await $api.get('/comments', { params: { review_id } });
            if (data) {
                this.comments = [...data];
            }
        },
        async sendComment(object) {
            const { $api } = useNuxtApp()
            const { data } = await $api.post('/comments', object);
            if (data.status) {
                $api.$toast.setSuccess('Комментарий успешно создан и будет опубликован после модерации');
            }
        },
        async deleteItem(id) {
            const { $api } = useNuxtApp()
            await $api.delete(`/comments/${id}`);
            await this.loadMyComments();
            $api.$toast.setSuccess('Комментарий успешно удален');
        }
    },
});
