import { ref } from 'vue'
import type { IMessage } from '@stomp/stompjs'
import { useWebSocket } from './useWebSocket'
import { STOMP_ENDPOINTS } from '../config/websocket.config'
import useAuth from '../service/useAuth'

export interface GuessRequest {
  _id: string;
  guess: string;
  attempt: number;
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

export function useGuess() {
    const { sendMessage, subscribe, isConnected } = useWebSocket()
    const { currentUser } = useAuth()

    const lastResponse = ref<GuessResponse | null>(null)
    

    const subscribeToGuess = () => {
        if (!currentUser.value?._id) {
            console.error('User not available or has no ID, cannot subscribe to guess results.');
            return;
        }

        const destination = `/user/${currentUser.value._id}/game/guess-result`;
        subscribe(destination, (message: IMessage) => {
            try {
                const payload: GuessResponse = JSON.parse(message.body)

                lastResponse.value = payload
                console.log('Guess-Result empfangen:', payload)
            } catch (e) {
                console.error('Fehler beim Parsen der Guess-Antwort:', e)
            }
        });
    }
    
    const submitGuess = (guess: string, attempt: number) => {
        if (!isConnected.value) {
        console.warn('WebSocket nicht verbunden')
        return
        }
        if (!currentUser.value?._id) {
            console.error('User not available or has no ID, cannot submit guess.');
            return;
        }

        const request: GuessRequest = {
            _id: currentUser.value._id,
            guess: guess,
            attempt: attempt
        }

        sendMessage(STOMP_ENDPOINTS.GUESS, request)
    }
    
    return { lastResponse, isConnected, subscribeToGuess, submitGuess };
}