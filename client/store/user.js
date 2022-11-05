import {useNuxtApp} from "#app";

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        userInfo: {},
    }),
    actions: {
        async loadUserInfo() {
            const { $api } = useNuxtApp()
            const { data } = await $api.get('/users-show-me');
            if (data) {
                this.userInfo = {...data};
            }
        },
        async updateUser(obj) {
            const { $api } = useNuxtApp()
            const { data } = await $api.post('/users-update-me', obj)
        }
    }
});
