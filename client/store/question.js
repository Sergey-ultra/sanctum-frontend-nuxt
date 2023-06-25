import {useNuxtApp} from "#app";
import {useCurrentSkuStore} from "./currentSku";


export const useQuestionStore = defineStore({
    id: 'question',
    state: () => ({
        isLoadingQuestions: false,
        questionWithPagination: [],
        total: 0,
        lastPage: 1,
        tableOptions: {
            currentPage: 1,
        },
        myQuestionOptions: {
            currentPage: 1,
        },
        isLoadingMyQuestions: false,
        myQuestions: [],
        myQuestionTotal: 0,
        myQuestionLastPage: 1

    }),
    actions: {
        setMyQuestionsOptionsByQuery(query) {
            this.myQuestionOptions.currentPage = 1;
            for (let [key, value] of Object.entries(query)) {
                if (key === 'page') {
                    this.myQuestionOptions.currentPage = Number(value);
                }
            }
        },
        async loadMyQuestions()  {
            this.isLoadingMyQuestions = true;

            const { $api } = useNuxtApp();
            const  data  = await $api.get('/questions/my', {params: { page: this.myQuestionOptions.currentPage }});
            if (data) {
                this.myQuestions = [...data.data];
                this.myQuestionTotal = data.total;
                this.myQuestionLastPage = data.last_page;
            }
            this.isLoadingMyQuestions = false;
        },
        setTableOptions(payload) {
            this.tableOptions = { ...payload };
        },
        setTableOptionsToDefault() {
            this.tableOptions = { page: 1};
        },
        setTableOptionsByQuery(query) {
            this.tableOptions.currentPage = 1
            for (let [key, value] of Object.entries(query)) {
                if (key === 'page') {
                    this.tableOptions.currentPage = Number(value)
                }
            }
        },
        async reloadQuestions() {
            this.setTableOptionsToDefault();
            await this.loadQuestionsWithPagination();
        },
        async loadQuestionsWithPagination() {
            const currentSkuStore = useCurrentSkuStore();
            const skuId = currentSkuStore.currentSkuId;
            if (skuId) {
                this.isLoadingQuestions = true;

                const params = {
                    page: this.tableOptions.currentPage,
                    sku_id: skuId
                }
                const { $api } = useNuxtApp()
                const { data } = await $api.get('questions', { params });
                if (data) {
                    this.questionWithPagination = [...data.data];
                    this.total = data.total;
                    this.lastPage = data.last_page;
                }
                this.isLoadingQuestions = false;
            }
        },
        async createQuestion(obj) {
            const currentSkuStore = useCurrentSkuStore();
            const skuId = currentSkuStore.currentSkuId;
            if (skuId) {
                obj.sku_id = skuId;
                const { $api } = useNuxtApp();
                const { data } = await $api.post('questions', obj);
                $api.$toast.setSuccess('Вопрос успешно создан и будет опубликован после модерации');
                await this.reloadQuestions();
            }
        },
        async deleteItem(id) {
            const { $api } = useNuxtApp();
            await $api.delete(`/questions/${id}`);
            await this.loadMyQuestions();
            $api.$toast.setSuccess('Отзыв успешно удален');
        }
    },
});
