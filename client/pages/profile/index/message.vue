<template>
    <div class="wrapper">
        <div v-if="lastMessageId">
            <messageList/>
        </div>
        <div v-else>
            <h2 class="title">Сообщения</h2>
            <div
                class="chat"
                v-for="message in chats"
                :key="message.id"
                @mouseover="setOpenChat(message.id)"
                @mouseout="setOpenChat(null)"
                @click="openChat(message.id)"
            >
                <div class="avatar">
                    <img :src="message.avatar" alt="">
                </div>
                <div class="body">
                    <div class="user-name">
                        {{ message.user_name }}
                    </div>
                    <div>
                        <span v-if="message.type === 'add-sku'">
                            Объект {{ message.data.name }} был создан по Вашей заявке. Если Вы еще не написали отзыв по нему, то можете воспользоваться ссылкой:
                            <nuxt-link :to="`/product/${message.data.sku_code}/add-review`">
                                добавить свой отзыв на "{{ message.data.name }}"
                            </nuxt-link>.
                        </span>
                        <span v-else-if="message.type === 'feedback'">
                            {{ message.message }}
                        </span>
                        <div class="time-box">
                            <span class="open" v-if="openChatId === message.id">Открыть беседу</span>
                            <span>{{ message.created_at }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import messageList from '~/components/message/list.vue';
import {useMessageStore} from "~/store/message";
import {storeToRefs} from "pinia";

const messageStore = useMessageStore();
const { chats, lastMessageId } = storeToRefs(messageStore);

const openChatId = ref(null);

const setOpenChat = id => openChatId.value = id;

const openChat = id => {
    messageStore.setLastMessageId(id);
}

onMounted(async () => {
    await messageStore.loadChats();
});
</script>
<style scoped lang="scss">
.wrapper {
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.16);
    background-color: #fff;
    flex-wrap: wrap;
    height: 100%;
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
.chat {
    position: relative;
    padding: 16px;
    cursor: pointer;
    overflow: hidden;
    border-bottom: 1px solid #e2e6e9;
    &:hover {
        background-color: #f5f7f9;
    }
}
.avatar {
    flex-shrink:0;
    width: 50px;
    height: 50px;
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
