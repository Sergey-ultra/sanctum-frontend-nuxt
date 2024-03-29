import {useNuxtApp} from "#app";
import {useCurrentSkuStore} from "./currentSku";


export const useReviewStore = defineStore({
    id: 'review',
    state: () => ({
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
        isUploadingFormWithVideo: false,
        isLoadingCurrentReview: false,
        currentReview: null,
        myDrafts: [],
        isLoadingMyDrafts: false,
        myModeratedReviews: [],
        isLoadingMyModeratedReviews: false,
        myRejectedReviews: [],
        isLoadingMyRejectedReviews: false,
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
        },
    },
    actions: {
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

        async loadReviewsWithPagination() {
            const currentSkuStore = useCurrentSkuStore();
            const skuId = currentSkuStore.currentSkuId;

            if (skuId) {
                this.isLoadingReviews = true;
                const params = { page: this.tableOptions.currentPage };
                if (this.tableOptions.rating.length) {
                    params['filter[rating]'] = this.tableOptions.rating;
                }
                const { $api } = useNuxtApp();
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
                this.lastReviews = [...data];
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
        async loadMyReviews() {
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
        async loadMyModeratedReviews() {
            this.isLoadingMyModeratedReviews = true;
            const { $api } = useNuxtApp();
            const data = await $api.get('/reviews/my-moderated');
            if (data) {
                this.myModeratedReviews = [...data.data];
            }
            this.isLoadingMyModeratedReviews = false;
        },
        async loadMyRejectedReviews() {
            this.isLoadingMyRejectedReviews = true;
            const { $api } = useNuxtApp();
            const data = await $api.get('/reviews/my-rejected');
            if (data) {
                this.myRejectedReviews = [...data.data];
            }
            this.isLoadingMyRejectedReviews = false;
        },
        async loadMyDrafts() {
            this.isLoadingMyDrafts = true;
            const { $api } = useNuxtApp();
            const data = await $api.get('/reviews/my-drafts');
            if (data) {
                this.myDrafts = [...data.data];
            }
            this.isLoadingMyDrafts = false;
        },
        async loadCurrentReview(id) {
            this.isLoadingCurrentReview = true;
            const { $api } = useNuxtApp();
            const { data } = await $api.get(`/reviews/${id}`);

            if (data) {
                this.currentReview = { ...data };
            }
            this.isLoadingCurrentReview = false;
        },
        async checkExistingReview() {
            const currentSkuStore = useCurrentSkuStore();
            const skuId = currentSkuStore.currentSkuId;
            if (skuId) {
                this.isCheckingExistingReview = true;
                const { $api } = useNuxtApp();
                const { data } = await $api.post('/review/check-existing-review', { sku_id: skuId });

                if (data) {
                    this.setExistingReview(data);
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
                    $api.$toast.setSuccess('Видео успешно загружено и будет опубликовано после модерации');
                }
                this.isUploadingFormWithVideo = false;
            }
        },
        async updateOrCreateReview(payload) {
            const currentSkuStore = useCurrentSkuStore();
            const skuId = currentSkuStore.currentSkuId;
            if (skuId) {
                payload.sku_id = skuId;
                const { $api } = useNuxtApp();
                const { data } = await $api.post('/reviews', payload);

                if (data.status === 'success') {
                    this.setExistingReview(data.data);
                    $api.$toast.setSuccess('Отзыв успешно создан и будет опубликован после модерации');
                }
            }
        },
        async updatePublished(payload) {
            const { $api } = useNuxtApp();
            const { data } = await $api.put(`/reviews/${payload.id}`, payload);

            if (data.status === 'success') {
                this.setExistingReview(data.data);
                $api.$toast.setSuccess('Отзыв успешно создан и будет опубликован после модерации');
            }
        },
        async deleteReview(id) {
            const { $api } = useNuxtApp();
            await $api.delete(`/reviews/${id}`)
            await this.loadMyReviews();
            $api.$toast.setSuccess('Отзыв успешно удален');
        },
    },
});
