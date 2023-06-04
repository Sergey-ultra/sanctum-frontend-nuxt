<template>
<modal
        v-model:isShowModal="isShowModalLocal"
>
    <template v-slot:header>
        <h3>Уведомления в Телеграм</h3>
    </template>
    <p class="text-gray">
        Отсканируйте QR-код с помощью камеры, или
        перейдите в мессенджер по <a :href="botUrl" target="_blank">ссылке</a>
    </p>
    <div v-if="qrCode">
        {{ qrCode }}
    </div>
</modal>
</template>
<script setup>
    import modal from '../modal'
    import { useNuxtApp } from "#app";
    const { $api } = useNuxtApp();
    let botUrl = ref('#');
    let qrCode = ref('');

    const props = defineProps({
        isShowModal: {
            type: Boolean,
            default: false
        }
    })
    const emit = defineEmits(['update:isShowModal'])

    let isShowModalLocal = computed({
        get() {
            return props.isShowModal;
        },
        set(value) {
            emit('update:isShowModal', value);
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
