<template>
    <div class="main">
        <img :src="`${$config.APP_URL}/storage/icons/401.svg`"/>
        <h1>Страница не найдена</h1>
    </div>
</template>
<script setup>

    const setSEO = () => {
        const name = `Страница не найдена`;
        const metaName = `Smart-Beautiful - агрегатор цен косметических товаров ${name}`;
        useHead({
            title: name,
            meta: [
                {name: 'description', content: metaName},
                {name: 'keywords', content: metaName}
            ],
        });
    }
    setSEO();
</script>


<style scoped>
    .main {
        padding: 20px;
        min-height: 400px;
        background-color: #fff;
        border-radius: 8px;
        width: 100%;
        margin: 48px auto;
        text-align: center;
    }
</style>