import {useNuxtApp} from "#app";
import {useCurrentSkuStore} from "./currentSku";
import {useNotificationStore} from "./notification";


export const useReviewStore = defineStore({
    id: 'review',
    state: () => ({
        selectedRating: 0,
        isLoadingReviews:false,
        reviewsWithPagination:[],
        tableOptions: {
            currentPage: 1,
            rating: []
        },
        total: 0,
        lastPage: 1,
        additionalInfo: [],
        ratingFilter: {},
        isLoadingSkuAdditionalInfo: false,
        existingReview: null,
        isCheckingExistingReview: false,
        lastReviews: [],
        isLoadingLastReviews: false,
        myReviews:[],
        myReviewTotal:0,
        myReviewsLastPage: 1,
        myReviewsOptions: {
            currentPage: 1,
            rating: []
        },
        isLoadingMyReviews: false,
        isUploadingFormWithVideo: false
    }),
    getters: {
        reviewsByRating: state => {
            let reviewsByRating = {};

            [5, 4, 3, 2, 1].forEach(rating => {
                const currentRating = state.reviewsWithPagination.filter(el => Number(el.rating) === rating);
                if (currentRating.length) {
                    reviewsByRating[rating] = { count: currentRating.length };
                }
            })
          return reviewsByRating
        }
    },
    actions: {
        setSelectedRating(payload) {
            this.selectedRating = payload;
        },
        setExistingReview(payload) {
            this.existingReview = payload;
        },
        setTableOptionsByQuery(query) {
            this.tableOptions.currentPage = 1;
            for (let [key, value] of Object.entries(query)) {
                if (key === 'page') {
                    this.tableOptions.currentPage = Number(value);
                } else if (key === 'rating' && value) {
                    this.tableOptions.rating = [...value];
                }
            }
        },
        setMyReviewsOptionsByQuery(query) {
            this.myReviewsOptions.currentPage = 1;
            for (let [key, value] of Object.entries(query)) {
                if (key === 'page') {
                    this.myReviewsOptions.currentPage = Number(value);
                } else if (key === 'rating' && value) {
                    this.myReviewsOptions.rating = [...value];
                }
            }
        },
        async checkUserRating() {
            const currentSkuStore = useCurrentSkuStore();
            const skuId = currentSkuStore.currentSkuId;
            if (skuId) {
                const { $api } = useNuxtApp()
                const { data } = await $api.post('/rating/check-user-rating', { sku_id: skuId});

                if (data.status === 'success') {
                    this.setSelectedRating(data.data);
                }
            }
        },
        async createOrUpdateRating(rating) {
            const currentSkuStore = useCurrentSkuStore();
            const skuId = currentSkuStore.currentSkuId;
            if (skuId) {
                const { $api } = useNuxtApp()
                const { data } = await $api.post('/rating/create-or-update', {
                    sku_id: skuId,
                    rating
                })
                if (data.status === 'success') {
                    this.setSelectedRating(rating)
                }
            }
        },
        async loadReviewsWithPagination() {
            const currentSkuStore = useCurrentSkuStore();
            const skuId = currentSkuStore.currentSkuId;

            if (skuId) {
                this.isLoadingReviews = true;
                const params = { page: this.tableOptions.currentPage };
                if (this.tableOptions.rating.length) {
                    params['filter[rating]'] = this.tableOptions.rating;
                }
                const { $api } = useNuxtApp()
                const  data  = await $api.get(`/reviews/by-sku-id/${skuId}`, { params });
                if (data) {
                    this.reviewsWithPagination = [...data.data];
                    this.total = data.meta.total;
                    this.lastPage = data.meta.last_page;
                }
                this.isLoadingReviews = false;
            }
        },
        async loadLastReviews() {
            this.isLoadingLastReviews = true;
            const { $api } = useNuxtApp()
            const { data } = await $api.get(`/reviews/last`);
            if (data) {
                this.lastPage = [...data];
            }
            this.isLoadingLastReviews = false;
        },
        async loadReviewAdditionalInfo() {
            const currentSkuStore = useCurrentSkuStore();
            const skuId = currentSkuStore.currentSkuId;

            if (skuId) {
                this.isLoadingSkuAdditionalInfo = true;
                const { $api } = useNuxtApp()
                const { data }  = await $api.get(`/reviews/additional-info-by-sku-id/${skuId}`)

                if (data) {
                    this.additionalInfo = [...data.info];
                    this.ratingFilter = {...data.rating_filter};
                }
                this.isLoadingSkuAdditionalInfo = false;
            }
        },
        async loadMyRatingsWithReviews() {
            this.isLoadingMyReviews = true;
            const params = { page: this.myReviewsOptions.currentPage };
            if (this.myReviewsOptions.rating.length) {
                params['filter[rating]'] = this.myReviewsOptions.rating;
            }

            const { $api } = useNuxtApp();
            const data = await $api.get('/reviews/my', { params });
            if (data) {
                this.myReviews = [...data.data];
                this.myReviewsTotal = data.meta.total;
                this.myReviewsLastPage = data.meta.last_page;
            }
            this.isLoadingMyReviews = false;
        },
        async checkExistingReview() {
            const currentSkuStore = useCurrentSkuStore();
            const skuId = currentSkuStore.currentSkuId;
            if (skuId) {
                this.isCheckingExistingReview = true;
                const { $api } = useNuxtApp()
                const { data } = await $api.post('/review/check-existing-review', { sku_id: skuId });

                if (data) {
                    this.setExistingReview(data);
                    this.setSelectedRating(Number(data.rating));
                } else {
                    this.setExistingReview(null);
                }
                this.isCheckingExistingReview = false;
            }
        },
        async addOrUpdateVideo(obj) {
            const currentSkuStore = useCurrentSkuStore();
            const skuId = currentSkuStore.currentSkuId;
            if (skuId) {
                obj.sku_id = skuId;
                const { $api } = useNuxtApp();
                this.isUploadingFormWithVideo = true;
                const { data } = await $api.post('/reviews/add-video', obj);

                if (data.status === 'success') {
                    const notificationStore = useNotificationStore();
                    notificationStore.setSuccess('Видео успешно загружено и будет опубликовано после модерации');
                }
                this.isUploadingFormWithVideo = false;
            }
        },
        async updateOrCreateReview(obj) {
            const currentSkuStore = useCurrentSkuStore();
            const skuId = currentSkuStore.currentSkuId;
            if (skuId) {
                obj.sku_id = skuId;
                const { $api } = useNuxtApp()
                const { data } = await $api.post('/reviews', obj);

                if (data.status === 'success') {
                    this.setExistingReview(data.data);
                    const notificationStore = useNotificationStore();
                    notificationStore.setSuccess('Отзыв успешно создан и будет опубликован после модерации');
                }
            }
        },
        async deleteReview(id) {
            const { $api } = useNuxtApp()
            await $api.delete(`/reviews/${id}`)
            await this.loadMyRatingsWithReviews();
            const notificationStore = useNotificationStore();
            notificationStore.setSuccess('Отзыв успешно удален');
        }
    }
});
