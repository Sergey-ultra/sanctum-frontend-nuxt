<template>
    Wait! Login via Services.
</template>

<script setup>
    import { useNuxtApp } from '#app'
    const { $api } = useNuxtApp();

    const route = useRoute();
    const router = useRouter();

    onMounted(() => {
        const {token, user_name, avatar} = route.query
        $api.loginViaSocialServices({ user_name, token, avatar })
        router.push('/')
    });
</script>

<style scoped>

</style>