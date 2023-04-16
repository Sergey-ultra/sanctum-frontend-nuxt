<template>
    <div class="tags" id="article_tags" ref="tagsContainer" :class="{'tags-show': isShowAllTags}">
        <nuxt-link
                :to="`/article/tag/${tag}`"
                class="tags__item"
                :class="{'tags__item-hide': hiddenTags.includes(tag)}"
                v-for="tag in tags"
                :key="tag"
                :id="tag"
        >
            {{tag}}
        </nuxt-link>
        <div class="tags__item layer" id="layer" @click="showAllTags" :class="{'layer-hide': isShowAllTags}">
            <details>
                <summary role="button">
                    <div class="layer__item">
                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon">
                            <path d="M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                        </svg>
                    </div>
                </summary>
            </details>
        </div>
    </div>
</template>

<script setup>
    let tagsContainer = ref('');
    let isShowAllTags = ref(true);
    let hiddenTags = ref([]);

    const props = defineProps({
        tags: {
            type: Array,
            default: () => []
        }
    });

    const showAllTags = () => {
        isShowAllTags.value = true;
        hiddenTags.value = [];
    }

    const setTagsContainer = () => {
        if (tagsContainer.value) {
            const containerEndX = tagsContainer.value.getBoundingClientRect().left + tagsContainer.value.clientWidth;

            props.tags.forEach(tag => {
                const currentDom = document.getElementById(tag);
                const currentDomEndX = currentDom.getBoundingClientRect().left + currentDom.clientWidth;
                if (currentDomEndX > containerEndX) {
                    hiddenTags.value.push(currentDom.id);
                    if (isShowAllTags.value) {
                        isShowAllTags.value = false;
                    }
                }
            })
        }
    }

    watch(tagsContainer, () => setTagsContainer());

    onMounted(() => setTagsContainer());
</script>

<style lang="scss" scoped>
    .tags {
        position: relative;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        overflow: hidden;
        margin-bottom: 30px;

        &-show {
            flex-wrap: wrap;
            overflow: visible;
        }

        &__item {
            font-size: .875rem;
            line-height: 1.5;
            padding: .25rem .5rem;
            color: #555;
            background: #faf7ef;
            border-radius: 50rem !important;
            margin-right: .25rem !important;
            margin-bottom: .25rem !important;
            white-space: normal;
            flex: 0 0 auto;
            position: relative;
            text-decoration: none;
            transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;

            &-hide {
                visibility: hidden;
            }
        }
    }

    .layer {
        &__item {
            align-items: center;
            background-color: initial;
            border: 0;
            border-radius: 6px;
            color: var(--color-fg-default);
            cursor: pointer;
            display: flex;
            font-size: 14px;
            line-height: 30px;
            padding: 0 8px;
            position: relative;
            text-align: center;
            white-space: nowrap;
            &:before {
                content: "";
                height: 100%;
                left: 50%;
                min-height: 48px;
                position: absolute;
                top: 50%;
                transform: translateX(-50%) translateY(-50%);
                width: 100%;
            }
        }
        position: absolute;
        right: 0 !important;
        &-hide {
            visibility: hidden;
        }
    }
    .octicon {
        display: inline-block;
        overflow: visible !important;
        vertical-align: text-bottom;
        fill: rgb(36, 41, 47);
    }
</style>