<template>
    <div>
        <div class="loader__wrapper" v-if="isLoadingMyDrafts">
            <loader class="loader"></loader>
        </div>
        <div class="table">
            <div class="table__date">Дата</div>
            <div class="table__sku">Заголовок</div>
            <div class="table__status">Статус</div>
            <div class="table__symbolCount">Символов</div>
            <div class="table__photosCount">Фото</div>
            <div>Action</div>
        </div>

        <my-review
            :item="review"
            class="item"
            v-for="(review, index) in myDrafts"
            :key="index"
        />
    </div>
</template>
<script setup>
import myReview from "~/components/profile/my-review-new";
import { storeToRefs } from "pinia";
import { useReviewStore } from "~/store/review";

const reviewStore = useReviewStore();
const { myDrafts, isLoadingMyDrafts } = storeToRefs(reviewStore);

onMounted(async () => {
    if (!myDrafts.value.length) {
        await reviewStore.loadMyDrafts();
    }
});
</script>
<style scoped lang="scss">
.loader {
    width: 100px;
    height: 100px;
    &__wrapper {
        display: flex;
        justify-content: center;
        align-items:center;
    }
}
.table {
    background-color: #fff;
    display: flex;
    align-items: center;
    & div {
        padding: 8px;
    }

    &__date {
        width: 10%;
    }
    &__sku {
        width: 40%;
    }
    &__status {
        width: 20%;
    }
    &__symbolCount,
    &__photosCount {
        width: 10%;
    }
}
</style>
