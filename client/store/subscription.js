import {useNuxtApp} from "#app";
import {useNotificationStore} from "./notification";


export const useSubscriptionStore = defineStore({
    id: 'subscription',
    actions: {
        async create(obj) {
            const {$api} = useNuxtApp()
            const res = await $api.post('/subscription', obj)
            if (res) {
                const notificationStore = useNotificationStore();
                notificationStore.setSuccess(res.message);
            }
        }
    }
});
