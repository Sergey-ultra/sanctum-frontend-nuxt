import {useNuxtApp} from "#app";


export const useLikeStore = defineStore({
    id: 'like',
    state: () => ({
        isVote: '',
        newCount: 0,
    }),
    actions: {
        async addLike(payload){
            this.isUpdatedLikeCount = false;
            const { $api } = useNuxtApp();
            const { data } = await $api.post(`/likes/${payload.id}`, payload);

            this.isVote = data.is_vote;
            this.newCount = data.count;
        }
    },
});
