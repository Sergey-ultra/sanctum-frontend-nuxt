<template>
    <div class="relative">
        <div
            class="tool-tip"
            :style="positionStyle"
            :class="{
                [`tool-tip--${color}`]: Boolean(color),
            }">
            <slot name="content"></slot>
        </div>
         <slot class="slot"> </slot>
    </div>
</template>

<script setup>
    const props = defineProps({
        position: {
            type: String,
            default: 'right',
        },
        color: {
            type: String,
        }
    });

    const positionStyle = computed(() => {
        if (['right', 'left'].includes(props.position)) {
            return `top: 50%;transform: translateY(-50%);${props.position}: calc(100% + 2px);`
        } else if (['top', 'bottom'].includes(props.position)) {
            return ` left: 50%; transform: translateX(-50%);${props.position}: calc(100% + 2px);`
        }
    });

</script>

<style lang="scss" scoped>
    .relative {
        position: relative;

        &:hover .tool-tip {
            display:flex;
        }
    }

    .tool-tip {
        font-size: 15px;
        z-index:4;
        white-space: nowrap;
        padding: 2px 10px;
        display:none;
        position: absolute;
        background-color: #000;
        color: #fff;
        border-radius: 8px;
        &--pink {
            background-color: #982971;
        }
    }
    .slot {
        height:100%;
        width:100%;
    }
</style>
