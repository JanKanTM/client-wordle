import { ref, onMounted, onUnmounted } from 'vue'
import { Client } from '@stomp/stompjs'
import type { IMessage, StompSubscription } from '@stomp/stompjs'
import { WS_URL } from '../config/websocket.config'

export function useWebSocket() {
    const isConnected = ref(false)
    const messages = ref<any[]>([])
    const error = ref<string | null>(null)

    const stompClient = new Client({
        brokerURL: WS_URL,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
    })

    const connect = async () => {
        try {
            stompClient.onConnect = () => {
                isConnected.value = true;
                error.value = null;
                console.log('Connected to Websocket!');
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

    const subscribe = (
        destination: string,
        callback: (msg: IMessage) => void
    ): StompSubscription | null => {
        if (!isConnected.value) {
        console.warn(`⚠️ Not connected: cannot subscribe to ${destination}`)
        return null
        }
        return stompClient.subscribe(destination, callback)
    }

    const disconnect = () => {
        if (stompClient.active) {
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

    onMounted(() => connect())

    onUnmounted(() => disconnect())

    return {
        isConnected,
        messages,
        error,
        stompClient,
        subscribe,
        connect,
        disconnect,
        sendMessage
    };
}