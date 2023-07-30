<template>
    <div class="inner">
        <h2 class="title">Баланс</h2>

        <chargeMoney  v-if="isShowForm"/>
        <div v-else>
            <div  class="flex">
                <span class="balance text-gray">На Вашем счёте:</span>
                <div class="balance__main">
                    <span class="balance__value green-text">{{ $api.$user.balance }} ₽</span>
                    <a class="flex withdrawal" @click="showFormModal">
                        <svg class="balance__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                            <path d="M33.6,9.2l3.6-6.5c0.3-0.5,0.4-1.2,0.1-1.7C36.9,0.3,36.4,0,35.7,0H13.1c-0.6,0-1.2,0.4-1.5,0.9
                                            c-0.3,0.6-0.2,1.3,0.2,1.8l4.6,6.5C12.7,12.7,2.1,24.1,2.1,39.5C2.1,45.3,6.8,50,12.6,50h24.8c5.8,0,10.5-4.7,10.5-10.5
                                            C47.9,23.9,37.2,12.5,33.6,9.2z M35.4,29.2c-0.6,1.1-1.4,1.9-2.3,2.5c-0.9,0.6-2,1-3.3,1.3c-1.2,0.2-2.4,0.4-3.9,0.4H21v4h10.1v2.8
                                            H21v3.1h-3.8v-3h-2v-2.8h2v-4h-2v-3.4h2V17.7h8.9c2.5,0,4.5,0.3,5.8,0.8c1.3,0.5,2.4,1.4,3.2,2.7c0.8,1.3,1.2,2.7,1.3,4.3
                                            C36.3,26.9,36,28.2,35.4,29.2z"/>
                            <path d="M30.6,22c-0.5-0.4-1.1-0.6-2-0.8c-0.8-0.1-1.5-0.2-2.3-0.2h-5.2v9.3h4.8c0.9,0,1.7-0.1,2.5-0.2
                                            c0.8-0.2,1.5-0.4,2-0.8c0.6-0.3,1-0.8,1.4-1.4l0,0c0.4-0.7,0.5-1.3,0.5-2.2c0-0.8-0.2-1.5-0.5-2.2C31.5,22.8,31.1,22.3,30.6,22z"/>
                        </svg>
                        <span>Вывести средства</span>
                    </a>
                </div>
            </div>

            <div class="flex">
                <span class="balance text-gray">Реферальная ссылка: *</span>
                <div class="balance__main">
                    <inputComponent v-model="$api.$user.ref_link" :disabled="true"/>
                </div>
            </div>

            <div class="flex">
                <span class="balance text-gray">Количество приглашенных авторов:</span>
                <span v-if="$api.$user.number_of_invited_authors === 0">Вы не пригласили ни одного автора!</span>
                <span v-else class="balance__value green-text">{{ $api.$user.number_of_invited_authors }}</span>
            </div>

            <div class="flex">
                <span class="balance text-gray">Доход по реферальной программе: **</span>
                <span class="balance__value green-text">{{ $api.$user.ref_balance }} ₽</span>
            </div>

            <div class="alertframe">
                <div>* Вы можете рассказать друзьям и знакомым о нашем сайте, используя свою реферальную ссылку и получать дополнительную прибыль: +15% от заработка приглашенного автора! При активном участии в привлечении новых авторов, доходы по реферальной программе могут превышать Ваши доходы от отзывов.</div>
                <div>** Внимание! Реферальная программа распространяется ТОЛЬКО на вознаграждение от просмотров отзывов. На прибыль от бонусов, реферальная программа не распространяется, согласно п.3.1 правил.</div>
            </div>
        </div>

        <modal v-model:isShowModal="isShowWithdrawalModal">
            <template v-slot:header>
                <h3>Внимание</h3>
            </template>
            <div>
                <p>Вывести денежные средства можно при достижении минимальной суммы на балансе:</p>
                <p>для первой выплаты - <b>200 ₽</b>,</p>
                <p>для всех последующих - <b>100 ₽</b>.</p>
                <p>Средства выплачиваются на банковский счет по Вашему номеру телефона или Юмани.</p>
            </div>
        </modal>
    </div>
</template>
<script setup>
import modal from '~/components/modal.vue';
import inputComponent from '~/components/input-component.vue';
import { useNuxtApp } from "#app";


const min = Object.freeze({
    FIRST: 200,
    NEXT: 100,
});



const { $api } = useNuxtApp();

const isShowForm = ref(false);
const isShowWithdrawalModal = ref(false);


const showFormModal = () => {
   if ($api.$user.balance >= min.FIRST && $api.$user.is_first_charge) {
       isShowWithdrawalModal.value = true;
   } else {
       isShowForm.value = true;
   }
}


</script>
<style scoped lang="scss">
$mainFontColor: #26325c;
$greenColor: #46bd87;

.inner {
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.16);
    background-color: #fff;
    flex-wrap: wrap;
    height: 100%;
}
.title {
    color: $mainFontColor;
    font-size: 28px;
    font-weight: 600;
}
.flex {
    display:flex;
    align-items: center;
    gap: 3px;
    margin-bottom: 20px;
}
.withdrawal {
    cursor: pointer;
}
.alertframe {
    padding: 16px;
    border-radius: 2.5px;
    background-color: #ebeff2;
}
.balance {
    width: 50%;
    font-size: 20px;
    text-transform: uppercase;
    &__value {
        font-size: 20px;
        font-weight: 600;
    }
    &__main {
        width: 50%;
        display:flex;
        justify-content: space-between;
    }
    &__icon {
        width: 16px;
        height: 16px;
    }
}
.green-text {
    color: $greenColor;
}
</style>
