<template>
    <textarea v-model="currentValue" class="textarea"></textarea>
</template>

<script setup>
    const emit = defineEmits(['update:modelValue']);
    const props = defineProps({
        modelValue: {
            type: String,
        },
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
    .textarea {
        width: 100%;
        resize: vertical;
        outline: #000 none medium;
        overflow: visible;
        transition: background-color 0.3s ease 0s, border-color 0.3s ease 0s;
        border: 1px solid transparent;
        border-radius: 8px;
        padding: 8px;
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
    }
</style>