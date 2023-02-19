<template>
    <div class="mini-suggest" v-show="isShow && (skus.length + categories.length > 2)" ref="suggestBox">
        <ul class="mini-suggest__content">
            <li
                v-for="(category, index) in categories"
                :key="index"
                class="mini-suggest__item"
            >
                <nuxt-link :to="category.url + `?search=${category.name}`" class="mini-suggest__link">
                    {{ category.name }}
                </nuxt-link>
            </li>
            <li class="mini-suggest__divider "></li>
            <li
                v-for="(sku, index) in skus"
                :key="index"
                class="mini-suggest__item"
            >
                <nuxt-link :to="sku.url + `?search=${sku.name}`" class="mini-suggest__link">
                    <div class="mini-suggest__img" :style="`background-image: url(${$config.APP_URL}/${sku.image})`">

                    </div>
                    <div class="mini-suggest__text">
                        <span class="mini-suggest__title">{{`${sku.name} ${sku.volume}`}}</span>
                        <div class="mini-suggest__info">От {{sku.min_price}} ₽</div>
                    </div>
                </nuxt-link>
            </li>
        </ul>
    </div>
</template>

<script setup>
    import {useSuggestStore} from '../store/suggest';
    import {storeToRefs} from "pinia";

    const suggestStore = useSuggestStore();
    const {skus, categories, isLoadingSuggests} = storeToRefs(suggestStore);

    const emit = defineEmits(['update:isShow']);
    const props = defineProps({
        isShow: Boolean
    });


    const suggestBox = ref(null);

    const outsideClick = event => {
        if (!suggestBox.value.contains(event.target)) {
            event.stopPropagation();
        }
        emit('update:isShow', false);
    };

    watch(
        () => props.isShow,
        value => {
            if (value) {
                document.addEventListener('click', outsideClick, { capture: true, once: true});
            } else {
                suggestStore.setSuggestsToDefault();
            }
        }
    )

</script>

<style lang="scss" scoped>
.mini-suggest {
    color: #000;
    left: 0;
    background-color: #fff;
    position: absolute;
    top: 100%;
    user-select: none;
    margin-top: 4px;
    width: 100%;
    overflow: hidden;
    border-radius:8px;
    &__content {
        padding: 3px 0;
        display: block;
        list-style: none;
        margin: 0;
        width:100%;
    }
    &__divider {
        background: #e9e9e9;
        height: 1px;
        margin: 0 16px;
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