<template>
    <div class="down">
        <button class="down__btn">
            <div class="down__icon">
                <svg>
                    <use xlink:href="#icons_thumb-down">
                        <symbol viewBox="0 0 24 24" id="icons_thumb-down">
                            <path fill-rule="evenodd" d="M4.102 15.682A1.105 1.105 0 0 1 3 14.575v-.044c.094-1.478.37-2.903.82-4.253l.002-.01a16.833 16.833 0 0 1 2.716-5.075l.002-.003.159-.19h8.375v9.43l-4.858 5.809-.003.004a4.77 4.77 0 0 0-.774 1.447l-.002.006a4.84 4.84 0 0 0-.235 1.22c-.2.2-.474.324-.778.324-.57 0-.957-.38-1.188-1.025-.276-.77-.252-1.642-.252-1.642 0-1.135.392-2.176 1.043-3l-.003-.002 1.6-1.889H4.103zM16.71 14.43V5h3.273v9.43H16.71z"></path>
                        </symbol>
                    </use>
                </svg>
            </div>
            <span class="down__value">{{ likesDown }}</span>
        </button>
    </div>
</template>

<script setup>
const props = defineProps({
    likesDown: {
        type: Number,
        default: 0
    }
});
</script>

<style lang="scss" scoped>
    .down {
        &__btn {
            line-height: 36px;
            height: 36px;
            padding: 0 10px 10px 12px;
            border: 0;
            border-radius: 4px;
            position: relative;
            background-color: transparent;
            & svg {
                fill: rgba(0,0,0,.4);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
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
        &__value {
            font-weight: 400;
            font-style: normal;
            font-stretch: normal;
            font-size: 14px;
            line-height: 20px;
        }
    }
</style>