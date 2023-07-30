<template>
    <div>
        <div class="balance">
            Всего доступно к выводу
            <span class="green-text">{{ $api.$user.balance }}</span>
        </div>
        <form @submit.prevent="chargeMoney">
            <div class="form__group">
                <label>
                    <div class="label">
                        <span class="text-gray">Заказать выплату</span>
                    </div>
                    <inputComponent v-model="charge.amount" :color="'white'"/>
                </label>
                <div class="invalid-feedback" v-for="error of v$.charge.amount.$errors" :key="error.$uid">
                    {{ error.$message }}
                </div>
            </div>
            <div class="form__group">
                <div class="label">
                    <span class="text-gray">Выбрать или добавить телефон</span>
                </div>
                <div>
                   <div
                       v-for="wallet in wallets"
                       :key="wallet.id"
                        class="wallet">
                       <radioComponent
                           v-model="charge.wallet_id"
                           :value="wallet.id">
                           <span>{{ wallet.name }}</span>
                       </radioComponent>
                   </div>
                </div>


                <div class="invalid-feedback" v-for="error of v$.charge.wallet_id.$errors" :key="error.$uid">
                    {{ error.$message }}
                </div>
                <div @click="toggleNewWalletForm" class="newWallet">+ Добавить телефон</div>
                <div v-if="isShowNewWalletForm" class="newWallet__form">
                    <h3>Добавление телефона</h3>
                    <span @click="hideNewWalletForm" class="newWallet__close">✕</span>

                    <div class="form__group">
                        <inputWithMask v-model="to" :mask="'+7 (###) ###-##-##'" :color="'white'"/>
                    </div>

                    <buttonComponent @click="addNewWallet" :radius="true" :color="'yellow'">
                        Добавить
                    </buttonComponent>
                </div>
            </div>

            <buttonComponent type="submit" :radius="true">
                Подать заявку
            </buttonComponent>
        </form>
        <div v-if="myCharges.length">
            <h3>История выплат</h3>
            <div class="table__row table__row-header">
                <div class="table__item width">Дата заявки</div>
                <div class="table__item width">Дата выплаты</div>
                <div class="table__item width">Кошелек</div>
                <div class="table__item width">Заказано</div>
                <div class="table__item width">Сумма к выплате</div>
                <div class="table__item width">Статус</div>
            </div>
            <div
                v-for="(charge, index) in myCharges"
                :key="charge.id"
                :class="{'table__row-even': (index + 1) % 2 === 0}"
                class="table__row">
                <div class="table__item width">{{ charge.created }}</div>
                <div class="table__item width">{{ charge.payment_date }}</div>
                <div class="table__item width">{{ charge.wallet }}</div>
                <div class="table__item width">{{ charge.amount }}</div>
                <div class="table__item width">{{ charge.amount }}</div>
                <div class="table__item width">{{ charge.status }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import inputWithMask from '~/components/input-with-mask.vue';
import buttonComponent from '~/components/button-component.vue'
import radioComponent from '~/components/radioComponent.vue'
import {helpers, numeric, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {useUserStore} from "~/store/user";
import {storeToRefs} from "pinia";
import {useNuxtApp} from "#app";


const userStore = useUserStore();
const { wallets, myCharges } = storeToRefs(userStore);
const { $api } = useNuxtApp();

const charge = ref( {
    amount: $api.$user.balance,
    wallet_id: null,
});
const to = ref('');
const isShowNewWalletForm = ref(false);

const isNull = value => Number(value) !== 0;
const isEnough = value => Number(value) <= $api.$user.balance;



let rules = {
    charge: {
        amount: {
            numeric: helpers.withMessage('Должно быть число', numeric),
            isEnough: helpers.withMessage('Сумма превышает доступные средства', isEnough),
            isNull: helpers.withMessage('Сумма не должна быть равна нулю', isNull),
        },
        wallet_id: {
            required: helpers.withMessage('Поле должно быть заполнено', required),
            numeric: helpers.withMessage('Должно быть число', numeric),
        }
    },
};

const v$ = useVuelidate(rules, {charge});


watch(wallets, value => {
    if (value.length) {
        charge.value.wallet_id = wallets.value[0].id;
    }
})
const clearForm = () => {
    charge.value = {
        amount: 0,
        wallet_id: null,
    };
}


const toggleNewWalletForm = () => isShowNewWalletForm.value = !isShowNewWalletForm.value;
const hideNewWalletForm = () => {
    isShowNewWalletForm.value = false;
    to.value = '';
}

const addNewWallet = async () => {
    await userStore.addNewWallet({ to: to.value });
    isShowNewWalletForm.value = false;
    to.value = '';
};
const chargeMoney = async () => {
    if (!$api.isAuth.value) {
        $api.setIsShowAuthModal(true, 'Чтобы вывести средства, авторизуйтесь');
    } else {
        const validated = await v$.value.$validate();

        if (validated) {
            await userStore.chargeMoney(charge.value);
            const newBalance = $api.$user.balance - charge.value.amount;

            $api.updateUserBalance(newBalance);
            $api.$toast.setSuccess('Деньги поступят в течении пяти рабочих дней');
            clearForm();
            v$.value.$reset();
        }
    }
}
onMounted(() => {
    userStore.loadUserWallets();
    userStore.loadUserCharges();
});
</script>
<style scoped lang="scss">
$greenColor: #46bd87;
.balance {
    width: 50%;
    font-size: 20px;
    text-transform: uppercase;
}
.green-text {
    color: $greenColor;
}
.wallet {
    border-bottom: solid 1px #e4e6e8;
}
.width {
    width: calc(100% / 6);
}
.newWallet {
    cursor: pointer;
    font-size: 18px;
    font-weight: 600;
    margin: 8px 8px 20px 8px;
    display: block;
    &__form {
        position: relative;
        border: 1px dashed #d9d9d9;
        margin: 12px 0;
        border-radius: 4px;
        padding: 10px;
    }
    &__close {
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 0;
        font-size: 1.5rem;
        font-weight: 700;
        line-height: 1;
        color: #000;
        text-shadow: 0 1px 0 #fff;
        opacity: 0.5;
        padding: 15px;
        border-style: none;
        background-color: transparent;
    }
}
</style>
