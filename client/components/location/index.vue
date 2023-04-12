<template>
    <div class="location" @click="showDialog">
        <fa icon="map-marker-alt"></fa>
        {{ currentCountry }}

      <locationModal
          v-if="isShowLocationModal"
          v-model:isShowModal="isShowLocationModal"
      />
    </div>
</template>
<script setup>
    import locationModal from "./location-modal.vue"
    import {useNuxtApp} from "#app";

    const currentCountry = ref('Russia');
    const isShowLocationModal = ref(false);

    const showDialog = () => isShowLocationModal.value = true;

    onMounted(async () => {
      const { $api } = useNuxtApp();
      const result = await $api.get('/my-location');

      if (result.name) {
        currentCountry.value = result.name;
      }
       // navigator.geolocation.getCurrentPosition(
       //     position => {
       //       console.log(position.coords.latitude, position.coords.longitude);
       //     },
       //     error => {
       //       console.log(error.message);
       //     },
       // )
    })
</script>
<style lang="scss" scoped>
.location {
    color: #2b2b2b;
}
</style>