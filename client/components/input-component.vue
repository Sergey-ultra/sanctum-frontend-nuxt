<template>
    <div class="wrapper">
        <input
            class="input"
            type="text"
            v-model="currentValue"
            :class="{
                 [`input--${color}`]: Boolean(color)
            }"
            :placeholder="placeholder"
            :readonly="readonly"
            :disabled="disabled"
        >
        <div v-if="isLoading" class="wrapper__layer">
            <loader :color="'blue'"></loader>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['update:modelValue']);
const props = defineProps({
    modelValue: {
        type: String,
    },
    color: {
        type: String,
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
    placeholder: String,
    readonly: {
        type: Boolean,
        default: false,
    },
    disabled :{
        type: Boolean,
        default: false,
    }
});

let currentValue = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    }
});
</script>

<style lang="scss" scoped>
.wrapper {
    width: 100%;
    position: relative;
    &__layer {
        position: absolute;
        width: 50px;
        right: 0;
        top: 0;
        bottom: 0;
        & * {
            height: 100%;
        }
    }
}
.input {
    width: 100%;
    outline: none;
    overflow: visible;
    transition: background-color 0.3s ease 0s, border-color 0.3s ease 0s;
    border: 1px solid transparent;
    border-radius: 8px;
    height: 35px;
    padding: 4px 10px;
    background-color: rgb(240, 242, 252);

    &:hover {
        border-color: rgb(192, 201, 240);
    }
    &:focus {
        background-color: white;
        border-color: rgb(59, 87, 208);
    }
    &--white {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) inset;
        background-color: white;
        border: 1px solid #d9d9d9;
        color: #333;

        &:focus {
            border-color: #3b57d0;
        }
    }
}
</style>
