<template>
    <div class="wrapper">
        <article-form/>
    </div>
</template>

<script setup>
    import articleForm from "~/components/profile/article-form";
    const route = useRoute();
</script>

<style scoped lang="scss">
    .wrapper {
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.16);
        background-color: #fff;
        display: flex;
        flex-wrap: wrap;
    }
</style>