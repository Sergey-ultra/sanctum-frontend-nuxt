<template>
    <modal v-model:isShowModal="isShowLocationModal">
        <template v-slot:header>
            <h3>Выберите свою страну</h3>
        </template>
    </modal>
</template>

<script setup>
    import modal from '../modal';
    import {useNuxtApp} from "#app";

    const emit = defineEmits(['update:isShowModal']);
    const props = defineProps({
        isShowModal: {
            type: Boolean,
            default: false
        }
    });

    const isShowLocationModal = computed({
        get() {
            return props.isShowModal;
        },
        set(value) {
            emit('update:isShowModal', value);
        }
    });

    onMounted(async() => {
      const { $api } = useNuxtApp();
      const { data } = await $api.get('/location-list');
      console.log(data);
    });
</script>

<style scoped>

</style>