import {useNuxtApp} from "#app";
import {useCurrentSkuStore} from "./currentSku";
import {useNotificationStore} from "./notification";


export const useVideoStore = defineStore({
    id: 'video',
    state: () => ({
        myVideos:[],
        myVideosTotal: 0,
        myVideosLastPage: 1,
        myVideosOptions: {
            currentPage: 1
        },
        isLoadingMyVideos: false
    }),
    actions: {
        setMyVideosOptionsByQuery(query) {
            this.myVideosOptions.currentPage = 1;
            for (let [key, value] of Object.entries(query)) {
                if (key === 'page') {
                    this.myVideosOptions.currentPage = Number(value);
                }
            }
        },
        async loadMyVideos() {
            this.isLoadingMyVideos = true;

            const { $api } = useNuxtApp();
            const data = await $api.get('/videos/my', { params: { page: this.myVideosOptions.currentPage } });
            if (data) {
                this.myVideos = [...data.data];
                this.myVideosTotal = data.meta.total;
                this.myVideosLastPage = data.meta.last_page;
            }
            this.isLoadingMyVideos = false;
        }
    }
});
