<template>
    <div class="photos">
        <div class="photos__main__image">
            <picture class="photos__main__photo"  @click="openLightBox">
                <img :src="`${$config.APP_URL}/${images[selectedPhotoIndex]}`"/>
            </picture>
        </div>
        <div class="photos__images" v-if="images.length > 1">
            <div
                    class="photos__image"
                    :class="{'active-image': imageIndex === selectedPhotoIndex}"
                    v-for="(image, imageIndex) in  images"
                    :key="imageIndex"
                    @click="selectedPhotoIndex = imageIndex"
            >
                <img class="" :src="`${$config.APP_URL}/${image}`" :alt="image"/>
            </div>
        </div>
        <light-box
            class="light-box"
            v-if="isShowLightBox"
            :items="additionalInfoWithSmall"
            v-model:selectedPhotoIndex="selectedPhotoIndex"
            v-model:isShowLightBox="isShowLightBox"
        />
    </div>
</template>

<script setup>
    import lightBox from '~/components/light-box';
    import transformImagePath from "~/utils/transform-image-path";

    const props = defineProps({
        images: {
            type: Array,
            default: () => []
        }
    });

    const selectedPhotoIndex = ref(0);
    const isShowLightBox = ref(false);

    const additionalInfoWithSmall = computed(() => {
        return props.images
            .map(path => {
                return { type: 'image', url: path, small: transformImagePath(path, 'small') }
            });
    });

    const openLightBox = () =>  isShowLightBox.value = true;
</script>

<style scoped lang="scss">
    .photos {
        margin-top: 28px;
        display: flex;
        align-items: stretch;
        height: 324px;
        overflow: hidden;

        &__main__image {
            width: 70%;
            flex: 1;
            height: 100%;
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
                cursor: pointer;
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
</style>
