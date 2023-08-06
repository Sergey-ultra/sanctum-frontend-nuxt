<template>
    <div>
        <div class="header">
            <buttonComponent :color="'gray'" @click="messageStore.setLastMessageId(null)">
                <fa icon="arrow-left"></fa>
            </buttonComponent>

            <div class="avatar">
                <img :src="`${$config.APP_URL}/${dialogAvatar}`" :alt="dialogUser">
            </div>
            <div class="user-name">{{ dialogUser }}</div>
        </div>
        <div v-for="message in messages"
             :key="message.id"
             :class="{ 'message-isMine': message.is_mine }"
             class="message">

            <div :class="{ 'message__body-isMine': message.is_mine }" class="message__body">
                <div class="user-name">
                    {{ message.user_name }}
                </div>
                <span v-if="message.type === 'add-sku'">
                       Объект {{ message.data.name }} был создан по Вашей заявке. Если Вы еще не написали отзыв по нему, то можете воспользоваться ссылкой:
                       <nuxt-link :to="`/product/${message.data.sku_code}/add-review`">
                          добавить свой отзыв на "{{ message.data.name }}"
                       </nuxt-link>.
                </span>
                {{ message.message }}
                <div class="time-box">
                    <span>{{ message.created_at }}</span>
                </div>
            </div>
        </div>
        <messageForm/>
    </div>
</template>
<script setup>
import buttonComponent from '~/components/button-component.vue';
import messageForm from '~/components/message/form.vue';
import {useMessageStore} from "~/store/message";
import {storeToRefs} from "pinia";



const messageStore = useMessageStore();
const { lastMessageId, isLoadingChat, messages, dialogUser, dialogAvatar } = storeToRefs(messageStore);

onMounted(() => {
    messageStore.loadChatByMessageId(lastMessageId.value);
})
</script>
<style scoped lang="scss">
.header {
    display: flex;
    align-items: center;
    gap:15px;
    margin-bottom: 20px;
}
.message {
    display: flex;
    gap: 8px;
    margin: 8px 50px 8px 0;
    &-isMine {
        margin: 8px 0 8px 50px;
    }
    &__body {
        flex-grow: 1;
        position: relative;
        padding: 16px;

        cursor: pointer;
        overflow: hidden;
        background-color: #f1f1f1;
        border-radius: 12px;

        &-isMine {
            background-color: #e5f4df;
        }
    }
}

.avatar {
    flex-shrink:0;
    width: 35px;
    height: 35px;
    & img {
        border-radius: 50%;
        overflow: hidden;
        height: 100%;
        width: 100%;
        object-fit: cover;
    }
}

.user-name {
    margin-bottom: 4px;
    font-weight: bold;
    font-size: 14px;
}
.time-box {
    text-align: right;
    color: #8d9399;
    font-size: smaller;
}
.open {
    margin-right: 15px;
}
</style>
