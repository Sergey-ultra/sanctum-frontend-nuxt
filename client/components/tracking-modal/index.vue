<template>
    <modal v-model:isShowModal="isShowTrackingModalLocal">
        <template v-slot:header>
            <h3 v-if="!isSuccessToAddingToTrackingSkuIds">Следите за снижением цены</h3>
            <h3 v-else>Готово!</h3>
        </template>


        <div v-if="!isSuccessToAddingToTrackingSkuIds">
            <div class="description">
                Оставьте свой адрес — как только цена на товар снизится, вы сразу об этом узнаете
            </div>
            <form class="form" @submit.prevent="add">
                <div class="form__item">
                    <input class="input" type="text" v-model.trim="mail" placeholder="email">
                    <div class="invalid-feedback" v-for="error of v$.mail.$errors" :key="error.$uid">
                        {{ error.$message }}
                    </div>
                </div>
                <button class="button">Подписаться</button>
            </form>
            <div class="text">Нажимая «Подписаться», я соглашаюсь с условиями
                <nuxt-link :to="{ name:'policy' }" target="_blank">
                    Политики конфиденциальности
                </nuxt-link>
            </div>
        </div>

        <div v-else>
            <div class="description">
                Теперь вы обязательно узнаете, когда цена на
                <span class="description__product">{{ currentSku.name }} </span>
                снизится
            </div>
            <button class="button" @click="closeTrackingModal">Хорошо</button>
        </div>

    </modal>
</template>

<script setup>
    import modal from '../modal'
    import useVuelidate from '@vuelidate/core'
    import { required, email } from '@vuelidate/validators'
    import {useTrackingStore} from "../../store/tracking";
    import { storeToRefs } from "pinia";


    const mail = ref('');
    const rules = {
        mail: {required, email}
    };
    const v$ = useVuelidate(rules, mail);

    const emit = defineEmits(['update:isShowTrackingModal']);

    const props = defineProps({
        isShowTrackingModal: {
            type: Boolean,
            default: false
        },
        currentSku: {
            type: Object,
            default: () => {}
        }
    });

    const trackingStore = useTrackingStore();
    const { isSuccessToAddingToTrackingSkuIds } = storeToRefs(trackingStore);


    const isShowTrackingModalLocal = computed({
        get() {
            return props.isShowTrackingModal;
        },
        set(value) {
           emit('update:isShowTrackingModal', value);
        }
    });


    const closeTrackingModal = () => isShowTrackingModalLocal.value = false;

    const add = async () => {
        const isValidate = await v$.value.mail.$validate();

        if (isValidate) {
            trackingStore.addToTracking({email: mail.value, sku_id: props.currentSku.id});
        }
        v$.value.$reset();
    };


    watch(isShowTrackingModalLocal, value => {
            if (!value) {
                trackingStore.setIsSuccessToAddingToTrackingSkuIds(false);
            }
        }
    );

    onBeforeMount(() => trackingStore.checkTrackingSkuIds());
</script>

<style lang="scss" scoped>
    .input {
        height: 38px;
        width: 100%;
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

    .button {
        height: 38px;
        background-color: #fc0;
        border: none;
        color: #333;
        border-radius: 8px;
        transition: background-color 0.3s ease 0s, border-color 0.3s ease 0s;
        padding: 8px 30px;
        font-size: 18px;
        &:hover {
            background-color: #f5c423;
        }
    }
    .description {
        margin: 20px 0;
        &__product {
            font-weight: 700;
            font-size: 16px;
            line-height: 24px;
            letter-spacing: 0;
        }
    }
    .form {
        display: flex;
        justify-content: space-between;
        &__item {
            width: 100%;
            margin-right: 12px;
        }
    }
    .text {
        display:block;
        margin-top: 28px;
    }
</style>