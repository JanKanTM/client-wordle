import { ref, watch } from 'vue'
import type { WatchStopHandle } from 'vue'
import { useWebSocket } from './useWebSocket'
import type { IMessage } from '@stomp/stompjs'
import { WS_SUBSCRIPTIONS } from '../config/websocket.config'

export interface ChatResponse {
  username: string
  word: string
}

const chatMessages = ref<ChatResponse[]>([])

export function useChat() {
  const { subscribe, unsubscribe, isConnected } = useWebSocket()

  let stopWatch: WatchStopHandle | null = null

  const startListening = () => {
    if (stopWatch) return

    stopWatch = watch(
      isConnected,
      (connected) => {
        if (connected) {
          subscribe(WS_SUBSCRIPTIONS.CHAT, (message: IMessage) => {
            try {
              const chat: ChatResponse = JSON.parse(message.body)
              chatMessages.value.push(chat)

              if (chatMessages.value.length > 50) {
                chatMessages.value.shift()
              }
            } catch (e) {
              console.error('Error parsing chat message:', e)
            }
          })
        }
      },
      { immediate: true }
    )
  }

  const stopListening = () => {
    unsubscribe(WS_SUBSCRIPTIONS.CHAT)
    if (stopWatch) {
      stopWatch()
      stopWatch = null
    }
  }

  return {
    chatMessages,
    startListening,
    stopListening
  }
}
