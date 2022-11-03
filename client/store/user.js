import api from '../utils/api'

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        userInfo: {},
    }),
    actions: {
        async loadUserInfo() {
            const { data } = await api.get('/users-show-me');
            if (data) {
                this.userInfo = {...data};
            }
        },
        async updateUser(obj) {
            const { data } = await api.post('/users-update-me', obj)
        }
    }
});
