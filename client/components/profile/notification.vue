<template>
    <form class="form" @submit.prevent="connect">
        <div class="form__title">Уведомления</div>
        <div class="form__block">
            <div class="control">
                <div class="avatar avatar__size color--secondary">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.265 2.428a2.048 2.048 0 0 0-2.078-.324L2.266 9.339a2.043 2.043 0 0 0 .104 3.818l3.625 1.261 2.02 6.682c.028.089.068.174.119.252.008.012.019.021.027.033a.988.988 0 0 0 .281.265c.095.063.2.11.31.136l.013.001.006.003c.067.014.135.02.203.02l.018-.003a.992.992 0 0 0 .302-.052c.022-.008.041-.02.063-.03a.994.994 0 0 0 .205-.114l.152-.129 2.702-2.983 4.03 3.122c.355.276.792.427 1.241.427a2.054 2.054 0 0 0 2.008-1.633l3.263-16.017a2.03 2.03 0 0 0-.693-1.97ZM9.37 14.736a.994.994 0 0 0-.272.506l-.31 1.504-.784-2.593 4.065-2.117-2.699 2.7Zm8.302 5.304-4.763-3.69a1 1 0 0 0-1.353.12l-.866.955.306-1.487 7.083-7.083a1 1 0 0 0-1.169-1.593L6.745 12.554 3.02 11.191 20.999 4l-3.327 16.04Z" fill="currentColor"></path>
                    </svg>
                </div>
                <div class="control__description">
                    <p class="control__title">Телеграм</p>
                    <p class="text-gray">Получайте уведомления в мессенджер</p>
                </div>
            </div>
            <div class="control__buttons">
                <p class="text-gray" v-if="telegramUserName">{{ telegramUserName }}</p>
                <buttonComponent :color="'blue'" :radius="true" type="submit">{{ isSubscribe ? 'Отключить' : 'Подключить' }}</buttonComponent>
            </div>
        </div>
        <connectNotificationModal
                v-if="isShowNotificationModal"
                v-model:is-show-modal="isShowNotificationModal"/>
        <disconnectNotificationModal
                v-if="isShowDisconnectNotificationModal"
                v-model:is-show-modal="isShowDisconnectNotificationModal"/>
    </form>
</template>
<script setup>
    import buttonComponent from "~/components/button-component.vue";
    import connectNotificationModal from "~/components/profile/connect-notification-modal.vue";
    import disconnectNotificationModal from "~/components/profile/disconnect-notification-modal.vue";
    import { useNuxtApp } from "#app";
    const { $api } = useNuxtApp();

    let refreshIntervalId;
    let isShowNotificationModal = ref(false);
    let isShowDisconnectNotificationModal = ref(false);
    let isSubscribe = ref(false);
    let telegramUserName = ref('');
    const connect = () => {
        if (!isSubscribe.value) {
            isShowNotificationModal.value = true;
        } else {
            isShowDisconnectNotificationModal.value = true;
        }
    }

    const getAccount = async () => {
        const { data } = await $api.get('/notification/telegram/account');
        isSubscribe.value = data.subscribe;
        telegramUserName.value = data.username;
    }

    watch(
        isSubscribe,
        value => {
            if (value) {
                isShowNotificationModal.value = false;
            }
        }
    )


    onMounted(async () => {
        await getAccount();
        refreshIntervalId = setInterval(async () => {
            await getAccount();
        }, 3000);
    });

    onUnmounted(() => clearInterval(refreshIntervalId));

</script>
<style scoped lang="scss">
    .avatar {
        display: inline-flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        overflow: hidden;
        box-sizing: border-box;
        &__size {
            margin-right: 14px;
            width: 48px;
            height: 48px;
        }
    }
    .control {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        margin-right: 45px;
        &__description {
            display: flex;
            flex-direction: column;
        }
        &__title {
            font-size: 17px;
            font-weight: 600;
            margin-bottom: 5px;
            max-width: 600px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        &__buttons {
            display: grid;
            grid-template-columns: max-content max-content;
            align-items: center;
            grid-gap: 20px;
        }
    }
</style>