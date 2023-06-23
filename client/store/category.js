import { useNuxtApp } from '#app'

export const useCategoryStore = defineStore({
    id: 'category',
    state: () => ({
        isLoading: false,
        currentCategory: {},
        categories: [],
        allCategories: [],
        isLoadingCategories: false
    }),
    actions: {
        async loadAllCategories() {
            const { $api } = useNuxtApp()
            const { data } = await $api.get(`/categories/all`);
            if (data) {
                this.allCategories = [...data];
            }
        },
        async loadNestedCategories() {
            this.isLoadingCategories = true;

            const { $api } = useNuxtApp()
            const { data } = await $api.get(`/categories/nested`);

            if (data) {
                this.categories = [...data];
            }
            this.isLoadingCategories = false;
        },
        async loadCurrentCategory(categoryCode) {
            this.isLoading = true;

            const { $api } = useNuxtApp()
            const { data } = await $api.get(`/categories/${categoryCode}`);
            if (data) {
                this.currentCategory = { ...data };
            }
            this.isLoading = false;
        },
    },
});
