<template>
    <div>
        <div class="title-main">
            <h2 class="title">Бренды</h2>
        </div>
        <div class="brands">
            <div v-if="isLoadingAllBrands"></div>
            <div v-else class="brands__content">
                <div class="filter">
                    <select class="filter__item select filter__select" v-model="country">
                        <option value="null">Все страны</option>
                        <option v-for="country in countries" :key="country" :value="country">
                            {{ country }}
                        </option>
                    </select>
                    <input class="filter__item input filter__input" type="text" placeholder="Поиск по бренду"
                           v-model.trim="search">
                    <button class="filter__item button filter__button" @click="searchReset">Сброс</button>
                </div>
                <div
                    class="brands__list"
                    v-for="(letter, index) in filteredBrands"
                    :key="index"
                >
                    <div class="brands__title">{{ letter.letter }}</div>
                    <div class="brands__items">
                        <nuxt-link
                            class="brands__item"
                            v-for="brand in letter.brands"
                            :key="brand.id"
                            :to="`/brand/${brand.code}`"
                        >
                            <span>{{ brand.name }}</span>
                            <span class="brands__country">{{ brand.country }}</span>
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {storeToRefs} from "pinia";
    import {useBrandStore} from "../../store/brand";
    const brandStore = useBrandStore();
    const {allBrands, isLoadingAllBrands, countries} = storeToRefs(brandStore);

    const country = ref('null');
    const search = ref('');
    // let chunksCount = ref(3);

    const searchReset = () => {
        country.value = 'null';
        search.value = '';
    };

    // const spliceIntoChunks = (arr, countOfChunks = 3) => {
    //     let res = [];
    //     const chunkSize = Math.ceil(arr.length / countOfChunks)
    //     for (let i = 0; i < countOfChunks; i++) {
    //         const chunk = arr.slice(chunkSize * i, chunkSize * (i + 1));
    //         res.push(chunk);
    //     }
    //     return res;
    // }

    let filteredBrands = computed(() => {
        if (country.value !== 'null' || search.value !== '') {
            return allBrands.value.map(el => {
                let brands = el.brands

                if (country.value !== 'null') {
                    brands = brands.filter(brand => brand.country === country.value)
                }

                if (search.value !== '') {
                    brands = brands.filter(brand => brand.name.toLowerCase().includes(search.value.toLowerCase()))
                }

                return {
                    letter: el.letter,
                    brands
                }
            }).filter(el => el.brands.length > 0)
        }
        return allBrands.value;
    });



    // const handledBrands = computed(() => {
    //     return filteredBrands.value.map(el => {
    //         return {
    //             letter: el.letter,
    //             brands: spliceIntoChunks(el.brands, chunksCount.value)
    //         };
    //     });
    // });

    const setSEO = () => {
        const name = 'Бренды'
        const metaName = `${name} Smart-Beautiful - агрегатор цен косметических товаров`;
        useHead({
            title: name,
            meta: [
                {name: 'description', content: metaName},
                {name: 'keywords', content: metaName}
            ],
        });
    }

    setSEO();
    //
    // onBeforeMount(() => {
    //     const width = document.documentElement.clientWidth
    //     if (width > 600) {
    //         chunksCount.value = 3;
    //     }
    //     if (width < 600 && width > 401) {
    //         chunksCount.value = 2;
    //     }
    //     if (width < 400) {
    //         chunksCount.value = 1;
    //     }
    // });

    useAsyncData(async () => {
        if (!allBrands.value.length) {
            await brandStore.loadAllBrand();
        }
    });


</script>

<style lang="scss" scoped>
.title-main {
    margin: 30px 0 20px;
}

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

.select {
    border-radius: 8px;
    border: 1px solid transparent;
    outline: #000 none medium;
    overflow: visible;
    background-color: rgb(240, 242, 252);
    padding: 8px;

    &:hover {
        border-color: rgb(192, 201, 240);
        transition: border-color 0.3s ease 0s;
    }
}

.input {
    width: 100%;
    outline: #000 none medium;
    overflow: visible;
    transition: background-color 0.3s ease 0s, border-color 0.3s ease 0s;
    border: 1px solid transparent;
    border-radius: 8px;
    padding: 8px;
    background-color: rgb(240, 242, 252);

    &:hover {
        border-color: rgb(192, 201, 240);
        transition: border-color 0.3s ease 0s;
    }

    &:focus {
        background-color: white;
        border-color: rgb(59, 87, 208);
        transition: background-color 0.3s ease 0s, border-color 0.3s ease 0s;
    }
}

.button {
    background-color: #e8e8e8;
    border: none;
    color: #333;
    border-radius: 8px;
    transition: background-color 0.3s ease 0s, border-color 0.3s ease 0s;
    padding: 8px 30px;

    &:hover {
        background-color: #dcdcdc;
    }
}

.filter {
    display: flex;
    padding: 20px;
    flex-wrap: wrap;
    justify-content: flex-end;

    &__item {
        margin-bottom: 8px;
        width: 145px;

        &:not(:first-child) {
            margin-left: 15px;
        }
    }

    &__select,
    &__input {
        min-width: 200px;
    }

    &__button {
        font-weight: bold;
    }
}

.brands {
    display: block;
    margin: 8px 0;

    &__content {
        border-radius: 8px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.16);
        background-color: #fff;
    }

    &__list {
        display: flex;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        padding: 15px;
        margin-bottom: 15px;
    }

    &__title {
        display:flex;
        justify-content: center;
        flex-shrink:0;
        font-size: 70px;
        line-height: 85%;
        color: #5cbf1a;
        width: 10%;
    }

    //&__column {
    //    width: calc((100% - 16px) / 3);
    //    padding-right: 20px;
    //}
    &__items {
        display: flex;
        flex-grow:1;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    &__item {
        width: calc(100% / 3);
        line-height: 26px;
        font-size: 17px;
        text-decoration: none;
    }
    &__country {
        color: #9fa3a7;
        margin-left: 10px;
    }
}

@media (max-width: 600px) {
    .brands {
        &__item {
            width: 50%;
        }
        &__title {
            width: 15%;
            font-size: 60px;
        }
    }

}

@media (max-width: 420px) {
    .filter {
        &__item {
            margin-top: 15px;

        }
    }
}
@media (max-width: 400px) {
    .brands {
        &__item {
            width: 100%;
        }
        &__title {
            width: 23%;
            font-size: 50px;
        }
    }
}

</style>
