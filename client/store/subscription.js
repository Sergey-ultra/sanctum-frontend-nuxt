import {useNuxtApp} from "#app";


export const useSubscriptionStore = defineStore({
    id: 'subscription',
    actions: {
        async create(obj) {
            const { $api } = useNuxtApp()
            const res = await $api.post('/subscription', obj)
            if (res) {
                $api.$toast.setSuccess(res.message);
            }
        }
    }
});
