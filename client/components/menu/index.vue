<template>
    <nav class="menu" :class="{ 'active': isShowMobileMenu }">
        <div class="container">
            <div class="menu__layer" ref="menuLayer"></div>
            <div class="menu__wrapper" ref="menuWrapper">
                <div class="menu__mobile">
                    <div class="menu__mobile-top">
                        <button class="close__mobile-menu" @click="closeMobileMenuInternal">
                            <svg  width="24" height="24" viewBox="0 0 24 24">
                                <path d="M12.0020447,10.5878311 L18.0040894,4.58578644 L19.4183029,6 L13.4162582,12.0020447 L19.4142136,18 L18,19.4142136 L12.0020447,13.4162582 L6,19.4183029 L4.58578644,18.0040894 L10.5878311,12.0020447 L4.58578644,6 L6,4.58578644 L12.0020447,10.5878311 Z"></path>
                            </svg>
                        </button>
                    </div>
                </div>


                <ul class="menu__list">
                    <li class="menu__item menu__item-catalog"
                        @mouseenter="isShowMainCatalog = true"
                        @mouseleave="isShowMainCatalog = false"
                        :class="{'catalog-active': isShowMainCatalog}">
                        <span class="menu__link">Каталог</span>
                        <div class="link__items">
                            <div v-for="category in allCategories" class="link__item">
                                <nuxt-link
                                    :to="`/category/${category.code}`"
                                    @click="isShowMainCatalog = false"
                                    class="link__link"
                                >
                                    {{ category.name }}
                                </nuxt-link>
                                <div v-if="category.children" class="link__subLinks">
                                    <li
                                        v-for="subCategory in category.children"
                                        :key="subCategory.code"
                                        class="link__item">
                                        <nuxt-link
                                            :to="`/category/${subCategory.code}`"
                                            @click="isShowMainCatalog = false"
                                            class="link__link"
                                        >
                                            {{ subCategory.name }}
                                        </nuxt-link>
                                    </li>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li
                        class="menu__item"
                        v-for="(menuItem, index) in menu"
                        :key="index"
                    >
                        <nuxt-link
                            :to="menuItem.url"
                            class="menu__link"
                        >
                            {{ menuItem.title }}
                        </nuxt-link>
                    </li>
                </ul>

                <ul class="menu__list-mobile">
                    <li class="menu__item menu__item-padding" v-if="$api.isAuth.value" @click="closeMobileMenuInternal">
                        <nuxt-link :to="'/edit-profile'">
                            <img class="avatar" v-if="$api.$user.avatar"
                                 :src="`${$config.APP_URL}/${$api.$user.avatar}`" :alt="$api.$user.avatar"/>
                            <img class="avatar" v-else :src="`${$config.APP_URL}/storage/icons/user_avatar.png`"
                                 alt="avatar"/>
                            <span>{{ $api.$user.name }}</span>
                        </nuxt-link>
                    </li>
                    <li class="menu__item" v-if="$api.isAuth.value" @click="closeMobileMenuInternal">
                        <nuxt-link :to="'/write'">
                            <svg class="menu__item-icon" height="24" width="24" viewBox="0 0 24 24">
                                <path
                                        d="M4.4 23h12.2a1.4 1.4 0 0 0 1.4-1.4V19h2.6a1.4 1.4 0 0 0 1.4-1.4V2.4A1.4 1.4 0 0 0 20.6 1H8.4A1.4 1.4 0 0 0 7 2.4V5H4.4A1.4 1.4 0 0 0 3 6.4v15.2A1.4 1.4 0 0 0 4.4 23zM5 7h11v14H5V7zm4-4h11v14h-2V6.4A1.4 1.4 0 0 0 16.6 5H9V3z"></path>
                                <path d="M14 9H7v2h7V9zM14 13H7v2h7v-2z"></path>
                            </svg>
                            <span>Написать</span>
                        </nuxt-link>
                    </li>
                    <li class="menu__item" v-if="$api.isAuth.value" @click="closeMobileMenuInternal">
                        <nuxt-link :to="'/profile/my-reviews'">
                            <svg class="menu__item-icon" height="24" width="24" viewBox="0 0 24 24">
                                <path
                                    d="M4.4 23h12.2a1.4 1.4 0 0 0 1.4-1.4V19h2.6a1.4 1.4 0 0 0 1.4-1.4V2.4A1.4 1.4 0 0 0 20.6 1H8.4A1.4 1.4 0 0 0 7 2.4V5H4.4A1.4 1.4 0 0 0 3 6.4v15.2A1.4 1.4 0 0 0 4.4 23zM5 7h11v14H5V7zm4-4h11v14h-2V6.4A1.4 1.4 0 0 0 16.6 5H9V3z"></path>
                                <path d="M14 9H7v2h7V9zM14 13H7v2h7v-2z"></path>
                            </svg>
                            <span>Мои отзывы</span>
                        </nuxt-link>
                    </li>
                    <li class="menu__item" v-if="$api.isAuth.value" @click="closeMobileMenuInternal">
                        <nuxt-link :to="'/profile/my-comments'">
                            <svg class="menu__item-icon" height="24" width="24" viewBox="0 0 24 24">
                                <path
                                    d="M4.4 23h12.2a1.4 1.4 0 0 0 1.4-1.4V19h2.6a1.4 1.4 0 0 0 1.4-1.4V2.4A1.4 1.4 0 0 0 20.6 1H8.4A1.4 1.4 0 0 0 7 2.4V5H4.4A1.4 1.4 0 0 0 3 6.4v15.2A1.4 1.4 0 0 0 4.4 23zM5 7h11v14H5V7zm4-4h11v14h-2V6.4A1.4 1.4 0 0 0 16.6 5H9V3z"></path>
                                <path d="M14 9H7v2h7V9zM14 13H7v2h7v-2z"></path>
                            </svg>
                            <span>Мои публикации</span>
                        </nuxt-link>
                    </li>
                    <li class="menu__item" v-if="$api.isAuth.value" @click="closeMobileMenuInternal">
                        <nuxt-link :to="{name: 'profile-index-message'}">
                            <fa class="menu__item-icon"  icon="envelope"></fa>
                            <span>Сообщения</span>
                            <span class="menu__item-count" v-if="$api.$user.unviewed_message_count">
                                {{ $api.$user.unviewed_message_count }}
                            </span>
                        </nuxt-link>
                    </li>
                    <li class="menu__item" v-if="$api.isAuth.value" @click="closeMobileMenuInternal">
                        <nuxt-link :to="'/favorites'">
                            <svg class="menu__item-icon" height="24" width="24" viewBox="0 0 24 24">
                                <path
                                        d="M12 4.367C10.675 3.28 9.245 2.72 7.73 2.72A5.73 5.73 0 0 0 2 8.45c0 4.329 3.197 8.531 9.448 12.664l.552.365.551-.365C18.803 16.981 22 12.778 22 8.45a5.73 5.73 0 0 0-5.73-5.73c-1.515 0-2.945.56-4.27 1.648zM4 8.449a3.73 3.73 0 0 1 3.73-3.73c1.223 0 2.402.551 3.566 1.705l.704.698.704-.698c1.164-1.154 2.343-1.704 3.567-1.704A3.73 3.73 0 0 1 20 8.45c0 3.397-2.623 6.956-8 10.626-5.377-3.67-8-7.23-8-10.627z"></path>
                            </svg>
                            <span>Избранное</span>
                            <span class="menu__item-count" v-if="favorites.length"> {{ favorites.length }}</span>
                        </nuxt-link>
                    </li>
                    <li class="menu__item" v-if="$api.isAuth.value" @click="closeMobileMenuInternal">
                        <nuxt-link :to="{name: 'profile-index-balance'}">
                            <svg class="menu__item-icon" height="24" width="24" viewBox="0 0 50 50">
                                <path d="M33.6,9.2l3.6-6.5c0.3-0.5,0.4-1.2,0.1-1.7C36.9,0.3,36.4,0,35.7,0H13.1c-0.6,0-1.2,0.4-1.5,0.9
                                        c-0.3,0.6-0.2,1.3,0.2,1.8l4.6,6.5C12.7,12.7,2.1,24.1,2.1,39.5C2.1,45.3,6.8,50,12.6,50h24.8c5.8,0,10.5-4.7,10.5-10.5
                                        C47.9,23.9,37.2,12.5,33.6,9.2z M35.4,29.2c-0.6,1.1-1.4,1.9-2.3,2.5c-0.9,0.6-2,1-3.3,1.3c-1.2,0.2-2.4,0.4-3.9,0.4H21v4h10.1v2.8
                                        H21v3.1h-3.8v-3h-2v-2.8h2v-4h-2v-3.4h2V17.7h8.9c2.5,0,4.5,0.3,5.8,0.8c1.3,0.5,2.4,1.4,3.2,2.7c0.8,1.3,1.2,2.7,1.3,4.3
                                        C36.3,26.9,36,28.2,35.4,29.2z"/>
                                <path d="M30.6,22c-0.5-0.4-1.1-0.6-2-0.8c-0.8-0.1-1.5-0.2-2.3-0.2h-5.2v9.3h4.8c0.9,0,1.7-0.1,2.5-0.2
		                                c0.8-0.2,1.5-0.4,2-0.8c0.6-0.3,1-0.8,1.4-1.4l0,0c0.4-0.7,0.5-1.3,0.5-2.2c0-0.8-0.2-1.5-0.5-2.2C31.5,22.8,31.1,22.3,30.6,22z"/></svg>
                            <span>Баланс</span>
                        </nuxt-link>
                    </li>


                    <li class="menu__auth" v-if="!$api.isAuth.value">
                        <div class="menu__auth-title">Войти в свой аккаунт</div>
                        <div class="menu__auth-description">Вы можете оставлять отзывы о товарах, сохранять товары и
                            отслеживать их цены
                        </div>
                        <button class="menu__auth-button" @click="$api.setIsShowAuthModal(true)">Войти</button>
                    </li>

                    <li class="menu__item" @click="closeMobileMenuInternal">
                        <nuxt-link :to="'/comparison'">
                            <svg class="menu__item-icon" height="24" width="24" viewBox="0 0 24 24">
                                <path
                                    d="M3 7V4h2v3l3 .001v2H5V12H3V9H0V7h3zm5 6.004v-2h13v2H8zM10 7v2h11V7H10zM3 17.002v-2h18v2H3zM3 19v2h18v-2H3z"></path>
                            </svg>
                            <span>Списки сравнения</span>
                            <span class="menu__item-count" v-if="allComparedSkuIdsCount">
                                {{ allComparedSkuIdsCount }}
                            </span>
                        </nuxt-link>
                    </li>
                    <li class="menu__item" @click="toggleShowCatalog">
                        <div class="menu__item-text">
                            <fa class="menu__item-icon"  icon="envelope"></fa>
                            Каталог
                        </div>
                    </li>
                    <div v-if="isShowCatalog">
                        <li
                            v-for="(menuItem, index) in menu"
                            :key="index"
                            class="menu__item"
                            @click="closeMobileMenuInternal"
                        >
                            <nuxt-link :to="menuItem.url">
                                <svg class="menu__item-icon" width="24" height="24" viewBox="0 0 24 24">
                                    <path
                                        d="M17,10 L17,19 L12,19 L12,14 C12,12.8954305 11.1045695,12 10,12 C8.8954305,12 8,12.8954305 8,14 L8,19 L3,19 L3,10 L0,10 L10,0 L20,10 L17,10 Z"
                                        transform="translate(2 2)"></path>
                                </svg>
                                {{ menuItem.title }}
                            </nuxt-link>
                        </li>
                    </div>
                    <li class="menu__item">
                        <nuxt-link :to="'/article'">
                            <svg class="menu__item-icon" width="24" height="24" viewBox="0 0 24 24">
                                <path
                                    d="M17,10 L17,19 L12,19 L12,14 C12,12.8954305 11.1045695,12 10,12 C8.8954305,12 8,12.8954305 8,14 L8,19 L3,19 L3,10 L0,10 L10,0 L20,10 L17,10 Z"
                                    transform="translate(2 2)"></path>
                            </svg>
                            Блоги
                        </nuxt-link>
                    </li>
                    <li class="menu__item">
                        <nuxt-link :to="'/brand'">
                            <svg class="menu__item-icon" width="24" height="24" viewBox="0 0 24 24">
                                <path
                                    d="M17,10 L17,19 L12,19 L12,14 C12,12.8954305 11.1045695,12 10,12 C8.8954305,12 8,12.8954305 8,14 L8,19 L3,19 L3,10 L0,10 L10,0 L20,10 L17,10 Z"
                                    transform="translate(2 2)"></path>
                            </svg>
                            Бренды
                        </nuxt-link>
                    </li>
                    <li class="menu__item" @click="exit" v-if="$api.isAuth.value">
                        <svg class="menu__item-icon" width="24" height="24" viewBox="0 0 24 24">
                            <path
                                d="M7 11h8.987v2H7v2.964l-4-4 4-4V11zm2-6V3h7a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H9v-2h7a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H9z"
                                fill="#222"></path>
                        </svg>
                        <span>Выйти</span>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
    import dropdown from '~/components/dropdown';
    import { storeToRefs } from "pinia";
    import { useFavoritesStore } from "~/store/favorites";
    import { useComparisonStore } from "~/store/comparison";
    import { useNuxtApp } from '#app';
    import { useCategoryStore } from "~/store/category";
    const { $api } = useNuxtApp();

    const favoritesStore = useFavoritesStore();
    const comparisonStore = useComparisonStore();
    const categoryStore = useCategoryStore();


    const { favorites } = storeToRefs(favoritesStore);
    const { allComparedSkuIdsCount } = storeToRefs(comparisonStore);
    const { allCategories } = storeToRefs(categoryStore);

    const menu = [
        {title: 'Сыворотки', url: '/category/serums'},
        {title: 'Увлажняющие кремы', url: '/category/cream'},
        {title: 'Масла', url: '/category/oil'},
        {title: 'Тоники', url: '/category/tonic'},
        {title: 'Пилинг', url: '/category/pilling'},
        {title: 'Скраб', url:'/category/scrab'},
        {title: 'Средства для умывания', url: '/category/umjivanie'},
        {title: 'Маски', url: '/category/maski'},
    ];

    const fullMenu = menu.concat([
        {title: 'Бренды', url: '/brands'},
        {title: 'Блог', url: '/article'},
    ])

    const emit = defineEmits(['update:isShowMobileMenu']);
    const props = defineProps({
        isShowMobileMenu: {
            type: Boolean,
            default: false
        }
    });

    const menuLayer = ref(null);
    const menuWrapper = ref(null);
    const isShowMainCatalog = ref(false);
    const isShowCatalog = ref(false);


    watch(() => props.isShowMobileMenu, (value) => {
        if (value){
            menuLayer.value.addEventListener('click', closeMobileMenu, { capture: true });
            document.body.style.overflow = "hidden";
        } else {
            menuLayer.value.removeEventListener('click', closeMobileMenu, { capture: true });
            document.body.style.overflow = "";
        }
    });

    watch(
        $api.isAuth,
        (value, oldValue) => {
            if (value === true && oldValue === false) {
                closeMobileMenuInternal();
            }
        }
    );

    const toggleShowCatalog = () => isShowCatalog.value = !isShowCatalog.value;

    const closeMobileMenu = event => {
        if (!menuWrapper.value.contains(event.target)) {
            emit('update:isShowMobileMenu', false);
            document.removeEventListener('click', closeMobileMenu, {capture: true});
        }
    };

    const closeMobileMenuInternal = () => {
        emit('update:isShowMobileMenu', false);
    };

    const exit = () => {
        emit('update:isShowMobileMenu' , false);
        $api.logout();
    };

    useAsyncData(async() => {
        categoryStore.loadAllCategories();
    });
</script>

<style lang="scss" scoped>
    .catalog-active .link__items {
        display: block;
    }
    .link {
        &__items {
            display: none;
            position: absolute;
            z-index: 1099;
            background-color: #fff;
            background-clip: padding-box;
            border-radius: 8px;
            box-shadow: 0 5px 46px rgba(0, 0, 0, 0.12), 0 7px 15px rgba(0, 0, 0, 0.12);
        }
        &__item {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;

            min-height: 40px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            line-height: 1.5;
            letter-spacing: 0;
            color: #333;
            font-weight: 400;
            white-space: nowrap;
            box-sizing: border-box;
            text-decoration: none;



            &:hover {
                background-color: #f5f5f5;
                & .link__subLinks {
                    display: block;
                }
            }
        }
        &__link {
            padding: 2px 50px 2px 15px;
            color: #333;
            display:flex;
            align-items: center;
            width: 100%;
            height: 100%;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            transition: color .2s ease-out;

            &:hover {
                color: #46bd87;
            }
        }
        &__catalog {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
        }
        &__subLinks {
            display: none;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 5px 46px rgba(0, 0, 0, 0.12), 0 7px 15px rgba(0, 0, 0, 0.12);
            position: absolute;
            left: 100%;
            top:0;
        }
    }
    .menu {
        background-color: #fff;
        border-bottom: 1px solid #ccc;
        height:36px;
        &__wrapper {
            height: 100%;
            background-color: #fff;
        }
        &__mobile {
            display: none;
        }
        &__list {
            background: #fff;
            list-style:none;
            display:flex;
            align-items: center;
            gap:  40px;
            margin: 0 auto;
            width: auto;
            height:100%;

            &-mobile {
                display:none;
            }
        }
        &__item {
            font-size: 16px;
            font-weight: 600;
            transition: color .2s ease-out;
            cursor: pointer;
            &-catalog {
                position: relative;
            }

        }
        &__link {
            display:flex;
            align-items: center;
            color: #333;
            height: 100%;
            &:hover {
                color: #46bd87;
            }
        }
    }
    ul {
        padding: 0;
    }

    @media (max-width: 900px) {
        .avatar {
            overflow: hidden;
            border-radius: 50%;
            height: 36px;
            width: 36px;
            margin: 0 12px 0 20px;
        }

        .menu {
            border: none;
            height: 0;
            position: relative;

            &__auth {
                &-title {
                    line-height: 1.5;
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 12px;
                    font-family: "Work Sans", sans-serif;
                    letter-spacing: 0;
                }
                &-description {
                    font-size: 14px;
                    margin-bottom: 12px;
                }
                &-button {
                    margin-bottom: 12px;
                    width: auto;
                    display: block;
                    color: #333;
                    position: relative;
                    padding: .5rem 2rem;
                    border-radius: .5rem;
                    border: none;
                    cursor: pointer;
                    background-image: linear-gradient(to bottom, #ffd6e7, #f88cb6);
                    transition: all .12s ease-out;

                    &:hover {
                        background-color: #dcdcdc;
                    }
                }
            }
            &__list {
                display: none;
                &-mobile {
                    background: #fff;
                    list-style:none;
                    display:flex;
                    overflow-x: hidden;
                    overflow-y: auto;
                    margin: 0 auto;
                    width: auto;
                    height: calc(100% - 40px);
                    padding: 12px;
                    flex-direction: column;
                }
            }
            &__item {
                border-radius: 8px;
                width: 100%;
                cursor: pointer;
                min-height: 40px;
                display: flex;
                align-items: center;
                &-padding {
                    padding: 16px 0 16px 0;
                }
                &:hover {
                    background-color: #f5f5f5;
                }
                &-icon {
                    height: 24px;
                    width: 24px;
                    margin: 0 12px 0 20px;
                }
                &-count {
                    color: #999;
                    display: inline-block;
                    margin-left: 10px;
                }
                &-text, a {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    font-family: "Work Sans",sans-serif;
                    font-size: 16px;
                    line-height: 1.5;
                    letter-spacing: 0;
                    color: #333;
                    font-weight: 400;
                    box-sizing: border-box;
                    text-decoration: none;
                }
            }
            & .menu__wrapper {
                height: 100%;
                width: 80%;
                z-index: 101;
                position: fixed;
                top: 0;
                left: 0;
                transition: .3s ease-in;
                transform: translateX(-100%);
            }
            .close__mobile-menu {
                display: flex;
                align-items: center;
                border: 0;
                height: 24px;
                padding: 0;
                background: 0 0;
                margin-left: auto;
            }
            &.active .menu__mobile {
                display:block;
                background-color: #fff;
                padding: 16px 12px 0 12px;
                width: auto;
                border-bottom: none;
                box-sizing: border-box;
                &-top {
                    max-height: 48px;
                    display: flex;
                    align-items: center;
                }
            }
            &.active .menu__wrapper {
                transform: translateX(0);
            }
            &__layer {
                background-color: rgba(33, 33, 33, 0);
                z-index: -2;
                position: fixed;
            }
            &.active .menu__layer {
                background-color: rgba(33, 33, 33, 0.46);
                display: block;
                position: fixed;
                top: 0;
                left: 0;
                z-index: 100;
                width: 100%;
                height: 100vh;
                overflow: hidden;
                outline: 0;
            }
        }
    }
</style>
