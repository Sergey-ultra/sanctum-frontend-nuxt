<template>
    <my-published
        @showEditForm="showEditForm"
        @showDeleteForm="showDeleteForm"
    >
        <template v-slot:status v-if="item.status && ['moderated', 'rejected'].includes(item.status)">
            <div
                v-if="item.status === 'moderated'"
                class="status status-moderated"
            >
                <span class="status__icon">
                    <svg><use xlink:href="#icons_question-circle">
                        <symbol viewBox="0 0 24 24" id="icons_question-circle">
                            <path fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1m0 1.75c5.1 0 9.25 4.15 9.25 9.25S17.1 21.25 12 21.25 2.75 17.1 2.75 12 6.9 2.75 12 2.75zm-1.5 13.293c0 .718.479 1.162 1.244 1.162.766 0 1.237-.444 1.237-1.162 0-.725-.471-1.169-1.237-1.169-.765 0-1.244.444-1.244 1.169zm1.456-8.996c-2.099 0-3.288 1.176-3.322 2.878h1.852c.041-.752.561-1.237 1.347-1.237.779 0 1.299.451 1.299 1.086 0 .636-.267.964-1.149 1.491-.943.553-1.319 1.169-1.23 2.262l.014.376h1.811v-.362c0-.656.253-.991 1.162-1.518.964-.567 1.463-1.285 1.463-2.31 0-1.579-1.292-2.666-3.247-2.666z"></path>
                        </symbol>
                    </use></svg>
                </span>
                <span>Ожидает публикации</span>
            </div>
            <div
                v-else-if="item.status === 'rejected'"
                class="status status-rejected"
            >
                <span>Не опубликовано</span>
            </div>
        </template>

        <template v-slot:title>
            <nuxt-link
                :to="`/product/${productCode}`"
                class="element__sku"
            >
                <div class="element__img">
                    <img :src="item.sku_image" :alt="item.sku_image"/>
                </div>
                <div class="element__sku-name">{{ item.sku_name }}, {{ item.volume }}</div>
            </nuxt-link>
        </template>

        <div class="element__title">
            <div class="element__avatar element__avatar-is-right">
                <div class="element__avatar-img">
                    <img :src="`${$config.APP_URL}/${item.user_avatar}`" alt="avatar"/>
                </div>
            </div>
            <div>
                <span class="element__user">{{ item.user_name }}</span>
                <span class="element__date">{{ item.created_at }}</span>
            </div>
        </div>

        <div class="video__description">{{ item.description }}</div>

        <div class="video__video">
            <div class="video__thumbnail" :style="`background-image: url(${$config.APP_URL}/${item.thumbnail})`"></div>
            <button type="button" class="large-play-button">
                <svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">
                    <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                </svg>
            </button>
        </div>

        <div
            class="element"
            :class="{'element-filter': item.status === 'moderated'}"
        >



        </div>
        <div class="element__bottom" v-if="item.status === 'rejected'">
            <h3>Причина отклонения</h3>
            <div class="element__text">Ваш видео не соответствует требованиям к публикациям.</div>
            <nuxt-link
                class="element__action"
                :to="`/product/${productCode}/add-review`"
            >
                <span>Редактировать</span>
            </nuxt-link>
        </div>



    </my-published>

    <delete-form
        :selectedName="`Видео на ${video.sku_name}`"
        v-if="isShowDeleteForm"
        v-model:isShowDeleteForm="isShowDeleteForm"
        @delete="deleteCurrent"
    />
</template>

<script setup>
    import deleteForm from '../delete-form'
    import myPublished from "./my-published";

    const emit = defineEmits(['deleteItem']);
    const props = defineProps({
        item: {
            type: Object
        }
    });

    const isShowDeleteForm = ref(false);

    const productCode = computed(() =>  props.item.product_code + '-' + props.item.sku_id);

    const showDeleteForm = () => isShowDeleteForm.value = true;

    const deleteCurrent = () => {
        emit('deleteItem');
        isShowDeleteForm.value = false;
    };

    const showEditForm = () => {
        navigateTo({ name: 'product-product_code-add-review', params: { product_code:productCode.value }})
    };
</script>

<style lang="scss" scoped>
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
    .element {
        color: #222;
        &__sku {
            display: flex;
            align-items: center;
            letter-spacing: .1px;
            min-height: 40px;
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
        &__title {
            display: flex;
            align-items: center;
        }
        &__avatar {
            position: absolute;
            transform: translateX(-100%);
            display: inline-block;
            vertical-align: top;
            width: 48px;
            &-is-right {
                position: static;
                transform: translateX(0);
            }
            &-img {
                overflow: hidden;
                border-radius: 50%;
                height: 36px;
                width: 36px;
                & img {
                    object-fit: cover;
                    width: 100%;
                    height:100%;
                }
            }
        }
        &__user {
            font-weight: 700;
        }

        &__date {
            font-size: 16px;
            color: #878787;
            margin-left: 10px;
        }
    }

    .video {
        &__description {
            margin-top: 12px;
            font-weight: 700;
            font-style: normal;
            font-stretch: normal;
            font-size: 16px;
            line-height: 20px;
            margin-bottom: 12px;
        }
        &__video {
            height: 324px;
            margin: 28px auto 0 auto;
            width: 100%;
            position: relative;
            background-size: auto 100%;
            background-position: 50%;
            background-repeat: no-repeat;
            background-color: #000;
            & .large-play-button {
                cursor: pointer;
                position: absolute;
                left: 50%;
                top: 50%;
                width: 68px;
                height: 68px;
                transform: translate(-50%, -50%);
                transition: opacity .25s cubic-bezier(0,0,0.2,1);
                z-index: 63;
            }
        }

        &__thumbnail {
            background-size: cover;
            left: 0;
            right: 0;
            top:0;
            bottom:0;
            position: absolute;
            z-index: 60;
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
    @media (max-width: 700px) {
        .element {
            &__avatar {
                position: static;
                transform: translateX(0);
            }
        }
    }
</style>
