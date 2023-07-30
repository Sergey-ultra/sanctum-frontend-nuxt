import {useNuxtApp} from "#app";

export const useMessageStore = defineStore({
    id: 'message',
    state: () => ({
       chats: [],
    }),
    actions: {
        async loadChats() {
            const { $api } = useNuxtApp();
            const { data } = await $api.get('/my-chats');

            if (data && Array.isArray(data)) {
                this.chats = [...data];
            }
        },
        loadChatByMessageId() {

        },
    },
});
