import { useNuxtApp } from '#app'


export default defineNuxtRouteMiddleware((to, from) => {
    const { $api } = useNuxtApp();
    if (!$api.token.value) {
        return navigateTo({ path: '/401', query : { to: to.name, from: from.fullPath }});
    }
})