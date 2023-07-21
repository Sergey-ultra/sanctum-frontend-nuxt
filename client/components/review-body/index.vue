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
                >
                    <div v-if="block.type === 'paragraph'">
                        <textarea
                            v-model="block.data.text"
                            @input="heightSync($event)"
                            @change="heightSync($event)"
                            @paste="heightSync($event)"
                        ></textarea>
                    </div>
                    <div
                        v-else-if="block.type === 'image'"
                        class="image"
                        :class="{
                            'draggable-image': index === imageDragIndex,
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
                    <div v-else-if="block.type === 'drag'" class="drag-element">
                        <img :src="`${$config.APP_URL}/${cursorImage}`" >
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
                <tool-tip :position="'bottom'" :color="'pink'">
                    <template v-slot:content>
                        Загрузить фотографию к отзыву
                    </template>
                    <div class="edit-panel__button" @click.prevent="showAddImageModal">
                        <fa icon="camera"></fa>
                        <span>Вставить фото</span>
                    </div>
                </tool-tip>

                <tool-tip :position="'bottom'" :color="'pink'">
                    <template v-slot:content>
                        Вставить ссылку в текст отзыва
                    </template>
                    <div class="edit-panel__button">
                        <fa icon="link"></fa>
                        <span>Добавить ссылку</span>
                    </div>
                </tool-tip>
                <tool-tip :position="'bottom'" :color="'pink'">
                    <template v-slot:content>
                        Сохранить текущий отзыв в черновики
                    </template>
                    <div class="edit-panel__button" @click="emit('saveAsDraft')">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 50 50" fill="currentColor">
                            <path d="M47.9,11.1L37.7,0.6c-0.1-0.1-0.2-0.2-0.3-0.2l-0.3-0.2l0,0c-0.1-0.1-0.3-0.1-0.3-0.1c-0.1,0-0.2-0.1-0.3-0.1   c-0.1,0-0.2,0-0.4,0H3.7C2.4,0,1.3,1.1,1.3,2.4v45.2c0,1.3,1.1,2.4,2.4,2.4h42.6c0.4,0,0.7-0.1,1-0.2c0.9-0.4,1.4-1.2,1.4-2.2V12.9   C48.7,12.2,48.4,11.5,47.9,11.1z M9.2,13.3c0-1.2,0.9-2.2,2.1-2.2h18.4c1.2,0,2.1,1,2.1,2.2s-0.9,2.2-2.1,2.2H11.3   C10.2,15.5,9.2,14.5,9.2,13.3z M35.7,41.8H14.5c-2.9,0-5.3-2.4-5.3-5.3v0c0-2.9,2.4-5.3,5.3-5.3h21.2c2.9,0,5.3,2.4,5.3,5.3v0   C41,39.4,38.6,41.8,35.7,41.8z"/>
                        </svg>
                        <span>В черновик</span>
                    </div>
                </tool-tip>
            </div>
        </div>
<!--        {{ modelValue }}-->

        <modal v-model:isShowModal="isShowAddImageModal" :width="30">
            <template v-slot:header>
                <h3>Добавление новой фотографии</h3>
            </template>
            <p>
                Все большие фото автоматически уменьшаются до ширины отзыва. Если же Ваша фотография очень большая (более 4000 пикселей в ширину) и ее не получается вставить, то попробуйте уменьшить ее сначала в любом графическом редакторе до 2000 пикселей в ширину.
            </p>
            <br>
            <input @change="setImage($event)" type="file" accept="image">
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
import toolTip from '~/components/tool-tip';
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
    if (target.scrollTop >= 0) {
        target.style.height = target.scrollHeight + "px";
    }
    // target.style.cssText = 'height:auto; padding:0';
    // target.style.cssText = 'height:' + event.target.scrollHeight + 'px';
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

    const element = event.target;

    const shiftX = event.pageX - getCoords(element).left;
    const shiftY = event.pageY - getCoords(element).top;
    const containerLeft = getCoords(container.value).left;
    const containerTop = getCoords(container.value).top;
    const containerHeight = container.value.offsetHeight;
    const containerWidth = container.value.offsetWidth;

    const halfHeightInContainer = getCoords(element).top - containerTop + element.parentNode.parentNode.offsetHeight / 2;

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

        const children = Object.values(container.value.children);

        for (let i = 0; i < children.length; i++) {
            const halfHeight = getCoords(children[i]).top - containerTop + children[i].offsetHeight / 2;
            if (children[i].classList.contains('block__image') || children[i].classList.contains('drag')) {
                insertedIndex.value = null;
                continue;
            } else if (mouseTop < halfHeight && mouseTop < halfHeightInContainer &&  halfHeight < halfHeightInContainer) {
                insertedIndex.value = i;
                break;
            } else if (mouseTop > halfHeight && mouseTop > halfHeightInContainer && halfHeight > halfHeightInContainer) {
                insertedIndex.value = i + 1;
                break;
            }

        }

        if (null === insertedIndex.value) {
            cursor.value.style.cssText = `top: ${mouseTop}px; left: ${left}px; display:block; height:150px; width: 200px; transform: translate(-50%, -50%);`;
        } else {
            cursor.value.style.cssText = '';
        }
        // && imageDragIndex.value !== i
        // console.log(insertedIndex.value);
    }


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
        if (insertedIndex.value !== null) {
            const replace = localBody.value.blocks.splice(imageDragIndex.value, 1);
            console.log(replace);
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

watch(insertedIndex, (value, oldValue) => {
    console.log(value, oldValue);
    if (oldValue !== null && oldValue !== imageDragIndex.value) {
        localBody.value.blocks.splice(oldValue, 1);
    }
    if (value !== null && value !== imageDragIndex.value) {
        localBody.value.blocks.splice(value, 0, { type: 'drag'});
    }
});

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
    &__content {
        position: relative;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) inset;
        outline: 1px solid rgb(192, 201, 240);
        min-height: 300px;
        margin-bottom: 10px;
        padding: 5px;
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
.drag-element {
    height: 150px;
    width: 200px;
    & img {
        height: 100%;
        width: 100%;
        object-fit: cover;
    }
}
.edit-panel {
    display: flex;
    gap: 15px;
    color: #13709b;
    &__button {
        cursor: pointer;
        display:flex;
        align-items: center;
        gap: 5px;
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

.draggable-image {
    opacity: 0.3;
    cursor: move;
    & .image-layer {
        display: none !important;
    }
}
</style>
