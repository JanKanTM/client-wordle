import { ref, watch } from 'vue'
import { useWebSocket } from './useWebSocket'
import type { IMessage } from '@stomp/stompjs'
import { WS_SUBSCRIPTIONS } from '../config/websocket.config';

export interface ChatResponse {
    username: string;
    word: string;
}

export function useChat() {
    const { subscribe, isConnected } = useWebSocket()

    const lastChatMessage = ref<ChatResponse | null>(null)

    const subscribeToChat = () => {
        console.log('subscribeToChat wurde aufgerufen');

        const destination = `${WS_SUBSCRIPTIONS.CHAT}`;

        watch(isConnected, (connected) => {
            if (connected) {
                subscribe(destination, (message: IMessage) => {
                    try {
                        const payload = typeof message.body === 'string'
                        ? JSON.parse(message.body)
                        : message.body
                        
                        const chat:ChatResponse = payload.body

                        lastChatMessage.value = chat

                        //console.log(`${chat.username}: ${chat.word}`)
                    } catch (e) {
                        console.error('Fehler beim Parsen der Chatnachricht:', e)
                    }
                })
            }
        }, { immediate: true })
    }

    return {
        lastChatMessage,
        subscribeToChat
    }
}