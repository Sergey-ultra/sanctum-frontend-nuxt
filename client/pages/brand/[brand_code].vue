<template>
  <div>
    <div class="product-page__title">
        <h1 class="title">{{ currentBrand ? currentBrand.name : '' }}</h1>
        <span class="product-page__count">{{  totalCount }} товаров</span>
<!--        <img :src="currentBrand.image" :alt="currentBrand.image">-->
    </div>




    <div class="product-page__wrapper">
        <filter-block class="product-page__filter"/>
        <product-list class="product-page__items"/>
    </div>

    <viewed-products/>
  </div>
</template>

<script setup>
    import filterBlock from "~/components/filterBlock"
    import productList from '~/components/product-list'
    import viewedProducts from '~/components/viewed-products'
    import { storeToRefs } from "pinia";
    //import {useBrandStore} from "~/store/brand";
    import {useProductStore} from "~/store/product";
    import {useFilterStore} from "~/store/filter";
    import {useRuntimeConfig} from "#app";
    const config = useRuntimeConfig();
    // const brandStore = useBrandStore();
    const productStore = useProductStore();
    const filterStore = useFilterStore();
    // const { currentBrand, isLoadingCurrentBrand } = storeToRefs(brandStore);
    const { currentBrand, totalCount } = storeToRefs(productStore);

    const route =  useRoute();
    const setSEO = name => {
        const title = `Бренд ${name}`;
        const metaName = `${title} ${config.public.siteTitle}`;
        useHead({
            title,
            meta: [
                {name: 'description', content: metaName},
                {name: 'keywords', content: metaName}
            ],
        });
    }



    const loadProductsByBrandCode = async () => {
        await Promise.all([
            productStore.loadProductsWithPagination(),
            filterStore.loadFilters()
        ]);
    };

    watch(
        currentBrand,
        (value) => {
            if (value) {
                filterStore.loadReceipts()
                setSEO(value.name)
            }
        }
    );
    watch(
        () => ({ params: route.params, query: route.query }),
        (value, oldValue) => {
            if (value.params.brand_code) {
                if (value.params.brand_code !== oldValue.params.brand_code) {
                    productStore.setProductLoadingMode({brand_code: value.params.brand_code})
                    // brandStore.loadBrandByCode(value.params.brand_code)

                }
                productStore.setProductParamsByProductQuery(value.query)
                loadProductsByBrandCode()
            }
        },
        { deep: true }
    );

    if (currentBrand.value && currentBrand.value.name) {
        setSEO(currentBrand.value.name)
    }

    useAsyncData(async () => {
        if (route.params.brand_code) {
            productStore.setProductLoadingMode({ brand_code: route.params.brand_code });
            productStore.setProductParamsByProductQuery(route.query);
            await loadProductsByBrandCode();
            // await brandStore.loadBrandByCode(route.params.brand_code);
        }
    });
</script>

<style lang="scss" scoped>
    .title {
        color: #2c509a;
        display: inline-block;
        font-size: 32px;
        line-height: 32px;
        font-weight: bold;
        margin-top: 0;
        margin-bottom: 0;
        vertical-align: middle;
        margin-right: 12px;
    }

    .product-page {
        &__title {
            margin: 40px 0 20px;
        }

        &__count {
            font-weight: bold;
            letter-spacing: .2px;
            font-size: 14px;
            display: inline-block;
            vertical-align: middle;
        }

        &__wrapper {
            display:flex;
            justify-content: space-between;
        }

        &__filter {
            z-index:5;
            position: relative;
            width: 272px;
            display: block;
            min-height:700px;
        }

        &__items {
            min-height:700px;
            width: calc(100% - 272px - 15px);
            max-width:  100%;
        }
    }


    @media (max-width: 900px) {
        .product-page__filter {
            display: none;
        }
        .product-page__items {
            width:  100%;
            max-width:  100%;
        }
    }
    @media (min-width: 900px) and (max-width: 1199px) {
        .product-page__filter {
            width: 234px;
        }
        .product-page__items {
            width: calc(100% - 234px - 12px);
        }
    }
</style>
