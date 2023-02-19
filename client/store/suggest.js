import {useNuxtApp} from "#app";



export const useSuggestStore = defineStore({
    id: 'suggest',
    state: () => ({
        categories: [],
        skus: [],
        isLoadingSuggests: false
    }),
    actions: {
        setSuggestsToDefault() {
            this.suggests = [];
        },
        async getSuggests(search) {
            const { $api } = useNuxtApp();
            this.isLoadingSuggests = true;
            const { data } = await $api.get('/suggest', { params: { search }});
            if (data) {
                this.categories = [...data.categories];
                this.skus = [...data.skus];
            }
            this.isLoadingSuggests = false;
        }
    }
});
