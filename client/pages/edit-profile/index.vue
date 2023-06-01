<template>
    <div>
        <h2 class="title">Мой профиль</h2>

        <div class="profile">
            <div class="profile__item profile__photo">
                <img v-if="localImage" :src="localImage" alt="avatar"/>


                <fa class="profile__photo-icon icon" icon="camera"></fa>
                <input @change="loadImage($event)" type="file" accept="image/*">
            </div>
            <tabsComponent class="profile__inner" :tabList="['Личные данные', 'Смена пароля', 'Уведомления']">
                <template v-slot:tabPanel-1>
                    <edit-profile/>
                </template>
                <template v-slot:tabPanel-2>
                    <changePassword></changePassword>
                </template>
                <template v-slot:tabPanel-3>
                    <notification></notification>
                </template>
            </tabsComponent>
        </div>
    </div>
</template>

<script setup>
    import changePassword from '~/components/profile/change-password.vue'
    import notification from '~/components/profile/notification.vue'
    import tabsComponent from "~/components/tabsComponent.vue";
    import editProfile from "~/components/profile/edit-profile.vue";
    import { useNuxtApp } from '#app';
    import {useUserStore} from "~/store/user";

    const { $api } = useNuxtApp();
    const userStore = useUserStore();


    definePageMeta({
        middleware: ["auth"]
    });

    let uploadedImage = ref('');

    let localImage = computed(() => {
        if (uploadedImage.value) {
            return uploadedImage.value;
        }
        return $api.$user.avatar;
    });

    const readImage = async file => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = e => resolve(e.target.result);
        });
    }

    const loadImage = async event => {
        let file = event.target.files[0] || event.dataTransfer.files[0];
        uploadedImage.value = await readImage(file);

        await userStore.updateAvatar({ avatar: uploadedImage.value });
        $api.$user.avatar = uploadedImage.value;
    };

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

    setSEO();
</script>

<style lang="scss" scoped>
    $mainColor: #454cee;
    $mainFontColor: #26325c;
    $mainGreyColor: #e8ebef;

    .title {
        color: $mainFontColor;
        font-size: 28px;
        font-weight: 600;
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
        &__inner {
            overflow: hidden;
            flex-grow: 1;
        }

        &__photo {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            /*background-color: gray;*/
            /*border-radius: 50%;*/
            height: 200px;
            margin-right: 30px;
            width: 200px;
            & img {
                object-fit: cover;
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

    @media (max-width: 500px) {
        .profile {
            &__item {
                width: 100%;
                margin-right: 0;
                &:not(:last-child) {
                    margin-bottom: 20px;
                }
            }
            &__photo {
                img {
                    position: absolute;
                    max-width: 100%;
                    height: 100%;
                }
            }
        }
    }
</style>
