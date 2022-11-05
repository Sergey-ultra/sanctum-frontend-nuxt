import { useNuxtApp } from '#app'

export const useBannerStore = defineStore({
    id: 'banner',
    state: () => ({
        isShowBanner: true,
        bannerUrls: [],
        isLoadingBanner: false
    }),
    actions: {
        setShowBanner(payload) {
            this.isShowBanner = payload;
        },
        async loadBanner() {
            this.isLoadingBanner = true;
            const { $api } = useNuxtApp()
            const { data } = await $api.get(`banner`);
            if (data) {
                this.bannerUrls = [...data];
            }
            this.isLoadingBanner = false;
        }
    }
});
