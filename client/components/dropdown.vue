<template>
    <div class="drop" >
        <slot name="activator" :on="showDropdown" :off="hideDropdown"></slot>

        <div
            v-if="isShowDropdown"
            :class="{'triangle': isShowTriangle}"
            :style="topStyle"
            ref="dropdownBox"
            class="drop__inner" >
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
        isShowTriangle: {
            type: Boolean,
            default: true,
        },
        isRight: {
            type: Boolean,
            default: false,
        }
    });
    const isShowDropdown = ref(false);
    const dropdownBox = ref(null);

    const topStyle = computed(() => {
        let style = '';
        if (props.isShowTriangle) {
            style =  'top: calc(100% + 11px);';
        } else {
            style = 'top:100%';
        }
        if (props.isRight) {
            style += 'right:0;';
        }
       return style;
    })

    const outsideClick = event => {
        if (!dropdownBox.value.contains(event.target)) {
            event.stopPropagation();
        }
        isShowDropdown.value = false;
    };

    const showDropdown = event => {
        isShowDropdown.value = true;
        document.addEventListener('click',outsideClick, {capture: true, once: true});
    };

    const hideDropdown = () => isShowDropdown.value = false;

</script>

<style scoped lang="scss">
    .drop {
        z-index: 81;
        position: relative;
        &__inner {
            position: absolute;
            z-index: 1099;
            background-color: #fff;
            background-clip: padding-box;
            border-radius: 8px;
            box-shadow: 0 5px 46px rgba(0,0,0,.12),0 7px 15px rgba(0,0,0,.12);
        }
    }

    .triangle {
        &:before {
            content: ' ';
            position: absolute;
            width: 0;
            height: 0;
            left: 85%;
            bottom: 100%;
            transform: translateX(-50%);
            border: 11px solid transparent; /* Прозрачные границы */
            border-bottom: 11px solid #999999;
        }
        &:after {
            content: ' ';
            position: absolute;
            width: 0;
            height: 0;
            left: 85%;
            bottom: 100%;
            transform: translateX(-50%);
            border: 10px solid transparent; /* Прозрачные границы */
            border-bottom: 10px solid #fff;
        }
    }
</style>
