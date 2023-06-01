<template>
    <div class="meta">
        <div class="meta__user">
            <div class="meta__userImg">
                <img :src="`${$config.APP_URL}/${currentEntity.user_avatar}`" :alt="currentEntity.user_name"/>
            </div>
            <div class="meta__userInfo">
                <div class="meta__userName">
                    <span>
                        {{ currentEntity.user_name }}
                    </span>
                </div>

            </div>
        </div>
        <div class="meta__info">
            <div class="meta__infoItem">{{ currentEntity.created_at }}</div>
            <div class="meta__infoItem">
                <span class="meta__viewsIcon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" data-tid="9bd43b8c">
                          <path fill="#999" d="M12 17c3.356 0 6.549-1.81 8.96-5.01C18.527 8.794 15.341 7 12 7c-3.356 0-6.549 1.81-8.96 5.01C5.473 15.206 8.659 17 12 17zm0-11c3.816 0 7.299 2.097 9.85 5.51.2.29.2.668 0 .958C19.3 15.903 15.816 18 12 18s-7.299-2.097-9.85-5.51c-.2-.29-.2-.668 0-.958C4.7 8.097 8.184 6 12 6zm-3.5 5.994c.458.349 1.04.541 1.671.5 1.224-.073 2.252-1.1 2.326-2.323A2.568 2.568 0 0 0 11.99 8.5a3.512 3.512 0 0 1 3.503 3.73 3.494 3.494 0 0 1-3.263 3.263 3.512 3.512 0 0 1-3.73-3.499z"></path>
                    </svg>
                </span>
                {{ currentEntity.views_count  ?? '' }}
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    currentEntity: {
        type: Object
    }
})
</script>
<style scoped lang="scss">
.meta {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;

    &__user {
        flex: 1 0 450px;
        display: flex;
        align-items: center;
    }

    &__userImg {
        flex: 0 0 62px;
        margin-right: 16px;
        width: 62px;
        height: 62px;
        border-radius: 50%;
        overflow: hidden;

        & img {
            object-fit: cover;
            width: 100%;
            height: 100%;
        }
    }

    &__userName {
        color: #222;
        font-weight: 600;
        font-style: normal;
        font-stretch: normal;
        font-size: 16px;
        line-height: 24px;
    }

    &__firstLetter {
        color: red;
        font-style: normal;
    }

    &__info {
        padding: 9px 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    &__infoItem {
        color: #999;
        font-family: YS Text, sans-serif;
        font-weight: 400;
        font-style: normal;
        font-stretch: normal;
        font-size: 14px;
        line-height: 20px;
        white-space: nowrap;

        &:not(:last-child) {
            padding-right: 16px;
        }
    }


    &__viewsIcon {
        display: inline-block;
        width: 20px;
        height: 20px;
        vertical-align: top;
    }
}
</style>
