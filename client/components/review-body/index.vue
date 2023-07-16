<template>
    <div class="editor">
        <div class="editor__content" >
            <div ref="container" class="editor__container">
                <div
                    v-for="(block, index) in localBody.blocks"
                    :key="index"
                    class="editor__block"
                    :class="{
                        'block__paragraph': block.type === 'paragraph',
                        'block__image': block.type === 'image',
                    }"
                    :style="getMarginByIndex(index)"
                >
                    <div v-if="block.type === 'paragraph'">
                        <textarea v-model="block.data.text" @input="heightSync($event)" @change="heightSync($event)"></textarea>
                    </div>
                    <div
                        v-else-if="block.type === 'image'"
                        class="image"
                        :class="{
                            'drag-item': index === imageDragIndex,
                            'image-focus': index === imageFocusIndex,
                        }"
                        @click="setImageFocusIndex(index)"
                    >
                        <img :src="`${$config.APP_URL}/${block.data.text}`" :alt="block.data.description">
                        <div class="image-layer">
                            <div class="image__drag" @mousedown="dragPhoto(index, $event)">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px"
                                     viewBox="0 0 512 512">
                                    <path
                                        d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4V224H109.3l9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4H224V402.7l-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4V288H402.7l-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4H288V109.3l9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"/>
                                </svg>
                            </div>
                            <div class="image__close" @click="deletePhoto(index)">×</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="editor__cursor" ref="cursor">
                <img :src="`${$config.APP_URL}/${cursorImage}`" >
            </div>
        </div>
        <div class="editor__panel">
            <div class="chars-counter text-gray">
               Количество символов: {{ symbolCount }}
            </div>
            <div class="edit-panel">
                <div class="edit-panel__button" @click.prevent="showAddImageModal">
                    <fa icon="camera"></fa>
                    Вставить фото
                </div>
                <div class="edit-panel__button">
                    Добавить ссылку
                </div>
                <div class="edit-panel__button" @click="emit('saveAsDraft')">
                     В черновик
                </div>
            </div>
        </div>
        {{ modelValue }}
        {{ localBody }}
        <modal v-model:isShowModal="isShowAddImageModal">
            <template v-slot:header>
                <h3>Добавление новой фотографии</h3>
            </template>
            <input @change="setImage($event)" type="file">
            <div class="form__group">
                <label>
                    Что на фото?
                    <inputComponent v-model="imageDescription"/>
                </label>
            </div>

            <buttonComponent @click="addImage">Добавить</buttonComponent>
        </modal>
    </div>
</template>
<script setup>
import inputComponent from '~/components/input-component';
import buttonComponent from '~/components/button-component';
import calculateSymbolCount from '~/utils/symbolCount';
import modal from '~/components/modal.vue';
import {useFileStore} from "~/store/file";
import {storeToRefs} from "pinia";

const props = defineProps({
    modelValue: {
        type: Object,
        default: {
            blocks: [
                {
                    type: 'paragraph',
                    data: {
                        text: ''
                    }
                }
            ]
        },
    },
});

const fileStore = useFileStore();
const emit = defineEmits(['update:modelValue', 'saveAsDraft']);
const { progress, isUploading, uploadingFileUrls } = storeToRefs(fileStore);


const isShowAddImageModal = ref(false);
const container = ref(null);
const cursor = ref(null);
const imageFocusIndex = ref(null);
const imageDragIndex = ref(null);
const imageDescription = ref(null);
const cursorImage = ref('');
const insertedIndex = ref(null);

const localBody = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    }
});

const symbolCount = computed(() => {
    if (!localBody.value) {
        return 0;
    }
    return calculateSymbolCount(localBody.value);

});

const showAddImageModal = () => isShowAddImageModal.value = true;

const setImageFocusIndex = index => imageFocusIndex.value = index;


const heightSync = event => {
    const target = event.target;
    console.log(target.scrollTop);
    if (target.scrollTop > 0){
        target.style.height = target.scrollHeight + "px";
    }
    // target.style.cssText = 'height:auto; padding:0';
    // target.style.cssText = 'height:' + event.target.scrollHeight + 'px';

}

const getMarginByIndex = index => {
    if (insertedIndex.value === index) {
        if (index !== localBody.value.blocks.length - 1) {
            return  'margin-top: 150px;'
        }
        return 'margin-bottom: 150px;'

    }
   return '';
}

const setImage = async event => {
    const file = event.target.files[0] || event.dataTransfer.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    //reader.onload = e => localImage.value = e.target.result;

    await fileStore.loadFilesAsForm({ files: [file], entity: 'review', type: 'image' });
};

const addImage = () => {
    imageFocusIndex.value = localBody.value.blocks.length;

    localBody.value.blocks = localBody.value.blocks.concat([
        {
            type: 'image',
            data: {
                text: uploadingFileUrls.value[0],
                description: imageDescription.value,
            }
        },
        {
            type: 'paragraph',
            data: {
                text: ''//selectionStart
            }
        }
    ]);

    imageDescription.value = null;
    isShowAddImageModal.value = false;
}

const getCoords = elem => elem.getBoundingClientRect();

const dragPhoto = (index, event) => {

    imageDragIndex.value = index;
    cursorImage.value = localBody.value.blocks[index].data.text;

    let element = event.target;
    const shiftX =  event.pageX - getCoords(element).left;
    const shiftY =  event.pageY - getCoords(element).top;
    const containerLeft = getCoords(container.value).left;
    const containerTop = getCoords(container.value).top;
    const containerHeight = container.value.offsetHeight;
    const containerWidth = container.value.offsetWidth;

    const moving = (event) => {
        event.preventDefault();
        let left = event.pageX - shiftX - containerLeft;
        let mouseTop = event.pageY - shiftY - containerTop;
        if (left < 0) {
            left = 0;
        }
        if (left > containerWidth) {
            left = containerWidth;
        }
        if (mouseTop < 0) {
            mouseTop = 0;
        }
        if (mouseTop > containerHeight) {
            mouseTop = containerHeight;
        }
        //console.log(mouseTop);
        const children = Object.values(container.value.children);
        //let insertedIndex = null;
        let insertedIndexHeight;
        for (let i = 0; i < children.length; i++) {
            const height = getCoords(children[i]).top - containerTop;
            //console.log(mouseTop, height);
            if (children[i].classList.contains('block__image')) {
                insertedIndex.value = null;
            } else if ((mouseTop === 0 || mouseTop === 1) && i === 0) {
                //children[i].style.cssText = 'margin-top: 150px;'
                insertedIndex.value = 0;
                insertedIndexHeight = height;
                console.log('first', mouseTop, height, i, insertedIndexHeight)
                break;
            } else if (mouseTop >= height && height > 0 && i > 0 && i < children.length - 1) {
                // children[i].style.cssText = 'margin-top: 150px;'

                insertedIndex.value = i;
                insertedIndexHeight = height;
                console.log('middle', mouseTop, height, insertedIndexHeight);
                break;
            } else if (mouseTop >= height + children[i].offsetHeight && height > 0 && i === children.length - 1) {

                insertedIndexHeight = height + children[i].offsetHeight;


                // children[i].style.cssText = 'margin-bottom: 150px;'
                insertedIndex.value = children.length - 1;
                break;
            }

        }
        //console.log(insertedIndex.value);

        let topStyle = mouseTop;
        let leftStyle = left;

        if (insertedIndex.value) {

            leftStyle = 100;
            topStyle = insertedIndexHeight + 75;
        }
        // && imageDragIndex.value !== i

        // console.log(insertedIndex.value);


        cursor.value.style.cssText = `top: ${topStyle}px; left: ${leftStyle}px; display:block; height:150px; width: 200px; transform: translate(-50%, -50%);`;
    }
    //console.log(containerHeight);

    moving(event);
    document.onmousemove = function(event) {
        moving(event);
    }

    //   отследить окончание переноса
    document.onmouseup = function (event) {
        event.preventDefault();
        document.onmousemove = null;
        document.onmouseup = null;
        cursor.value.style.cssText = '';
        if (insertedIndex.value) {
            const replace = localBody.value.blocks.splice(imageDragIndex.value, 1);
            localBody.value.blocks.splice(insertedIndex.value, 0, ...replace);

        }
        imageDragIndex.value = null;
        insertedIndex.value = null;
    }
}


const deletePhoto = index => {
    localBody.value.blocks[index  - 1].data.text += '\n' + localBody.value.blocks[index + 1].data.text;
    localBody.value.blocks.splice(index, 2);
}

const closeModal = () => imageFocusIndex.value = null;

// watch(insertedIndex, (value, oldValue) => {
//     console.log(value, oldValue);
//     if (oldValue) {
//         localBody.value.blocks.splice(oldValue, 1);
//     }
//     if (value && value !== imageDragIndex.value) {
//         localBody.value.blocks.splice(value, 0, { type: 'drag'});
//     }
// });

const syncTextareaHeight = () => {
    Object.values(container.value.children)
        .reduce((acc, item) => {
            const chl = Object.values(item.childNodes).reduce((acc, item) => {
                return acc.concat(Object.values(item.childNodes));
            }, []);
            return acc.concat(chl);
        }, [])
        .filter(el => el.tagName.toLowerCase() === 'textarea')
        .forEach(el => {
            el.style.height = `${el.scrollHeight}px`
        });
}

watch(imageFocusIndex, (value) => {
    if (value) {
        document.addEventListener('click', closeModal, {capture: true, once: true});
    } else {
        document.removeEventListener('click', closeModal, {capture: true, once: true});
    }
});

onMounted(() => syncTextareaHeight());
</script>
<style scoped lang="scss">
textarea {
    width: 100%;
    resize: none;
}
.editor {
    padding: 0;
    &__content {
        position: relative;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) inset;
        outline: 1px solid rgb(192, 201, 240);
        min-height: 300px;
        margin-bottom: 10px;
        padding: 0;
    }
    &__container {
        border: 1px solid transparent;
    }
    &__block {
        overflow: hidden;
        border: transparent;
        padding: 0;
    }
    &__cursor {
        cursor: move;
        z-index:1;
        position: absolute;
        display: none;
        border: 1px solid gray;
        & img {
            height: 100%;
            width: 100%;
            object-fit: cover;
        }
    }
    &__panel {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
.edit-panel {
    display: flex;
    gap: 10px;
    &__button {
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
    }
}
.image {
    position: relative;
    max-width: 600px;
    img {
        padding: 0;
        margin: 0;
        pointer-events: none;
        display: block;
        width: 100%;
        max-height: 100%;
        box-sizing: border-box;
        border: 1px solid transparent;
        border-radius: 0;
    }
    &-layer{
        z-index: 1;
        display:none;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
    }
    &-focus {
        img {
            outline: none;
            border: 1px solid red;
            border-radius: 0;
        }
        .image-layer{
            display:block;
        }

    }

    &__drag {
        cursor: move;
        position: absolute;
        margin: 5px;
        top: 0;
        left: 0;
        height: 32px;
        width: 32px;
        color: black;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items:center;
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
        font-family: serif;
        font-size: 30px;
        cursor: pointer;
        color: black;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items:center;
        margin: 5px 5px 0 0;
        height: 32px;
        width: 32px;
    }
}

.drag-item {
    opacity: 0.3;
    cursor: move;
    & .image-layer {
        display: none !important;
    }
}
</style>
