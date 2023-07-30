<template>
    <footer class="footer">
        <div class="container">
            <div class="footer__main">
                <div class="footer__left">
                    <div class="footer__col">
                        <div class="footer__title">О компании</div>
                        <div class="footer__item">
                            <nuxt-link :to="{ name: 'terms'}">Правила сервиса</nuxt-link>
                        </div>
                        <div class="footer__item">
                            <nuxt-link :to="{ name: 'about'}"> Вопросы и пожелания по сайту</nuxt-link>
                        </div>
                        <div class="footer__item">
                            <nuxt-link :to="{ name:'policy' }">Политика конфиденциальности</nuxt-link>
                        </div>
                        <div class="footer__item">
                            <nuxt-link :to="{ name:'feedback' }">Обратная связь</nuxt-link>
                        </div>
                    </div>
                    <div class="footer__col">
                        <div class="footer__title">Сотрудничество</div>
                        <div class="footer__item">
                            <a href="/supplier">Личный кабинет поставщика</a>
                        </div>
                    </div>
                </div>
                <div class="footer__right">

                </div>
            </div>
            <div>Нашли ошибку на этой странице? Выделите ее и нажмите Ctrl+Enter</div>
            <div>По вопросам сотрудничества admin@smart-beautiful.ru</div>
            <div class="footer__copy">2022 - {{ new Date().getFullYear() }} © Smart-Beautiful - сайт отзывов о косметике и парфюмерии</div>
        </div>
    </footer>
</template>
<style lang="scss" scoped>
    .invalid-feedback {
        color: #fff;
    }
    .footer {
        background: #333;
        color: #fff;
        & a {
            color: #fff;
        }
        &__main {
            margin-bottom:20px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        &__left {
            display: flex;
            flex-wrap:wrap;
        }
        &__right {
            width: 340px;
        }

        &__col {
            font-size: 18px;
            padding: 15px 0;

            &:not(:last-child) {
                margin-right: 49px;
            }
        }

        &__title {
            padding: 0 0 20px;
            font-weight: 700;
            font-size: 20px;
            line-height: 20px;
            margin: 20px 0 16px;
            color: #fff;
            border-bottom: 1px solid #4e4e4e;
        }
        &__item {
            margin-bottom: 12px;
            &:not(:last-child) {
                margin-right: 25px;
            }
            & a {
                text-decoration: none;
            }
            &:hover a {
                color: #ebeff4;
            }
        }
        &__copy {
            border-top: 1px solid #444;
            margin: 15px auto;
        }
    }
    .subscription {
        color: #000;
        &__button {
            font-weight:bold;
        }
        &__form {
            margin: 0 auto;
            max-width: 700px;
            justify-content: space-between;
            align-items: center;
            display: flex;
            flex-wrap: wrap;
            &-item {
                margin-bottom: 20px;
                &:not(:last-child) {
                    margin-right: 10px;
                }

                & .input {
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
            }
        }
        &__policy {
            color: #8c8c8c;
            font-size: 12px;
            line-height: 16px;
            margin-top: 10px;
        }
    }

    @media (max-width: 700px) {
        .subscription {
            &__form {
                /*justify-content: center;*/
                &-submit {
                    /*width: 100%;*/
                }
            }
        }
    }
</style>
