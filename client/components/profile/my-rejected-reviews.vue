<template>
    <div>
        <div class="loader__wrapper" v-if="isLoadingMyRejectedReviews">
            <loader class="loader"></loader>
        </div>
        <div>
            <div class="table__row">
                <div class="table__item table__item-date">Дата</div>
                <div class="table__item table__item-name">Заголовок</div>
                <div class="table__item table__item-status">Статус</div>
                <div class="table__item table__item-symbolCount">Символов</div>
                <div class="table__item table__item-photosCount">Фото</div>
                <div>Action</div>
            </div>

            <div
                class="review item"
                v-for="(item, index) in myRejectedReviews"
                :key="index"
            >
                <div class="table__row">
                    <div class="table__item table__item-date">
                        {{ item.created_at }}
                    </div>
                    <nuxt-link
                        :to="`/product/${item.sku.product_code}-${item.sku.id}/add-review`"
                        class="table__item table__item-name"
                    >
                        <div class="table__item-img">
                            <img :src="item.sku.image" :alt="item.sku.name"/>
                        </div>
                        <div class="review__sku">{{ item.sku.name }}, {{ item.sku.volume }}</div>
                    </nuxt-link>
                    <div class="table__item table__item-status">
                        <tool-tip :position="'bottom'" :color="'pink'">
                            <template v-slot:content>
                                <div v-for="(reason, index) in item.rejected_reasons" :key="index">
                                    {{ reason }}
                                </div>
                            </template>
                            {{ getStatusText(item.status) }}
                        </tool-tip>
                    </div>
                    <div class="table__item table__item-symbolCount">
                        {{ item.symbol_count }}
                    </div>
                    <div class="table__item table__item-photosCount">
                        {{ item.photos_count }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import getStatusText from "~/utils/getStatusText";
import { storeToRefs } from "pinia";
import { useReviewStore } from "~/store/review";

const reviewStore = useReviewStore();
const { myRejectedReviews, isLoadingMyRejectedReviews } = storeToRefs(reviewStore);

onMounted(async () => {
    await reviewStore.loadMyRejectedReviews();
});
</script>
<style scoped lang="scss">

</style>
