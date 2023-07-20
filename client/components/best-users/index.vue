<template>
    <section class="best">
        <div class="title">Лучшие пользователи</div>
        <div class="best__wrapper"></div>
    </section>
</template>
<script>

</script>
<style scoped lang="scss">
.title {
    font-weight: 500;
    line-height: 32px;
    font-size: 26px;
    color: #222;
    margin-bottom:20px;
    display:block;
}
    .best {
        &__wrapper {
            height: calc(100% - 52px);
            border-radius: 8px;
            background-color: #ffeaf2;
            padding: 20px;
        }
    }
</style>
