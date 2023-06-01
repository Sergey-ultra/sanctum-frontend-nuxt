<template>
    <div class="up">
        <button class="up__btn" @click="$emit('addLike')">
            <div class="up__icon">
                <svg>
                    <use xlink:href="#icons_thumb-up">
                        <symbol viewBox="0 0 24 24" id="icons_thumb-up">
                            <path fill-rule="evenodd" d="M19.88 8.318c.61 0 1.103.495 1.103 1.107v.044a16.864 16.864 0 0 1-.82 4.253l-.002.009a16.834 16.834 0 0 1-2.716 5.076l-.002.002-.16.19H8.909V9.57l4.859-5.808.003-.004a4.77 4.77 0 0 0 .774-1.447l.002-.007a4.84 4.84 0 0 0 .235-1.22c.2-.2.474-.323.778-.323.569 0 .956.38 1.188 1.025.276.77.252 1.642.252 1.642a4.828 4.828 0 0 1-1.043 3l.002.002-1.6 1.889h5.522zM4 18.999V9.57h3.272V19H4z"></path>
                        </symbol>
                    </use>
                </svg>
            </div>
            <span class="up__plus">{{ likes }}</span>
        </button>
    </div>
</template>

<script setup>

    const emit = defineEmits(['addLike'])

    const props = defineProps({
        likes: {
            type: Number,
            default: 0
        }
    });

</script>

<style lang="scss" scoped>
    .up {
        &__btn {
            line-height: 36px;
            height: 36px;
            padding: 0 10px 10px 12px;
            border: 0;
            border-radius: 4px;
            position: relative;
            background-color: transparent;

            & svg {
                fill: rgba(0, 0, 0, .4);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 20px;
                height: 20px;
            }
        }
        &__icon {
            display: inline-block;
            vertical-align: middle;
            height: 32px;
            width: 30px;
        }
        &__plus {
            font-weight: 400;
            font-style: normal;
            font-stretch: normal;
            font-size: 14px;
            line-height: 20px;
        }
    }
</style>
