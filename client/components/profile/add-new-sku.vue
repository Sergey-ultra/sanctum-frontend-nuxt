<template>
    <form class="form" @submit.prevent="createNewSku">
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
                    v-model="sku.category_id"
                    :items="lowLevelCategories"
                    :item-title="'name'"
                    :item-value="'id'"
                />
                <div class="invalid-feedback" v-for="error of v$.sku.category_id.$errors" :key="error.$uid">
                    {{ error.$message }}
                </div>
            </label>
        </div>

        <div class="form__group">
            <label>
                <div class="label">
                    <span class="text-gray">Точное название объекта отзыва:</span>
                </div>
                <inputComponent v-model="localSkuName" :color="'white'"/>
                <div class="invalid-feedback" v-for="error of v$.sku.name.$errors" :key="error.$uid">
                    {{ error.$message }}
                </div>
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
                <div class="invalid-feedback" v-for="error of v$.sku.brand_id.$errors" :key="error.$uid">
                    {{ error.$message }}
                </div>
            </label>
        </div>

        <div class="form__group">
            <label>
                <div class="label">
                    <span class="text-gray">Объем:</span>
                </div>
                <inputComponent v-model="sku.volume" :color="'white'"/>
                <div class="invalid-feedback" v-for="error of v$.sku.volume.$errors" :key="error.$uid">
                    {{ error.$message }}
                </div>
            </label>
        </div>

        <div class="form__group">
            <label>
                <div class="label">
                    <span class="text-gray">Описание:</span>
                </div>
                <textareaComponent rows="10" v-model="sku.description" :color="'white'"/>
                <div class="invalid-feedback" v-for="error of v$.sku.description.$errors" :key="error.$uid">
                    {{ error.$message }}
                </div>
            </label>
        </div>

        <div class="form__group">
            <label>
                <div class="label">
                    <span class="text-gray">Фотографии объекта отзыва:</span>
                </div>
                <multiple-image-upload
                    class="image-upload"
                    :entity="`sku`"
                    v-model:initialImageUrls="sku.images"
                />
                <div class="invalid-feedback" v-for="error of v$.sku.images.$errors" :key="error.$uid">
                    {{ error.$message }}
                </div>
            </label>
        </div>

        <buttonComponent type="submit">
            Продолжить
        </buttonComponent>
    </form>
</template>
<script setup>
import multipleImageUpload from "~/components/image-upload-as-form/multiple-image-upload";
import textareaComponent from '~/components/textareaComponent';
import buttonComponent from '~/components/button-component';
import selectComponent from '~/components/select-component-extended.vue';
import inputComponent from '~/components/input-component.vue';
import { useCategoryStore } from '~/store/category';
import { useProductStore } from '~/store/product';
import {useBrandStore} from "~/store/brand";
import {storeToRefs} from "pinia";
import {helpers, minLength, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const categoryStore = useCategoryStore();
const brandStore = useBrandStore();
const productStore = useProductStore();
const { allCategories } = storeToRefs(categoryStore);
const { allBrands } = storeToRefs(brandStore);

const router = useRouter();

const props = defineProps({
    name: {
        type: String
    }
});

const topLevelCategoryId = ref(null);

const sku = ref({
    name: '',
    brand_id: null,
});

const rules = {
    sku: {
        name: {
            required: helpers.withMessage('Поле должно быть заполнено', required),
            minLength: helpers.withMessage('Поле должно быть не меньше 5 символов', minLength(5)),
        },
        brand_id: {
            required: helpers.withMessage('Поле должно быть заполнено', required),

        },
        category_id: {
            required: helpers.withMessage('Поле должно быть заполнено', required),
        },
        volume: {
            required: helpers.withMessage('Поле должно быть заполнено', required),
        },
        description: {
            required: helpers.withMessage('Поле должно быть заполнено', required),
            minLength: helpers.withMessage('Поле должно быть не меньше 5 символов', minLength(5)),
        },
        images: {
            required: helpers.withMessage('Поле должно быть заполнено', required),
        }
    }
};
const v$ = useVuelidate(rules, { sku });


const localSkuName = computed({
    get() {
        if (sku.value.name){
            return sku.value.name;
        }
        return props.name;
    },
    set(value) {
        sku.value.name = value;
    }
});

const topLevelCategories = computed(() => {
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
});

const createNewSku = async () => {
    const validated = await v$.value.sku.$validate();
    if (validated) {
        const response = await productStore.createSku(sku.value);
        if (response) {
            await router.push({ name: 'product-product_code-add-review', params: { product_code: response.sku_code }});
        }
        v$.value.$reset();
    }
}

onMounted(async() => {
    categoryStore.loadAllCategories();
    brandStore.loadAllBrands();
})
</script>
<style scoped lang="scss">

</style>
