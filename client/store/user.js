import {useNuxtApp} from "#app";

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        userInfo: {},
        bestUsers: [],
        wallets: [],
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
        },
        async updateAvatar(obj) {
            const { $api } = useNuxtApp();
            const { data } = await $api.post('/users/me/avatar', obj)
        },
        async loadUserWallets() {
            const { $api } = useNuxtApp();
            const { data } = await $api.get('/users/wallets');
            if (data && Array.isArray(data)) {
                this.wallets = [...data];
            }
        },
        async addNewWallet(payload) {
            const { $api } = useNuxtApp();
            const { data } = await $api.post('/users/wallets', payload);
            if (data) {
                this.wallets.push(data);
            }
        },
        async loadBestUsers() {
            const { $api } = useNuxtApp();
            const { data } = await $api.get('/users/best');
            if (data && Array.isArray(data)) {
                this.bestUsers = [...data];
            }
        },
        async chargeMoney(payload) {
            const { $api } = useNuxtApp();
            const { data } = await $api.post('/users/charge-money', payload);
        }
    }
});
