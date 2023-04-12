<template>
    <div>
        <h2 class="title">Мой профиль</h2>

        <div class="profile">
            <div class="profile__item profile__photo">
                <img v-if="$api.$user.avatar"  :src="`${$config.APP_URL}/${$api.$user.avatar}`" :alt="$api.$user.avatar"/>
                <img v-else :src="`${$config.APP_URL}/storage/icons/user-mf.svg`" alt="user-mf.svg"/>

                <fa class="profile__photo-icon icon" icon="camera"></fa>
                <input @change="loadImages($event)" type="file" id="formFileMultiple" accept="image/jpeg, image/png">
            </div>
            <tabsComponent :tabList="['Личные данные', 'Уведомления']" >
                <template v-slot:tabPanel-1>
                    <div class="profile__item profile__item-form">
                        <form class="form" @submit.prevent="save">
                            <div class="form__title">Личные данные</div>
                            <div class="form__row">
                                <label>
                                    <div class="label">
                                        <span class="gray">Ваше имя</span>
                                    </div>
                                    <input class="input" type="text" v-model="editedUserInfo.name">
                                </label>
                            </div>
                            <div class="form__row">
                                <div class="label">
                                    <span class="gray">Пол</span>
                                </div>
                                <div>
                                    <label class="custom-label">
                                        <input v-model="editedUserInfo.sex" id="male" type="radio" value=0 class="">
                                        <span class="custom-radio-button"></span>
                                        <span>М</span>
                                    </label>
                                    <label class="custom-label">
                                        <input v-model="editedUserInfo.sex" id="female" type="radio" value=1 class="">
                                        <span class="custom-radio-button"></span>
                                        <span>Ж</span>
                                    </label>
                                </div>
                            </div>
                            <div class="form__row">
                                <label>
                                    <div class="label">
                                        <span class="gray">Год рождения</span>
                                    </div>
                                    <select class="select" v-model="editedUserInfo.birthday_year">
                                        <option value="null">Выберите год рождения</option>
                                        <option v-for="year  in years" :value="year">{{ year }}</option>
                                    </select>
                                </label>
                            </div>

                            <buttonComponent :color="'blue'" type="submit">Сохранить</buttonComponent>
                        </form>
                    </div>
                </template>
                <template v-slot:tabPanel-2>
                    <form class="form" @submit.prevent="()=>{}">
                        <div class="form__title">Управление</div>
                        Получайте уведомления в мессенджер
                    </form>
                </template>
            </tabsComponent>
        </div>
    </div>
</template>

<script setup>
    import tabsComponent from "~/components/tabsComponent.vue";
    import buttonComponent from "~/components/button-component.vue";
    import { storeToRefs } from "pinia";
    import {useUserStore} from "../../store/user";
    import {helpers, numeric} from "@vuelidate/validators";
    import useVuelidate from "@vuelidate/core";
    import { useNuxtApp } from '#app'
    import {useFileStore} from "~/store/file";
    const { $api } = useNuxtApp();

    const userStore = useUserStore();
    const fileStore = useFileStore();
    const { userInfo } = storeToRefs(userStore);

    definePageMeta({
        middleware: ["auth"]
    });

    const editedUserInfo = ref({
        birthday_year: 'null'
    });

    const years = computed(() => {
        let res = []
        for (let current_year = 1940; current_year <= new Date().getFullYear(); current_year++) {
            res.push(current_year)
        }
        return res
    });


    let rules = {
        editedUserInfo: {
            birthday_year: {
                numeric:  helpers.withMessage('Поле должно быть годом', numeric),
            },
        },
    }

    const v$ = useVuelidate(rules, { editedUserInfo });

    const loadImages = event => {
        const files = event.target.files || event.dataTransfer.files
        // for (const file of files) {
        //   let reader = new FileReader()
        //   reader.readAsDataURL(file)
        //   reader.onload = e => previewImages.value.push(e.target.result)
        // }


      fileStore.loadFilesAsForm({ files, entity: 'image', type: 'image' })
    };

    const save = () => userStore.updateProfile(editedUserInfo.value);
    const setSEO = () => {
        const title = `Редактирование профиля`;
        const metaName = `${title} Smart-Beautiful - агрегатор цен косметических товаров`;
        useHead({
            title,
            meta: [
                {name: 'description', content: metaName},
                {name: 'keywords', content: metaName}
            ],
        });
    }

    watch(userInfo, value => {
        if (Object.keys(userInfo.value).length) {
            editedUserInfo.value = {...value}
        }
    });


    setSEO();

    onMounted(async () => {
        if (Object.keys(userInfo.value).length) {
            editedUserInfo.value = {...userInfo.value}
        }
    });

</script>

<style lang="scss" scoped>
    $mainColor: #454cee;
    $mainFontColor: #26325c;
    $mainGreyColor: #e8ebef;

    .tabs {
        margin: 0 20px;
    }

    .select {
        width: 100%;
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
    .title {
        color: $mainFontColor;
        font-size: 28px;
        font-weight: 600;
    }

    .label {
        margin-bottom: 8px;
    }

    .custom-label {
        display:inline-flex;
        align-items:center;
        padding-left: 25px;
        position: relative;
        margin: 10px 0;
        cursor: pointer;
        color: $mainFontColor;

        & + .custom-label {
            margin-left: 25px;
        }

        & input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            &:checked + .custom-radio-button {
                background-color: $mainColor;
                border-color: $mainColor;

                &:after {
                    content: "";
                    display: block;
                    width: 8px;
                    height: 5px;
                    border-bottom: 2px solid #fff;
                    border-left: 2px solid #fff;
                    position: absolute;
                    top: 39%;
                    left: 51%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                }
            }
        }
    }

    .custom-radio-button {
        transition: all .3s ease;
        position: absolute;
        top: 0;
        left: 0;
        height: 20px;
        width: 20px;
        background-color: #fff;
        border: 2px solid $mainGreyColor;
        border-radius: 50%;
    }


    .gray {
        color: #83899f;
    }
    .profile {
        margin-top: 20px;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.16);
        background-color: #fff;
        display: flex;
        flex-wrap: wrap;
        &__item {
            &-form {
                width: 472px;
            }
        }

        &__photo {
            position: relative;
            /*background-color: gray;*/
            /*border-radius: 50%;*/
            height: 200px;
            margin-right: 30px;
            width: 200px;
            & img {
                position: absolute;
                width: 100%;
                height: 100%;
            }
            & input[type="file"] {
                width: 100%;
                height: 100%;
                opacity: 0;
            }
            &-icon {
                opacity:0;
                transition: all .2s ease;
                height: 60px;
                width:60px;
                border-radius:50px;
                position: absolute;
                left:50%;
                top: 50%;
                transform: translate(-50%,-50%);
                padding: 15px;
                background-color: rgba(0, 0, 0, .5);
            }
            &:hover .profile__photo-icon {
                opacity: 1;
            }
        }
    }

    .form {
        padding: 16px 0;
        display: block;
        border-bottom: 1px solid $mainGreyColor;
        &__title {
            font-weight: 700;
            font-size: 24px;
            color:$mainFontColor;
        }
        &__row {
            margin-bottom: 20px;
        }
    }
    @media (max-width: 500px) {
        .profile {
            &__item {
                width: 100%;
                margin-right: 0;
                &:not(:last-child) {
                    margin-bottom: 20px;
                }
            }
        }
    }

</style>
