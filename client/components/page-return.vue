<template>
    <div class="page-return">
        <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M.999 6.987c0-.233.08-.46.23-.639l4-4.99a1.002 1.002 0 0 1 1.767.548.998.998 0 0 1-.227.73l-3.48 4.351 3.32 4.351a.997.997 0 0 1-.15 1.407 1 1 0 0 1-1.46-.14l-3.83-4.99a.996.996 0 0 1-.17-.628Z" fill="currentColor"></path>
        </svg>
        <nuxt-link :to="url">
            Назад
        </nuxt-link>
    </div>
</template>

<script>
    const props = defineProps({
        url: String
    });
</script>

<style scoped lang="scss">
.page-return {
    margin-top: 4px;
    a {
        text-decoration:none;
        justify-content: left;
        background-color: rgba(0,0,0,0);
        color: #83899f;
        min-width: 40px;
        border-radius: 12px;
        box-sizing: border-box;
        transition: color 0.2s ease-in-out;
        display: inline-block;
        &:hover {
            color: #26325c;
            outline: none;
        }
    }
    & svg {
        height: 12px;
        width: 8px;
        margin-right: 12px;
        opacity: .5;
        transition: opacity 0.2s ease-in-out;
    }
}
</style>