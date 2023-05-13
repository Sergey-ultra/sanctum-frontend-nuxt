<template>
    <form class="form" @submit.prevent="save">
        <div class="form__title">Личные данные</div>
        <div class="form__row">
            <label>
                <div class="label">
                    <span class="text-gray">Ваше имя</span>
                </div>
                <input class="input" type="text" v-model="editedUserInfo.name">
            </label>
        </div>
        <div class="form__row">
            <div class="label">
                <span class="text-gray">Пол</span>
            </div>
            <div>
                <label class="custom-label">
                    <input v-model="editedUserInfo.sex" id="male" type="radio" value="0">
                    <span class="custom-radio-button"></span>
                    <span>М</span>
                </label>
                <label class="custom-label">
                    <input v-model="editedUserInfo.sex" id="female" type="radio" value="1">
                    <span class="custom-radio-button"></span>
                    <span>Ж</span>
                </label>
            </div>
        </div>
        <div class="form__row">
            <label>
                <div class="label">
                    <span class="text-gray">Год рождения</span>
                </div>
                <select class="select" v-model="editedUserInfo.birthday_year">
                    <option value="null">Выберите год рождения</option>
                    <option v-for="year  in years" :value="year">{{ year }}</option>
                </select>
            </label>
        </div>
        <div class="buttons">
            <buttonComponent :color="'blue'" type="submit">Сохранить</buttonComponent>
        </div>
    </form>
</template>

<script setup>
    import buttonComponent from "~/components/button-component.vue";
    import { helpers, numeric } from "@vuelidate/validators";
    import useVuelidate from "@vuelidate/core";
    import { storeToRefs } from "pinia";
    import { useUserStore } from "~/store/user";
    const userStore = useUserStore();
    const { userInfo } = storeToRefs(userStore);

    const editedUserInfo = ref({
        birthday_year: 'null'
    });

    const years = computed(() => {
        let res = []
        for (let currentYear = 1940; currentYear <= new Date().getFullYear(); currentYear++) {
            res.push(currentYear)
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


    const save = () => {
        if (editedUserInfo.value.birthday_year === 'null') {
            editedUserInfo.value.birthday_year = null;
        }
        userStore.updateProfile(editedUserInfo.value);
    }

    watch(
        userInfo,
        value => {
        if (Object.keys(userInfo.value).length) {
            editedUserInfo.value = {...value}
        }
    });

    onMounted(async () => {
        await userStore.loadProfile();
        if (Object.keys(userInfo.value).length) {
            editedUserInfo.value = {...userInfo.value}
        }
    });
</script>

<style scoped lang="scss">
    $mainColor: #454cee;
    $mainFontColor: #26325c;
    $mainGreyColor: #e8ebef;

    .title {
        color: $mainFontColor;
        font-size: 28px;
        font-weight: 600;
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


    .edit {
        width: 472px;
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