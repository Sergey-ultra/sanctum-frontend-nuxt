<template>
    <select
        v-model="currentValue"
        :multiple="multiple"
        class="select"
        :class="{
                 [`select--${color}`]: Boolean(color)
            }"
    >
        <option
            v-for="option in preparedOptions"
            :key="option.value"
            :value="option.value"
        >
            {{ option.title }}
        </option>
    </select>
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
    disabled : {
        type: Boolean,
        default: false,
    },
    /**
     * Возможность выбрать несколько опций
     */
    multiple: {
        type: Boolean,
        default: false,
    },
    items: {
        type: Array,
        default: () => [],
    },
    itemTitle: {
        type:String,
        default: null
    },
    itemValue: {
        type:String,
        default: null
    },

});

let preparedOptions = computed(() => {
    return props.items.map(option => {
        let obj;
        if (typeof option === 'object' && props.itemTitle && props.itemValue) {
            obj = {
                title: option[props.itemTitle],
                value: option[props.itemValue],
            };
        } else {
            obj = {
                title: option,
                value: option,
            };
        }
        return obj;
    })
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

<style scoped lang="scss">
.select {
    width: 100%;
    outline: #000 none medium;
    overflow: visible;
    transition: background-color 0.3s ease 0s, border-color 0.3s ease 0s;
    border: 1px solid transparent;
    border-radius: 8px;
    padding: 8px 10px;
    background-color: rgb(240, 242, 252);
    &:hover {
        border-color: rgb(192, 201, 240);
        transition: border-color 0.3s ease 0s;
    }
    &:focus {
        background-color: white;
        border-color: rgb(59, 87, 208);
        transition: background-color 0.3s ease 0s, border-color 0.3s ease 0s;
    }
    &--white {
        background-color: white;
        width: 100%;
        border-radius: 8px;
        border: 1px solid #d9d9d9;
        color: #333;
        outline: none;

        &:focus {
            border-color: #3b57d0;
            transition: background-color .3s ease 0s, border-color .3s ease 0s;
        }
    }
}
</style>
