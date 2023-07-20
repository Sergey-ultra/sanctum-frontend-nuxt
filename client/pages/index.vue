<template>
    <div class="main">
        <div class="main__row">
            <nuxt-link
                    class="main__row-item"
                    v-for="category in categories"
                    :key="category.id"
                    :to="`category/${category.code}`"
            >
                <img :src="`${$config.APP_URL}/${category.image}`" :alt="category.image"/>
                <div class="subtitle">{{ category.name }}</div>
            </nuxt-link>
        </div>
        <div class="main__row">
            <last-reviews class="main__left"/>
            <bestUsers class="main__right" />
        </div>
        <div class="main__row">
            <journal></journal>
        </div>
        <div class="main__row">
            <div class="main__wrapper">
                <h3>Отзывы о товарах красоты и здоровья!</h3>
                <b>Smart-Beautiful – самый информативный форум отзывов о косметики,</b> где миллионы реальных покупателей обмениваются полезным опытом о товарах крсоты и здоровья, делятся фото и видео, ставят оценки, создают рейтинги лучших, изучают инструкции по применению и предлагают аналоги, раздают лайфхаки и хитрости, советуют что посмотреть и где выгоднее купить, а также предупреждают о недостатках и проблемах. Присоединяйтесь!

                <h3>Как писать хорошие отзывы?</h3>
                Отзыв должен быть полезен читателю. Если в отзыве нет никакой полезной информации, то и тратить время на него нет смысла. Вы должны обладать достаточными знаниями и личным опытом, чтобы указать читателю на все достоинства и недостатки объекта своего отзыва. В этом случае, люди будут благодарны Вам за ценную информацию, что положительно отразится на его релевантности относительно других отзывов.
            </div>
        </div>
        <div class="main__row">
            <div class="main__wrapper">
                <div class="main__row bold">
                    <div>
                        Авторов сейчас на сайте
                        <div class="count">{{ userCount }}</div>
                    </div>
                    <div>
                        Всего отзывов
                        <div class="count">{{ reviewCount }}</div>
                    </div>
                    <div>
                        Всего комментариев
                        <div class="count">{{ commentCount}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import lastReviews from '~/components/last-reviews';
    import bestUsers from '~/components/best-users';
    import journal from "~/components/journal";
    import {useCategoryStore} from "~/store/category";
    import { useMainStore } from "~/store/main";
    import { storeToRefs } from "pinia";

    const categoryStore = useCategoryStore();
    const mainStore = useMainStore();
    const { userCount, reviewCount, commentCount } = storeToRefs(mainStore);
    const { categories } = storeToRefs(categoryStore);

    const title = `Главная`;
    const metaName = `${title} Smart-Beautiful - агрегатор цен косметических товаров`;
    useHead({
        title,
        meta: [
            {name: 'description', content: metaName},
            {name: 'keywords', content: metaName}
        ],
    });

    useAsyncData(async() => {
        if (!categories.length) {
            await categoryStore.loadNestedCategories();
            mainStore.loadMainStatistics();
        }

    });
</script>

<style lang="scss" scoped>
    @keyframes load {
        from {
            left: -150px;
        } to {
              left: 100%;
          }
    }

    .main {
        margin-top: 30px;
        &__style {
            box-shadow: 0 8px 8px 0 rgba(0,0,0,0.05),0 29px 26px 0 rgba(0,0,0,0.08);
            border-radius: 8px;
            background: #fff;
            width: 100%;
            padding: 30px;
            &.about {
                margin-bottom: 20px;
            }
        }
        &__left {
            max-width: 880px;
        }
        &__right {
            flex-grow: 1;
        }
        &__row {
            gap:10px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-bottom:15px;
            flex-wrap: wrap;
            &-item {
                text-decoration: none;
                width: calc(100% /4 - 10px);
                align-items: center;
                justify-content: space-between;
                cursor: pointer;
                position: relative;
                user-select: none;
                border-radius: 8px;
                box-shadow: 0 1px 2px 0 rgba(0,0,0,0.16);
                display: inline-flex;
                flex-direction: column;
                vertical-align: top;
                margin: 0 0 12px 0;
                background: #fff;
                padding: 30px;
                height: 280px;
                &:hover {
                    box-shadow: 0 8px 8px 0 rgba(0,0,0,0.05),0 29px 26px 0 rgba(0,0,0,0.08);
                }
                & img {
                    display: inline-block;
                    text-align: center;
                    width: 100%;
                    height: 70%;
                    line-height: 150px;
                    object-fit: cover;
                }
                & .subtitle {
                    display: inline-block;
                    margin-bottom: 10px;
                    text-align: center;
                    width: 100%;
                    font-size: 16px;
                    font-weight: bold;
                    color: #4e4e4e;
                }
            }
            .skeleton-loader {
                position:relative;
                overflow: hidden;
                &:before {
                    content: '';
                    display: block;
                    position: absolute;
                    left: -150px;
                    top: 0;
                    height: 100%;
                    width: 150px;
                    background: linear-gradient(to right, transparent 0%, #E8E8E8 50%, transparent 100%);
                    animation: load 1s cubic-bezier(0.4, 0.0, 0.2, 1);
                }
            }
        }
        &__wrapper {
            width: 100%;
            border-radius: 8px;
            background-color: #fff;
            padding: 20px;
        }
    }
    .bold {
        font-size: 18px;
        font-weight: 600;
    }
    .count {
        font-size: 20px;
        font-weight: bold;
        color: #e080a7;
    }

    @media (max-width: 1000px) {
        .main__row-item {
            height: 240px;
        }
    }

    @media (max-width: 700px) {
        .main__row-item {
            width: calc(100% /2 - 10px);
            height: 200px;
            padding:20px
        }
    }
    @media (max-width: 400px) {
        .main__row-item {
            width: calc(100% /2 - 5px);
            height: 150px;
            padding: 10px;
        }
    }
</style>
