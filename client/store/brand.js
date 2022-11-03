import api from '../utils/api'


export const useBrandStore = defineStore({
    id: 'brand',
    state: () => ({
        allBrands:[],
        popularBrands: [],
        isLoadingAllBrands: false,
        countries:[],
        currentBrand: null,
        isLoadingCurrentBrand: false,
    }),
    actions: {
        setCountries(payload) {
            this.countries = [ ...payload ];
        },
        async loadAllBrand() {
            this.isLoadingAllBrands = true;
            const { data } = await $fetch('http://sanctum/api/brands/all');
            if (data) {
                this.allBrands = [...data];

                data.forEach(el => {
                    el.brands.forEach(brand => {
                        if (brand.country && !this.countries.includes(brand.country)) {
                            this.countries.push(brand.country)
                        }
                    })
                });
            }
            this.isLoadingAllBrands = false;
        },
        async loadPopularBrands() {
            const { data } = await api.get('http://sanctum/api/brands/popular');

            if (data) {
                this.popularBrands = [...data];
            }
        },
        async loadBrandByCode(code) {
            this.isLoadingCurrentBrand = true;

            const { data } = await $fetch(`http://sanctum/api/brands/by-code/${code}`);
            if (data) {
                this.currentBrand = { ...data };
            }
            this.isLoadingCurrentBrand = false;
        },
    }
});
