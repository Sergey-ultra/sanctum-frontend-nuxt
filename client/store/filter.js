import api from '../utils/api'
import {useProductStore} from "./product";


export const useFilterStore = defineStore({
    id: 'filter',
    state: () => ({
        isLoadingFilter: false,
        filters: {
            categories: [],
            brands: [],
            volumes: [],
            purposes:[],
            ingredients: [],
            extracts:[],
            countries:[],
        },
        receipts: [],
        productDom: {},
    }),
    getters: {
        filterKeys: state => {
            return Object.keys(state.filters).filter(key => !['min_price', 'max_price'].includes(key))
        }
    },
    actions: {
        setProductDom(payload) {
            this.productDom = {
                bottom: payload.getBoundingClientRect().bottom,
                top: payload.getBoundingClientRect().top,
                height: payload.offsetHeight
            }
        },
        async loadFilters() {
            this.isLoadingFilter = true;
            const productStore = useProductStore();
            const { data } = await $fetch('http://sanctum/api/filter', { query: { ...productStore.queryParams } });
            if (data) {
                this.filters = { ...data};
            }
            this.isLoadingFilter = false;
        },
        async loadReceipts() {
            const productStore = useProductStore();
            const { data } = await $fetch('http://sanctum/api/filter/receipts', { query: { ...productStore.queryParams } })
            if (data) {
                this.receipts = [ ...data];
            }
        }
    }
});
