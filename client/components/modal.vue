<template>
    <Teleport to="body">
        <div class="modal__layer" v-if="isShowModal" ref="modal">
            <transition name="popup" mode="out-in">
                <div class="modal__dialog" :style="{'width': `${widthLocal}%`}" ref="modalWrapper">
                    <div class="modal__header">
                        <slot name="header"></slot>
                        <button class="modal__close" @click="hide">
                            <span >✕</span>
                        </button>
                    </div>
                    <div class="modal__content">
                        <slot></slot>
                    </div>

                    <div class="modal__actions">
                        <slot name="buttons"></slot>
                    </div>
                </div>
            </transition>
        </div>
    </Teleport>
</template>

<script setup>
    const modalWrapper = ref(null);
    const emit = defineEmits(['update:isShowModal']);
    const props = defineProps({
        isShowModal: Boolean,
        width: {
            type: Number
        }
    });
    let widthLocal = computed(() => {
        if (!props.width && document) {
            const width = document.documentElement.clientWidth

            if (width < 1470 && width > 1200) {
                return 30;
            }
            if (width < 1200 && width > 900) {
                return 35;
            }
            if (width < 900 && width > 700) {
                return 50;
            }
            if (width < 700 && width > 500) {
                return 70;
            }

            if (width < 500) {
                return 95;
            }
        }
        return props.width;
    });

    watch(() => props.isShowModal, value => {
            if (value) {
                document.addEventListener('click', closeModal, {capture: true});
                document.body.style.overflow = "hidden";
            } else {
                document.removeEventListener('click', closeModal, {capture: true});
                document.body.style.overflow = "";
            }
        }
    );

    const closeModal = event => {
        if (!modalWrapper.value.contains(event.target)) {
            emit('update:isShowModal', false);
            document.removeEventListener('click', closeModal, {capture: true});
        }
    };

    const hide = () => emit('update:isShowModal', false);

    onUnmounted(() => document.removeEventListener('click', closeModal, { capture: true }));
</script>

<style lang="scss" scoped>
    .modal {
        &__layer {
            background-color:rgba(33, 33, 33, 0.46);
            display:block;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 200;
            width: 100%;
            height: 100vh;
            overflow: hidden;
            outline: 0;
        }
        &__dialog {
            overflow:hidden;
            display: flex;
            flex-direction: column;
            max-height: 95%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius:5px;
            background-color: #fff;
            & > div {
                flex: 0 0 auto;
            }
        }
        &__header {
            padding: 0 25px;
            display: flex;
            justify-content: space-between;
        }
        &__close {
            cursor: pointer;
            float: right;
            font-size: 1.5rem;
            font-weight: 700;
            line-height: 1;
            color: #000;
            text-shadow: 0 1px 0 #fff;
            opacity: .5;
            padding: 0;
            border-style: none;
            background-color: transparent;
        }
        &__content {
            flex: 0 1 auto;
            overflow-x:hidden;
            overflow-y: auto;
            padding: 0 25px;
        }
        &__actions {
            margin-top: 15px;
            margin-bottom: 25px;
            align-items: center;
            display: flex;
            justify-content: flex-end;
            padding: 0 25px;
        }
    }



    .popup-enter-active,
    .popup-leave-active {
        transition: all 0.4s ease;
    }
    .popup-enter-from,
    .popup-leave-to {
        transform: translateY(-100px);
    }
</style>
