import {useNuxtApp} from "#app";

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        userInfo: {},
    }),
    actions: {
        async loadProfile() {
            const { $api } = useNuxtApp();
            const { data } = await $api.get('/me?is_expand=true');
            if (data) {
                this.userInfo = {...data};
            }
        },
        async updateProfile(obj) {
            const { $api } = useNuxtApp();
            const { data } = await $api.post('/users/me', obj)
        }
    }
});
