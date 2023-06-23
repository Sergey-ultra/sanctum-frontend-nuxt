<template>
    <form class="form">
        <h1>Добавление нового объекта</h1>

        <div class="form__group">
            <label>
                <div class="label">
                    <span class="text-gray">Раздел:</span>
                </div>
                <selectComponent
                    :color="'white'"
                    v-model="topLevelCategoryId"
                    :items="topLevelCategories"
                    :item-title="'name'"
                    :item-value="'id'"
                />
            </label>
        </div>

        <div v-if="topLevelCategoryId && lowLevelCategories.length" class="form__group">
            <label>
                <div class="label">
                    <span class="text-gray">Подраздел:</span>
                </div>
                <selectComponent
                    :color="'white'"
                    v-model="lowLevelCategoryId"
                    :items="lowLevelCategories"
                    :item-title="'name'"
                    :item-value="'id'"
                />
            </label>
        </div>

        <div class="form__group">
            <label>
                <div class="label">
                    <span class="text-gray">Точное название объекта отзыва:</span>
                </div>
                <inputComponent v-model="sku.name" :color="'white'"/>
            </label>
        </div>

        <div class="form__group">
            <label>
                <div class="label">
                    <span class="text-gray">Бренд:</span>
                </div>
                <selectComponent
                    v-model="sku.brand_id"
                    :color="'white'"
                    :isSearch="true"
                    :placeholder="'Выберите бренд'"
                    :items="brands"
                    :item-title="'name'"
                    :item-value="'id'"
                />
            </label>
        </div>


        <div>Дополнительная информация об объекте отзыва:</div>
    </form>
</template>
<script setup>
import selectComponent from '~/components/select-component-extended.vue';
import inputComponent from '~/components/input-component.vue';
import { useCategoryStore } from '~/store/category';
import {storeToRefs} from "pinia";
import {useBrandStore} from "~/store/brand";

const categoryStore = useCategoryStore();
const brandStore = useBrandStore();
const { allCategories } = storeToRefs(categoryStore);
const { allBrands } = storeToRefs(brandStore);

const topLevelCategoryId = ref(null);
const lowLevelCategoryId = ref(null);
const sku = ref({
    name: '',
    brand_id: null,
});

let topLevelCategories = computed(() => {
    return [{
        id: null,
        name: 'Выберите раздел',
    }].concat(allCategories.value.filter(el => !el.parent_id));
});

let lowLevelCategories = computed(() => {
    return [{
        id: null,
        name: 'Выберите подраздел',
    }].concat(allCategories.value.filter(el => el.parent_id === topLevelCategoryId.value));
});

let brands = computed(() => {
    return [{
        id: null,
        name: 'Выберите бренд',
    }].concat(allBrands.value);
})


onMounted(async() => {
    categoryStore.loadAllCategories();
    brandStore.loadAllBrands();
})
</script>
<style scoped lang="scss">

</style>
