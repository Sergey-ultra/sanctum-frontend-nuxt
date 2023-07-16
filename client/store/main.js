import { useNuxtApp } from '#app'

export const useMainStore = defineStore({
    id: 'main',
    state: () => ({
        userCount: null,
        reviewCount: null,
        commentCount: null
    }),
    actions: {
        async loadMainStatistics() {
            const { $api } = useNuxtApp();
            const { data } = await $api.get('/main/statistics');
            if (data) {
                this.userCount = data.user_count;
                this.reviewCount = data.review_count;
                this.commentCount = data.comment_count;
            }
        },

    }
});
