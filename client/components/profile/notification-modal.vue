<template>
<modal
        v-model:isShowModal="isShowNotificationModalLocal"
        :width="30"
>
    <template v-slot:header>
        <h3>Уведомления в Телеграм</h3>
    </template>
    <p class="text-gray">
        Отсканируйте QR-код с помощью камеры, или
        перейдите в мессенджер по <a :href="botUrl">ссылке</a>
    </p>
    <div v-if="qrCode">
        {{ qrCode }}
    </div>
</modal>
</template>
<script setup>
    import { useNuxtApp } from "#app";
    const { $api } = useNuxtApp();
    let botUrl = ref('#');
    let qrCode = ref('');

    const props = defineProps({
        isShowNotificationModal: {
            type: Boolean,
            default: false
        }
    })
    const emit = defineEmits(['update:isShowNotificationModal'])

    let isShowNotificationModalLocal = computed({
        get() {
            return props.isShowNotificationModal;
        },
        set(value) {
            emit('update:isShowNotificationModal', value);
        }
    });

    onMounted(async () => {
        const { data } = await $api.get('/notification-bot');
        if (data && data.bot_url) {
            botUrl.value = data.bot_url;
            qrCode.value = data.qr_code;
        }
    })
</script>
<style scoped lang="scss">

</style>