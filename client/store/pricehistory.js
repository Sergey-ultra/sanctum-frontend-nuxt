import {useNuxtApp} from "#app";

export const usePriceHistoryStore = defineStore({
    id: 'priceHistory',
    state: () => ({
        priceHistory:[]
    }),
    actions: {
        async loadPriceHistory(id) {
            const { $api } = useNuxtApp()
            const { data } = await $api.get(`price-history?sku_id=${id}`);

            if (data) {
                this.priceHistory = [...data];
            }
        }
    },
});
