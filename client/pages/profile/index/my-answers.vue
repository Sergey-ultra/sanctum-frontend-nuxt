<template>
  <div>
    <reviewsAnswersNav></reviewsAnswersNav>
      <div class="loader__wrapper" v-if="isLoadingMyQuestions">
          <loader class="loader"></loader>
      </div>
      <div class="wrapper" v-else>
          <div v-if="!myQuestions.length">
              <h2>Ваши ответы будут полезны другим</h2>
              <div>
                  О многих товарах на Маркете пользователи задают вопросы.
                  Возможно, на какие-то из них вы знаете ответ.
                  Найдите в соответствующем разделе товар, о котором вы многое знаете, и проверьте, о чём спрашивают во вкладке «Вопросы о товаре».
              </div>
          </div>

          <my-answer
              @deleteItem="questionStore.deleteItem(article.id)"
              v-for="question in myQuestions"
              :key="question.id"
              :question="question"
          />

          <pagination
              v-if="myQuestions.length && myQuestionLastPage > 1"
              v-model:currentPage="currentPageLocal"
              :lastPage="myQuestionLastPage"
          />
      </div>
  </div>
</template>

<script setup>
    import reviewsAnswersNav from "~/components/profile/reviewsAnswersNav";
    import pagination from '../../../components/pagination';
    import loader from "~/components/loader";
    import myAnswer from "~/components/profile/my-answer";



    import { storeToRefs } from "pinia";
    import { useQuestionStore } from "../../../store/question";

    const questionStore = useQuestionStore();
    const { isLoadingMyQuestions, myQuestions, myQuestionOptions, myQuestionLastPage } = storeToRefs(questionStore);

    let router = useRouter();
    let route = useRoute();
    const setPageQuery = value => {
        const query = {...route.query}

        if (value > 1) {
            query.page = value
        } else if (value === 1) {
            delete query.page
        }
        router.push({ query })
    };

    const currentPageLocal = computed({
        get() {
            return myQuestionOptions.value.currentPage;
        },
        set(value) {
            setPageQuery(value);
        }
    });

    const setSEO = () => {
        const title = `Мои ответы`;
        const metaName = `${title} Smart-Beautiful - агрегатор цен косметических товаров`;
        useHead({
            title,
            meta: [
                {name: 'description', content: metaName},
                {name: 'keywords', content: metaName}
            ],
        });
    }



    watch(
        () => ({ params: route.query }),
        async (value) => {
            questionStore.setMyQuestionsOptionsByQuery(value.query)
            await questionStore.loadMyQuestions();
        },
        {deep: true}
    );

    setSEO();

    onMounted(async () => {
        questionStore.setMyQuestionsOptionsByQuery(route.query)
        await questionStore.loadMyQuestions();
    });
</script>

<style lang="scss" scoped>
.loader {
    width: 100px;
    height: 100px;
    &__wrapper {
        display: flex;
        justify-content: center;
        align-items:center;
    }
}
</style>