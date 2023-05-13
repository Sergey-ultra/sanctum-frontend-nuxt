<template>
    <modal
            v-model:isShowModal="isShowModalLocal"
            :width="30"
    >
        <template v-slot:header>
            <h3>Отключить уведомления в Телеграм</h3>
        </template>
        <form class="form">
            <div class="form__row">
                <label>
                    <div class="label">
                        <span class="text-gray">Введите код из Телеграм</span>
                    </div>
                    <input class="input" type="text" v-model.trim="code">
                </label>
            </div>
        </form>
        <template v-slot:buttons>
            <buttonComponent :isLoading="isUnsubscribing" @click="disconnect">Отключить</buttonComponent>
            <buttonComponent @click="closeModal" :color="'gray'">Отмена</buttonComponent>
        </template>
    </modal>
</template>
<script setup>
    import modal from '../modal';
    import buttonComponent from "~/components/button-component.vue";
    import { useNuxtApp } from "#app";
    const { $api } = useNuxtApp();

    let code = ref('');
    let isUnsubscribing = ref(false);
    let hash = '';

    const props = defineProps({
        isShowModal: {
            type: Boolean,
            default: false
        }
    })
    const emit = defineEmits(['update:isShowModal']);

    let isShowModalLocal = computed({
        get() {
            return props.isShowModal;
        },
        set(value) {
            emit('update:isShowModal', value);
        }
    });

    const closeModal = () => isShowModalLocal.value = false;
    const disconnect = () => {
        if (code.value.length === 4) {
            unsubscribe({
                hash,
                code: code.value
            });
            closeModal();
        }
    }
    const unsubscribe = async (payload = {}) => {
        isUnsubscribing.value = true;
        const { data } = await $api.post('/notification/telegram/account/unsubscribe', {...payload});
        if (data.hash) {
            hash = data.hash;
        }
        isUnsubscribing.value = false;
    }

    onMounted(async() => {
        await unsubscribe();
    });
</script>
<style scoped lang="scss">

</style>