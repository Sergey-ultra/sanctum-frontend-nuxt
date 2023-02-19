import {useNuxtApp} from "#app";

export const useFavoritesStore = defineStore({
    id: 'favorites',
    state: () => ({
        favorites:[],
        favoriteSkus: [],
        lastPage:0,
        isLoadingFavoriteSkus: false
    }),
    actions: {
        async loadFavoriteSkus() {
            const { $api } = useNuxtApp();
            if ($api.isAuth.value) {
                this.isLoadingFavoriteSkus = true;

                const { data } = await $api.get('show-favorite-skus');
                if (data) {
                    this.favoriteSkus = [ ...data.data ];
                    this.lastPage = data.last_page;
                }

                this.isLoadingFavoriteSkus = false;
            } else {
                this.favoriteSkus = [];
                this.lastPage = 0;
            }
        },
        async getFavoriteSkuIds() {
            const { $api } = useNuxtApp();
            if ($api.isAuth.value) {
                const { data } = await $api.get('favorites');
                if (data && Array.isArray(data)) {
                    this.favorites = [...data];
                }
            } else {
                this.favorites = [];
            }
        },
        async addToFavorites(id)  {
            const { $api } = useNuxtApp();
            const { data } = await $api.post('favorites', { id });
            if (data.status) {
                if (!this.favorites.includes(id)) {
                    this.favorites.push(id);
                }
            }
        },
        async removeFromFavorites(id) {
            const { $api } = useNuxtApp();
            const { data } = await $api.delete(`favorites/${id}`);
            if (data.status) {
                const index = this.favoriteSkus.findIndex(el => el.id === id);
                if (index !== -1) {
                    this.favoriteSkus.splice(index, 1);
                }
                const inx = this.favorites.indexOf(id);
                if (inx !== -1) {
                    this.favorites.splice(index, 1);
                }
            }
        }
    },
});
