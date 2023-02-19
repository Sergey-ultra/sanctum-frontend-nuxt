<template>
    <my-published
        @showEditForm="showEditForm"
        @showDeleteForm="showDeleteForm"
    >
        <template v-slot:status v-if="['moderated', 'rejected'].includes(article.status)">
            <div
                v-if="article.status === 'moderated'"
                class="status status-moderated"
            >
                <span class="status__icon">
                    <svg><use xlink:href="#icons_question-circle">
                        <symbol viewBox="0 0 24 24" id="icons_question-circle">
                            <path fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1m0 1.75c5.1 0 9.25 4.15 9.25 9.25S17.1 21.25 12 21.25 2.75 17.1 2.75 12 6.9 2.75 12 2.75zm-1.5 13.293c0 .718.479 1.162 1.244 1.162.766 0 1.237-.444 1.237-1.162 0-.725-.471-1.169-1.237-1.169-.765 0-1.244.444-1.244 1.169zm1.456-8.996c-2.099 0-3.288 1.176-3.322 2.878h1.852c.041-.752.561-1.237 1.347-1.237.779 0 1.299.451 1.299 1.086 0 .636-.267.964-1.149 1.491-.943.553-1.319 1.169-1.23 2.262l.014.376h1.811v-.362c0-.656.253-.991 1.162-1.518.964-.567 1.463-1.285 1.463-2.31 0-1.579-1.292-2.666-3.247-2.666z"></path>
                        </symbol>
                    </use></svg>
                </span>
                <span>Ожидает публикации</span>
            </div>
            <div
                v-else-if="article.status === 'rejected'"
                class="status status-rejected"
            >
                <span>Статья отклонен</span>
            </div>
        </template>

        <template v-slot:title>
            <nuxt-link :to="`/article/${article.slug}`">
                <div class="title">
                    <div class="title-name">
                       {{ article.title }}
                    </div>
                </div>
            </nuxt-link>
        </template>

        <div class="photos">
            <div class="photos__main__image">
                <picture class="photos__main__photo">
                    <img :src="`${$config.APP_URL}/${article.image}`" :alt="article.title"/>
                </picture>
            </div>
        </div>

        <div class="items">{{ article.preview }}</div>
    </my-published>

    <delete-form
        :selectedName="`Статья ${article.title}`"
        v-if="isShowDeleteForm"
        v-model:isShowDeleteForm="isShowDeleteForm"
        @delete="deleteCurrent"
    />
</template>

<script setup>
    import deleteForm from '../delete-form'
    import myPublished from "./my-published";

    const emit = defineEmits(['deleteItem']);
    const props = defineProps({
        article: {
            type: Object,
            default: null
        }
    });


    const isShowDeleteForm = ref(false);

    const showDeleteForm = () => isShowDeleteForm.value = true;

    const deleteCurrent = () => {
        emit('deleteItem');
        isShowDeleteForm.value = false;
    };

    const showEditForm = () => {
        navigateTo({ name: 'profile-index-edit-article-id', params: {id: props.article.id }});
    };
</script>

<style lang="scss" scoped>
.status {
    margin: -16px -16px 16px;
    padding: 14px 16px 14px 20px;
    font-size: 15px;
    line-height: 18px;
    &__icon svg{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 20px;
        height: 20px;
    }
    &-moderated {
        background-color: #fff8d9;
        & .status__icon {
            display: inline;
            color: #ffa300;
            margin: 8px;
            position: relative;
            & svg {
                fill: #ffa300 !important;
            }

        }
        & span {
            display: inline;
            margin: 8px;
            color: #ffa300;
        }
    }
    &-rejected {
        background-color: #ffe1e1;
        & span {
            display: inline;
            color: #c70000;
            margin: 8px;
        }
    }
}
a {
    text-decoration: none;
}

.title {
    display: flex;
    align-items: center;
    letter-spacing: .1px;
    min-height: 40px;

    &-name {
        display: flex;
    }
}
.photos {
    margin-top: 28px;
    display: flex;
    align-items: stretch;


    &__main__image {
        width: 70%;
        flex: 1;
        height: 324px;
        max-width: 676px;
        margin-right: 12px;
        position: relative;

    }

    &__main__photo {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        flex: 0 0 auto;
        width: 100%;
        height: 100%;
        background-color: #f4f4f4;

        & img {
            display: block;
            flex: 0 0 auto;
            margin: 0;
            max-width: 100%;
            max-height: 100%;
            height: auto;
            object-fit: contain;
        }
    }

    &__images {
        height: 100%;
        flex-wrap: wrap;
        display: flex;
        flex-direction: column;
    }

    &__image {
        margin: 0 0 12px 12px;
        position: relative;
        width: 64px;
        height: 64px;
        border-radius: 4px;
        justify-content: center;
        align-items: center;
        border: 1px solid transparent;
        padding: 7px;
        outline: none;
        outline-offset: 2px;
        overflow: hidden;

        &:hover {
            border-color: #ccc;
            outline: 0;
        }

        &.active-image {
            border: 2px solid #fc0;
            padding: 6px;
        }

        & img {
            object-fit: cover;
            width: 100%;
            height: 100%;
        }
    }
}
.items {
    margin-top: 12px;
}

</style>