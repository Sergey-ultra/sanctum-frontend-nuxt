<template>
    <div class="review">
        <div class="review__wrapper">
            <div class="review__date">
                {{ item.created_at }}
            </div>
            <nuxt-link
                :to="`/review/${item.id}`"
                class="review__name"
            >
                <div class="review__img">
                    <img :src="item.sku.image" :alt="item.sku.name"/>
                </div>
                <div class="review__sku">{{ item.sku.name }}, {{ item.sku.volume }}</div>
            </nuxt-link>
            <div class="review__status">
                {{ getStatusText(item.status) }}
            </div>
            <div class="review__viewsCount">
                {{ item.views_count }}
            </div>
            <div class="review__balance">
                {{ item.balance }}
            </div>
            <div class="review__likes">
                {{ item.likes_count }}
            </div>

            <div class="review__dropdown">
                <drop-menu :items="['edit', 'delete']">
                    <template v-slot:edit>
                        <div class="dropdown__inner">
                            <button class="dropdown__value" @click="$emit('showEditForm')">
                                    <span class="dropdown__icon">
                                        <svg>
                                            <use xlink:href="#icons_edit">
                                                 <symbol viewBox="0 0 24 24" id="icons_edit">
                                                    <path fill-rule="evenodd"
                                                          d="M18 2l4 4-2 1.999L16 4l2-2zM3 17L14.655 5.343l4 4.001L7.001 21 2 22l1-5z"></path>
                                                </symbol>
                                            </use>
                                        </svg>
                                    </span>
                                <span>Изменить</span>
                            </button>
                        </div>
                    </template>
                    <template v-slot:delete>
                        <div class="dropdown__inner">
                            <button class="dropdown__value" @click="$emit('showDeleteForm')">
                                    <span class="dropdown__icon">
                                        <svg>
                                            <use xlink:href="#icons_cross">
                                                <symbol viewBox="0 0 24 24" id="icons_cross">
                                                    <path fill-rule="evenodd"  d="M18.997 6.417l-1.414-1.414L12 10.586 6.417 5.003 5.003 6.417 10.586 12l-5.583 5.583 1.414 1.414L12 13.414l5.583 5.583 1.414-1.414L13.414 12z"></path>
                                                </symbol>
                                            </use>
                                        </svg>
                                    </span>
                                <span>Удалить</span>
                            </button>
                        </div>
                    </template>
                </drop-menu>
            </div>
        </div>


        <div class="review__filter" :class="{'review-filter': item.status === 'moderated'}">

        </div>
        <div class="review__bottom" v-if="item.status === 'rejected'">
            <h3>Причина отклонения</h3>
            <div class="review__text">Ваш отзыв не соответствует требованиям к публикациям.</div>
            <nuxt-link
                class="review__action"
                :to="`/product/${productCode}/add-review`"
            >
                <span>Редактировать отзыв</span>
            </nuxt-link>
        </div>
        <delete-form
            :selectedName="`Отзыв на ${item.sku.name}`"
            v-if="isShowDeleteForm"
            v-model:isShowDeleteForm="isShowDeleteForm"
            @delete="deleteCurrentReview"
        />
    </div>
</template>

<script setup>
import deleteForm from '../delete-form';
import dropMenu from '~/components/drop-menu';
import getStatusText from "~/utils/getStatusText";

import {useReviewStore} from "~/store/review";

const reviewStore = useReviewStore();


const isShowDeleteForm = ref(false);

const props = defineProps({
    item: {
        type: Object
    }
});

const productCode = computed(() =>  props.item.sku.product_code + '-' + props.item.sku.id);

const showDeleteForm = () => isShowDeleteForm.value = true;
const deleteCurrentReview = () => {
    if (props.item.sku_rating_id) {
        reviewStore.deleteReview(this.props.item.sku_rating_id);
    }
    isShowDeleteForm.value = false;
};

const showEditForm = () => {
    navigateTo({ name: 'product-product_code-add-review', params: { product_code: productCode.value }})
};
</script>

<style scoped lang="scss">
a {
    text-decoration: none;
}
.status {
    margin: -16px -16px 16px;
    padding: 14px 16px 14px 20px;
    font-size: 15px;
    line-height: 18px;
    &__icon svg{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 20px;
        height: 20px;
    }
    &-moderated {
        background-color: #fff8d9;
        & .status__icon {
            display: inline;
            color: #ffa300;
            margin: 8px;
            position: relative;
            & svg {
                fill: #ffa300 !important;
            }

        }
        & span {
            display: inline;
            margin: 8px;
            color: #ffa300;
        }
    }
    &-rejected {
        background-color: #ffe1e1;
        & span {
            display: inline;
            color: #c70000;
            margin: 8px;
        }
    }
}
.review {
    background-color: #fff;
    width: 100%;
    padding: 15px;
    border-bottom: 1px solid #e8e8e8;
    &__wrapper {
        display: flex;
        align-items: center;
    }
    &__date {
        width: 10%;
    }
    &__name {
        width: 35%;
        display: flex;
        align-items: center;
        letter-spacing: .1px;
        min-height: 40px;
    }
    &__status {
        width: 15%;
    }
    &__viewsCount,
    &__balance,
    &__bonus,
    &__likes {
        width: 10%;
    }
    &__filter {
        color: #222;
    }
    &__img {
        margin-right: 5px;
        width: 40px;
        height: 40px;
        & img {
            object-fit: cover;
            width: 100%;
            height: 100%;
        }
    }

    &-filter {
        filter: grayscale(100%);
        color: #999;
    }


    &__bottom {
        margin-top: 20px;
        border-top: 1px solid #e8e8e8;
        padding-top: 20px;
    }
    &__text {
        margin-bottom: 16px;
        word-break: break-word;
    }
    &__dropdown {
        margin-left: auto;
    }
    &__action {
        border: 0;
        border-radius: 4px;
        position: relative;
        width: 100%;
        line-height: 36px;
        height: 36px;
        padding: 0 16px;
        transition: all .12s ease-out;
        background-color: #fc0;
        display: inline-block;
        color: inherit;
        text-decoration: inherit;
        text-align: center;
        cursor: pointer;
        &:hover {
            background-color: #f5c423;
        }
        & span {
            text-align: center;
            vertical-align: middle;
            line-height: 20px;
        }
    }
}
.dropdown {
    margin: -5px 5px -5px auto;
    &__inner {
        font-size: 14px;
        line-height: 16px;
    }
    &__value {
        display: flex;
        align-items: center;
        margin: 0;
        border: none;
        outline: none;
        outline-offset: 2px;
        background: transparent;
        width: 100%;
        padding: 0 12px 0 16px;
        color: #222;
        cursor: pointer;
        user-select: none;
        text-align: left;
        &:hover .span {
            color: #c70000;
        }
        & span {
            font-style: normal;
            font-stretch: normal;
            line-height: 36px;
            white-space: nowrap;
        }
    }
    &__icon {
        display: inline-block;
        position: relative;
        width: 32px;
        height: 32px;
        & svg {
            fill: rgba(0,0,0,.4);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            width: 20px;
            height: 20px;
        }
    }
}

.icon {
    vertical-align: middle;
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-left: -12px;
    &-inner {
        display: inline-block;
        position: relative;
        width: 32px;
        height: 32px;
        & svg {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            width: 20px;
            height: 20px;
        }
    }
}
</style>
