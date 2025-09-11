import { ref, watch } from 'vue'
import { useWebSocket } from './useWebSocket'
import type { IMessage } from '@stomp/stompjs'
import { WS_SUBSCRIPTIONS } from '../config/websocket.config';

export interface ChatResponse {
    username: string;
    word: string;
}

const chatMessages = ref<ChatResponse[]>([]);
const isSubscribed = ref(false);

export function useChat() {
    const { subscribe, isConnected } = useWebSocket()

    const subscribeToChat = () => {
        if (isSubscribed.value) return;

        const destination = WS_SUBSCRIPTIONS.CHAT;

        watch(isConnected, (connected) => {
            if (connected && !isSubscribed.value) {
                console.log('Verbindung hergestellt, abonniere Chat...');
                isSubscribed.value = true;
                subscribe(destination, (message: IMessage) => {
                    try {
                        const payload = typeof message.body === 'string'
                        ? JSON.parse(message.body)
                        : message.body
                        
                        const chat: ChatResponse = payload.body

                        chatMessages.value.push(chat);

                        if (chatMessages.value.length > 50) {
                            chatMessages.value.shift();
                        }
                    } catch (e) {
                        console.error('Fehler beim Parsen der Chatnachricht:', e)
                    }
                })
            }
        }, { immediate: true })
    }

    return {
        chatMessages,
        subscribeToChat
    }
}