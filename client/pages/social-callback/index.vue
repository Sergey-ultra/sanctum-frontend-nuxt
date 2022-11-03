<template>
    Wait! Login via Services.
</template>

<script setup>
    import {useAuthStore} from "../../store/auth";

    const authStore = useAuthStore();

    const route = useRoute();
    const router = useRouter();

    onMounted(() => {
        const {token, user_name, avatar} = route.query
        authStore.loginViaSocialServices({ user_name, token, avatar })
        router.push('/')
    });
</script>

<style scoped>

</style>