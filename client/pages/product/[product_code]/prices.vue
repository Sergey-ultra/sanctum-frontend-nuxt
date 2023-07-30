<template>
    <product>
        <div class="prices">
            <div
                class="prices__item"
                v-for="price in currentSku.prices"
                :key="price.price"
            >
                <a :href="'/to/' + price.link_code">{{ price.name }}</a>
                <a :href="'/to/' + price.link_code">{{ price.price }}</a>
                <a class="prices__go" :href="'/to/' + price.link_code">Перейти в магазин</a>
                <div class="prices__img">
                    <img :src="`${$config.APP_URL}/${price.image}`" :alt="price.image"/>
                </div>
            </div>
        </div>
    </product>
</template>

<script setup>
    import product from '~/components/product';
    import { storeToRefs } from "pinia";
    import {useCurrentSkuStore} from "~/store/currentSku";
    import {useRuntimeConfig} from "#app";
    const config = useRuntimeConfig();

    const { currentSku } = storeToRefs(useCurrentSkuStore());

    const setSEO = () => {
        const title = `Цены ${currentSku.value.name}`;
        const metaName = `${title} ${config.public.siteTitle}`;
        useHead({
            title,
            meta: [
                {name: 'description', content: metaName},
                {name: 'keywords', content: metaName}
            ],
        });
    }

    setSEO();
</script>

<style lang="scss" scoped>
    .prices {
        max-width: 800px;
        &__item {
            height: 50px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            justify-content: space-between;
            &:hover {
                background-color:  #f4f4f4;;
            }
            & a {
                text-decoration: none;
            }
        }
        &__go {
            border: 1px solid #eee;
            padding: 6px 16px;
            border-radius: 6px;
        }
        &__img {
            height: 30px;
            width: 150px;
            display:flex;
            align-items: center;
            justify-content: center;
            & img {
                max-width: 100%;
                max-height: 100%;
            }
        }
    }
</style>
