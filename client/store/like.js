import {useNuxtApp} from "#app";


export const useLikeStore = defineStore({
    id: 'like',
    state: () => ({
        isUpdatedLikeCount: false,
    }),
    actions: {
        async addLike(payload){
            this.isUpdatedLikeCount = false;
            const { $api } = useNuxtApp();
            const { data } = await $api.post(`/likes/${payload.id}`, payload);
            if (data.status && data.status === 'success') {
                this.isUpdatedLikeCount = true;
            }
        }
    },
});
