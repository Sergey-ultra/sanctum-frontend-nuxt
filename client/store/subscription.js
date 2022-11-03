import api from '../utils/api'
import {useNotificationStore} from "./notification";


export const useSubscriptionStore = defineStore({
    id: 'subscription',
    actions: {
         async create(obj) {
            const res = await api.post('/subscription', obj)
             if (res) {
                 const notificationStore = useNotificationStore();
                 notificationStore.setSuccess(res.message);
             }
        }
    }
});
