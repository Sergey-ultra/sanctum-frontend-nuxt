import { useNuxtApp } from '#app'
import {useNotificationStore} from "~/store/notification";


export const useArticleCommentStore = defineStore({
    id: 'article',
    state: () => ({
        isLoadingMyArticleComments: false,
        myArticleComments:[],
    }),
    actions: {
        async loadMyArticleComments()  {
            this.isLoadingMyArticleComments = true;
            const { $api } = useNuxtApp()
            const { data } = await $api.get('/article-comments/my');
            if (data) {
                this.myArticleComments = [...data.data];
            }
            this.isLoadingMyArticleComments = false;
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

