<template>
    <div class="file-form">
        <div
                v-for="(image, index) in previewImages"
                :key="index"
                class="file-form__item file-form__img"
                :style="{width: width, height: `${height}px`}"
        >
            <img :src="`${image}`" class=""/>

            <progress-bar
                v-if="isUploading"
                :progress="progress"
                class="indicator"
            />

            <div class="file-form__img-layer">
                <div class="file-form__close" @click="deletePhoto(index)">×</div>
                <div v-if="index !== mainPhotoIndex"  class="main-photo-title"><span>Сделать главной</span></div>
                <div v-else class="main-photo-title">Главное фото</div>
            </div>


        </div>

        <div
            class="file-form__item file-form__upload"
            :style="{width: width, height: `${height}px`}"
        >
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"
                 stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em"
                 xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <p>Добавьте свои фотографии (до 10
                штук)<span>*</span></p>
            <input @change="loadImages($event)" type="file" name="images"  multiple accept="image/*" :disabled="disabled">
        </div>
    </div>
</template>

<script setup>
    import ProgressBar from '../progress-bar'
    import { useFileStore } from "~/store/file";
    import { storeToRefs } from "pinia";

    const fileStore = useFileStore();
    const { progress, isUploading, uploadingFileUrls } = storeToRefs(fileStore);

    const emit = defineEmits(['update:initialImageUrls']);

    const props = defineProps({
        entity: {
          type: String,
        },
        initialImageUrls: {
            type: Array,
            default: () => [],
        },
        fileName: {
          type: String,
          default: '',
        },
        height: {
            type:Number,
            default: 152
        },
        disabled: {
            type: Boolean,
            default: false
        },
    });

    const previewImages = ref([]);
    const mainPhotoIndex = ref(0);
    const isPreviewImagesInit = ref(true);

    const photoCountInRow = computed(() => {
        if (!props.width && document) {
            const width = document.documentElement.clientWidth

            if (width > 1200) {
                return 4;
            }
            if (width < 1200 && width > 900) {
                return 3;
            }
            if (width < 900 && width > 500) {
                return 2;
            }
            if (width < 500) {
                return 1;
            }
        }
        return 4;
    });

    const width = computed(() => `calc(100% / ${photoCountInRow.value} - 16px)`);

    let initialImageUrlsLocal = computed({
        get() {
            return props.initialImageUrls;
        },
        set(value) {
            emit('update:initialImageUrls', value);
        },
    });


    const loadImages = event => {
        const files = event.target.files || event.dataTransfer.files
        for (const file of files) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = e => previewImages.value.push(e.target.result);
        }

        fileStore.loadFilesAsForm({ files, entity: props.entity, type: 'image' });
    };

    const deletePhoto = index => {
        previewImages.value.splice(index, 1);
        initialImageUrlsLocal.value.splice(index, 1);
    };

    watch(props.initialImageUrls, value => {
        if (value && isPreviewImagesInit.value) {
            isPreviewImagesInit.value = false;
            previewImages.value = [...value];
        }
    });

    watch(
        uploadingFileUrls,
        value => {
          if (value.length) {
            initialImageUrlsLocal.value = initialImageUrlsLocal.value.concat(value);
          }
        }
    );

    onMounted(() => {
      previewImages.value = [...props.initialImageUrls];
    });
</script>

<style lang="scss" scoped>
    .file-form {
        display: flex;
        flex-wrap: wrap;
        border: 1px dashed #d9d9d9;
        border-radius: 4px;
        overflow: hidden;
        &__item {
            max-height: 100%;
            margin: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #e6e6e6;
            position: relative;
            border-radius: 4px;

            &  img {
                max-height: 100%;
                max-width: 100%;
            }
        }
        &__img {
            &-layer{
                z-index: 1;
                display:none;
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                left: 0;
                background: #000;
                opacity: .6;
            }
            &:hover .file-form__img-layer{
                display:block;
            }
        }
        &__close {
            position: absolute;
            top: 0;
            right: 0;
            overflow: hidden;
            transition: color .1s ease-out;
            border: none;
            border-radius: 0;
            outline: initial;
            background: 0 0;
            font-family: serif;
            font-size: 30px;
            cursor: pointer;
            color:#fff;
            display: flex;
            justify-content: center;
            align-items:center;
            margin: 10px 10px 0 0;
            height: 15px;
            width: 15px;
        }
        &__upload {
            text-align: center;
            transition: border-color .3s;

            & svg {
                position: absolute;
                top: 10%;
                left: 50%;
                font-size: 2rem;
                color: #598cff;
                transform: translate(-50%);
            }
            & p {
                font-size: .8rem;
                color: #ababab;
                position: absolute;
                top: 39%;
                width:80%;
                left: 50%;
                transform: translate(-50%);
            }
            & input[type="file"] {
                width: 100%;
                height: 100%;
                opacity: 0;
                cursor: pointer;
            }
        }
    }
    .indicator {
        z-index: 1;
        position: absolute;
        right: 0;
        left: 0;
        bottom: 0;
    }
    .main-photo-title {
        z-index: 2;
        line-height: 30px;
        position: absolute;
        background: rgba(0,0,0,.7);
        color:#fff;
        padding-left: 10px;
        height: 30px;
        right: 0;
        left: 0;
        bottom: 0;
    }

    @media (max-width: 900px) {
        .file-form__item  {
            width: calc(100% / 2 - 16px);
        }
    }

    @media (max-width: 500px) {
        .file-form__item  {
            width: 100%;
        }
    }
</style>
