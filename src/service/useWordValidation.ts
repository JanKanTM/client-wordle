import { ref } from 'vue'
import { STOMP_ENDPOINTS } from '../config/websocket.config'
import { useWebSocket } from './useWebSocket'
import { WS_SUBSCRIPTIONS } from '../config/websocket.config'
import type { IMessage } from '@stomp/stompjs';

export interface GuessRequest {
  _id: string;
  guess: string;
}

export interface GuessResult {
    letter: string;
    status: 'correct' | 'present' | 'absent'
}

export interface GuessResponse {
    guess: string;
    result: GuessResult[];
    isWin: boolean;
}

export function useWordValidation() {
    const { sendMessage, isConnected, stompClient } = useWebSocket()

    const lastResponse = ref<GuessResponse | null>(null)

    const submitGuess = (guessRequest: GuessRequest) => {
        if (!isConnected.value) {
        console.warn('WebSocket nicht verbunden')
        return
        }
        sendMessage(STOMP_ENDPOINTS.GUESS, guessRequest)
    }

    const subscribeToGuessResponse = () => {
        if (!stompClient) return

        stompClient.subscribe(WS_SUBSCRIPTIONS.GUESS, (message: IMessage) => {
            try {
                const payload: GuessResponse = JSON.parse(message.body)
                lastResponse.value = payload
                console.log('Guess Antwort empfangen')
            } catch (e) {
                console.error('Fehler beim Parsen der Guess-Antwort:', e)
            }
        })
    }

  return {
    // State
    isConnected,
    lastResponse,

    // Actions
    submitGuess,
    subscribeToGuessResponse
  }
}