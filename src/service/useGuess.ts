import { ref, watch } from 'vue'
import type { WatchStopHandle } from 'vue'
import type { IMessage } from '@stomp/stompjs'
import { useWebSocket } from './useWebSocket'
import { STOMP_ENDPOINTS, WS_SUBSCRIPTIONS } from '../config/websocket.config'
import useAuth from '../service/useAuth'

export interface GuessRequest {
  _id: string
  guess: string
  attempt: number
}

export interface GuessResult {
  letter: string
  status: 'correct' | 'present' | 'absent'
}

export interface GuessResponse {
  guess: string
  result: GuessResult[]
  isWin: boolean
}

export function useGuess() {
  const { sendMessage, subscribe, unsubscribe, isConnected } = useWebSocket()
  const { currentUser } = useAuth()

  const lastResponse = ref<GuessResponse | null>(null)
  let stopWatch: WatchStopHandle | null = null

  const startGuessListening = () => {
    if (stopWatch) return

    stopWatch = watch(
      isConnected,
      (connected) => {
        if (connected) {
          subscribe(WS_SUBSCRIPTIONS.GUESS, (message: IMessage) => {
            try {
              const payload: GuessResponse = JSON.parse(message.body)
              lastResponse.value = payload
              console.log('Guess result received:', payload)
            } catch (e) {
              console.error('Error parsing guess response:', e)
            }
          })
        }
      },
      { immediate: true }
    )
  }

  const stopGuessListening = () => {
    unsubscribe(WS_SUBSCRIPTIONS.GUESS)
    if (stopWatch) {
      stopWatch()
      stopWatch = null
    }
  }

  const submitGuess = (guess: string, attempt: number) => {
    if (!isConnected.value) {
      console.warn('Cannot submit guess. WebSocket not connected.')
      return
    }
    if (!currentUser.value?._id) {
      console.error('Cannot submit guess. User not available or has no ID.')
      return
    }

    const request: GuessRequest = {
      _id: currentUser.value._id,
      guess: guess,
      attempt: attempt
    }

    sendMessage(STOMP_ENDPOINTS.GUESS, request)
  }

  return { lastResponse, startGuessListening, stopGuessListening, submitGuess }
}
