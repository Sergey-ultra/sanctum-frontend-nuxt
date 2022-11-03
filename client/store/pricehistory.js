import api from '../utils/api'

export const usePriceHistoryStore = defineStore({
    id: 'priceHistory',
    state: () => ({
        priceHistory:[]
    }),
    actions: {
        async loadPriceHistory(sku_id) {
            const { data } = await api.get('price-history', { params: { sku_id } });
            if (data) {
                this.priceHistory = [...data];
            }
        }
    },
});
