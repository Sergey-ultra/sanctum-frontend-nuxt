<template>
    <div>
        <div v-if="!isShowAddForm" class="fill">
            <div v-if="$api.isAuth.value && mySkusWithoutReview.length" class="alert">
                Недавно добавленные Вами объекты отзывов, на которые Вы ещё не писали отзыв:
                <ul>
                    <li v-for="sku in mySkusWithoutReview" :key="sku.id">
                        <nuxt-link :to="`/product/${sku.product_code}-${sku.id}/add-review`">
                            {{ sku.name }} {{ sku.volume }}
                        </nuxt-link>
                    </li>
                </ul>
            </div>

            <p class="item">
                Для добавления нового отзыва необходимо указать объект, о котором Вы собираетесь написать отзыв.
                Если во всплывающей подсказке вы обнаружите нужный объект, то выберите его, чтобы пропустить лишние шаги.
            </p>

            <p class="item bold">Введите <span class="red">точное название</span> объекта отзыва, о котором хотите написать:</p>
            <div class="item flex">
                <div class="fill">
                    <inputComponent v-model.trim="search" :color="'white'" :isLoading="isLoadingSuggests" @input="getSuggests"/>
                    <div class="invalid-feedback" v-for="error of v$.search.$errors" :key="error.$uid">
                        {{ error.$message }}
                    </div>
                </div>
                <buttonComponent @click="showAddForm">
                    Далее
                </buttonComponent>
            </div>
            <div class="item search">
                <ul class="suggest__content" v-if="search">
                    <li
                        v-for="(sku, index) in skus"
                        :key="index"
                        class="suggest__item"
                    >
                        <nuxt-link :to="`/product/${sku.sku_code}/add-review`" class="mini-suggest__link">
                            <div class="suggest__img" :style="`background-image: url(${$config.APP_URL}/${sku.image})`">

                            </div>
                            <div class="suggest__text">
                                <span class="suggest__title">{{`${sku.name} ${sku.volume}`}}</span>
                                <div class="suggest__info">От {{sku.min_price}} ₽</div>
                            </div>
                        </nuxt-link>
                    </li>
                </ul>
                <div v-else>
                    <h3 class="h3">Примеры правильного оформления названий:</h3>
                    <div>
                        <div v-for="(popularSku, index) in popularSkus" :key="index">
                            {{ popularSku.name }} {{ popularSku.volume }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <addNewSku v-else @hideAddForm="hideAddForm"/>
    </div>
</template>
<script setup>
import inputComponent from "~/components/input-component.vue";
import addNewSku from "./add-new-sku.vue";
import buttonComponent from "~/components/button-component.vue";
import {useSuggestStore} from "~/store/suggest";
import {useProductStore} from "~/store/product";
import {storeToRefs} from "pinia";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {useNuxtApp} from "#app";

const suggestStore = useSuggestStore();
const productStore = useProductStore();
const { skus, isLoadingSuggests } = storeToRefs(suggestStore);
const { popularSkus, mySkusWithoutReview } = storeToRefs(productStore);
const { $api } = useNuxtApp();
const search = ref('');
const isShowAddForm = ref('');


const rules = {
    search: {
        required: helpers.withMessage('Укажите точное название объекта своего отзыва (как в примере)!', required),
    },
};

const v$ = useVuelidate(rules, { search });

const getSuggests = () => {
    if (search.value) {
        suggestStore.getSuggests(search.value);
    } else {
        suggestStore.setSuggestsToDefault();
    }
}

const showAddForm = async () => {
    const validated = await v$.value.search.$validate();
    if (validated) {
        isShowAddForm.value = true;
    }
}

const hideAddForm = () =>  isShowAddForm.value = false;

onMounted(() => {
    if ($api.isAuth.value) {
        productStore.loadMySkusWithoutReview();
    }
    productStore.getPopularTenSkus();
});
</script>
<style scoped lang="scss">
    $redColor: #b74746;
    .flex {
        gap: 15px;
        display:flex;
    }
    .item {
        margin-bottom: 15px;
    }
    .fill {
        width: 100%;
    }
    .bold {
        font-weight: bold;
    }
    .search {
        box-shadow: 0 0 3px 1px rgba(0,0,0,0.13);
        padding: 16px;
        background-color: white;
        border-radius: 8px;
    }
    .red {
        color: $redColor;
    }
    .h3 {
        font-size: 14px;
        font-weight: bold;
        text-transform: uppercase;
        border-bottom: 1px solid #e2e6e9;
        padding-bottom: 2px;
    }
    .suggest {
        &__content {
            padding: 3px 0;
            display: block;
            list-style: none;
            margin: 0;
            width:100%;
        }
        &__item {
            margin: 0 3px;
            border-radius: 7px;
            height: auto;
            &:hover {
                background-color: #fef5da;
            }

        }
        &__link {
            width: 100%;
            padding: 8px 13px;
            color: #000;
            display: block;
            outline: none;
            text-decoration: none;
        }
        &__img {
            background-position: 50%;
            background-repeat: no-repeat;
            border-radius: 4px;
            display: inline-block;
            position: relative;
            vertical-align: middle;
            height: 40px;
            margin-right: -40px;
            width: 40px;
            background-size: contain;
            & img {
                max-width:100%;
                max-height:100%;
            }
        }
        &__text {
            padding-left: 52px;
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            min-height: 40px;
            vertical-align: middle;
            width: 100%;
        }
        &__title {
            color: #222;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        &__info {
            color: grey;
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
        }
    }
</style>
