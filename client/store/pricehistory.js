import {useNuxtApp} from "#app";

export const usePriceHistoryStore = defineStore({
    id: 'priceHistory',
    state: () => ({
        priceHistory:[]
    }),
    actions: {
        async loadPriceHistory(sku_id) {
            const { $api } = useNuxtApp()
            const { data } = await $api.get('price-history', { params: { sku_id } });
            if (data) {
                this.priceHistory = [...data];
            }
        }
    },
});
