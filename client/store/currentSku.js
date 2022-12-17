import {useNuxtApp} from "#app";

export const useCurrentSkuStore = defineStore({
    id: 'currentSku',
    state: () => ({
        currentSkuId: null,
        isLoadingCurrentSku: false,
        currentSku:{},
        compactCurrentSku: {},
        isLoadingCompactCurrentSku: false,
    }),
    getters: {
        currentSkuLocal (state) {
            if (!Object.keys(state.currentSku).length) {
                return state.compactCurrentSku;
            }
            return state.currentSku;
        },
        currentSkuProductCode () {
            return this.currentSkuLocal.code + '-' + this.currentSkuLocal.id
        }
    },
    actions: {
        setCurrentSkuId(payload) {
            this.currentSkuId = payload;
        },
        async loadCurrentSku() {
            this.isLoadingCurrentSku = true;

            const { $api } = useNuxtApp()
            const { data } = await $api.get(`/skus/by-sku-id/${this.currentSkuId}`);
            if (data) {
                this.currentSku = {...data};
            }
            this.isLoadingCurrentSku = false;
        },
        async loadCompactCurrentSku() {
            if (this.currentSkuId) {
                this.isLoadingCompactCurrentSku = true;

                const { $api } = useNuxtApp()
                const { data } = await $api.get(`/skus/by-sku-id/${this.currentSkuId}`, {params: {view: 'compact'}})
                if (data) {
                    this.compactCurrentSku = {...data};
                }
                this.isLoadingCompactCurrentSku = false;
            }
        },
    }
});
