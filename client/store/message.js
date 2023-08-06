import {useNuxtApp} from "#app";

export const useMessageStore = defineStore({
    id: 'message',
    state: () => ({
        chats: [],
        isLoadingChat: false,
        messages: [],
        lastMessageId: null,
        dialogUser: '',
        dialogAvatar: '',
        dialogUserId: '',
    }),
    actions: {
        setLastMessageId(id) {
           this.lastMessageId = id;
        },
        async loadChats() {
            const { $api } = useNuxtApp();
            const { data } = await $api.get('/chats');

            if (data && Array.isArray(data)) {
                this.chats = [...data];
            }
        },
        async loadChatByMessageId(id) {
            const { $api } = useNuxtApp();
            this.isLoadingChat = true;
            const { data } = await $api.get(`/chats/${id}`);
            if (data && Array.isArray(data.messages)) {
                this.messages = [...data.messages];
                this.dialogUser = data.dialog_user;
                this.dialogAvatar= data.dialog_avatar;
                this.dialogUserId= data.dialog_user_id;
            }
            this.isLoadingChat = false;
        },
        async sendMessage(payload) {
            const { $api } = useNuxtApp();
            try {
                const { data } = await $api.post('/messages', payload);

                if (data.id) {
                    this.messages.push(data);
                    $api.$toast.setSuccess('Сообщение успешно отправлено');
                }
            } catch (e) {
                if (e.status === 429) {
                    return e.message;
                }
            }
        },
    },
});
