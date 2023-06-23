import { useNuxtApp } from '#app'

export const useBrandStore = defineStore({
    id: 'brand',
    state: () => ({
        brandsByLetters: [],
        popularBrands: [],
        isLoadingBrandsByLetters: false,
        countries:[],
        allBrands: [],
        currentBrand: null,
        isLoadingCurrentBrand: false,
    }),
    actions: {
        // setCountries(payload) {
        //     this.countries = [ ...payload ];
        // },
        async loadAllBrands() {
            const { $api } = useNuxtApp();
            const { data } = await $api.get('/brands/all');
            if (data) {
                this.allBrands = [...data];
            }
        },
        async loadBrandsByLetters() {
            this.isLoadingBrandsByLetters = true;
            const { $api } = useNuxtApp();
            const { data } = await $api.get('/brands/by-letters');
            if (data) {
                this.brandsByLetters = [...data];

                data.forEach(el => {
                    el.brands.forEach(brand => {
                        if (brand.country && !this.countries.includes(brand.country)) {
                            this.countries.push(brand.country)
                        }
                    })
                });
            }
            this.isLoadingBrandsByLetters = false;
        },
        async loadPopularBrands() {
            const { $api } = useNuxtApp()
            const { data } = await $api.get('/brands/popular');

            if (data) {
                this.popularBrands = [...data];
            }
        },
        async loadBrandByCode(code) {
            this.isLoadingCurrentBrand = true;
            const { $api } = useNuxtApp()
            const { data } = await $api.get(`/brands/by-code/${code}`);
            if (data) {
                this.currentBrand = { ...data };
            }
            this.isLoadingCurrentBrand = false;
        },
    }
});
