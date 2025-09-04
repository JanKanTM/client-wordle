import { ref, onMounted, onUnmounted } from 'vue'
import { Client } from '@stomp/stompjs'
import type { IMessage } from '@stomp/stompjs'
import { WS_URL, WS_SUBSCRIPTIONS } from '../config/websocket.config'

export function useWebSocket() {
    const isConnected = ref(false)
    const messages = ref<any[]>([])
    const error = ref<string | null>(null)

    const stompClient = new Client({
        brokerURL: WS_URL,
        debug: (str) => {
            console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    const connect = async () => {
        try {
            stompClient.onConnect = (frame) => {
                isConnected.value = true;
                error.value = null;
                console.log('Connected:', frame);
                
                // Subscribe to game topic
                stompClient.subscribe(WS_SUBSCRIPTIONS.WORD, (message: IMessage) => {
                    const payload = JSON.parse(message.body);
                    messages.value.push(payload);
                });
            };

            stompClient.onStompError = (frame) => {
                error.value = `STOMP error: ${frame.headers['message']}`;
                isConnected.value = false;
            };

            stompClient.onWebSocketError = (event) => {
                error.value = `WebSocket error: ${event}`;
                isConnected.value = false;
            };

            await stompClient.activate();

        } catch (err) {
            error.value = `Connection error: ${err}`;
            isConnected.value = false;
        }
    };

    const disconnect = () => {
        if (stompClient) {
            stompClient.deactivate();
            isConnected.value = false;
        }
    };

    const sendMessage = (destination: string, body: any) => {
        if (isConnected.value) {
            stompClient.publish({
                destination: destination,
                body: JSON.stringify(body)
            });
        } else {
            error.value = 'Not connected to WebSocket';
        }
    };

    onMounted(() => {
        connect();
    });

    onUnmounted(() => {
        disconnect();
    });

    return {
        isConnected,
        messages,
        error,
        connect,
        disconnect,
        sendMessage
    };
}