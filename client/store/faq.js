import {useNuxtApp} from "#app";

export const useFaqStore = defineStore({
    id: 'faq',
    state: () => ({
        menu: [],
    }),
    actions: {
        async loadMenu() {
            const {$api} = useNuxtApp();
            const {data} = await $api.get('/faq/menu');
            if (data && Array.isArray(data)) {
                this.menu = [...data];
            }
        },
    },
});
