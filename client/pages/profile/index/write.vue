<template>
    <div class="wrapper">
        <tabsComponent class="width" :tabList="['Написать статью', 'Написать отзыв']" >
            <template v-slot:tabPanel-1>
                <h2 class="title">Написать статью</h2>
                <article-form />
            </template>
            <template v-slot:tabPanel-2>

            </template>
        </tabsComponent>
    </div>
</template>

<script setup>
    import tabsComponent from "~/components/tabsComponent.vue";
    import articleForm from "~/components/profile/article-form";
</script>

<style scoped lang="scss">
    //@import '@/assets/scss/colors.scss';
    $mainFontColor: #26325c;
    .wrapper {
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.16);
        background-color: #fff;
        display: flex;
        flex-wrap: wrap;
    }
    .title {
        color: $mainFontColor;
        font-size: 28px;
        font-weight: 600;
    }
    .width {
        width: 100%;
    }
    .create {
        max-width:600px;
    }
    .box {
        margin-bottom: 16px;
    }
    .icon {
        vertical-align: middle;
        display: inline-block;
        width: 32px;
        height: 32px;
        margin-left: -12px;
        &-inner {
            display: inline-block;
            position: relative;
            width: 32px;
            height: 32px;
            & svg {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                width: 20px;
                height: 20px;
            }
        }
    }
</style>