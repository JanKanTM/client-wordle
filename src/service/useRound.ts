import { ref, watch } from 'vue'
import { useWebSocket } from './useWebSocket'
import type { IMessage } from '@stomp/stompjs'
import { WS_SUBSCRIPTIONS } from '../config/websocket.config';

export interface RoundStarted {
    round: 'started'
}

export interface RoundEnded {
    round: 'ended'
    word: string;
}

export type RoundResponse = RoundStarted | RoundEnded;

export function useRound() {
    const { subscribe, isConnected } = useWebSocket()

    const lastRoundMessage = ref<RoundResponse | null>(null)

    const subscribeToRound = () => {
        console.log('subscribeToRound wurde aufgerufen');

        const destination = WS_SUBSCRIPTIONS.ROUND

        watch(isConnected, (connected) => {
            if (connected) {
                subscribe(destination, (message: IMessage) => {
                    try {
                        const payload = typeof message.body === 'string'
                        ? JSON.parse(message.body)
                        : message.body
                        
                        const round: RoundResponse = JSON.parse(payload.body)

                        lastRoundMessage.value = round

                        if (round.round === 'started') {
                            console.log('Neue Runde gestartet!')
                        } else if (round.round === 'ended') {
                            console.log(`Runde beendet, Lösungswort war: ${round.word}`)
                        }
                    } catch (e) {
                        console.error('Fehler beim Verarbeiten der Rundennachricht:', e)
                    }
                }) 
            }
        }, { immediate: true })
    }

    return {
        lastRoundMessage,
        subscribeToRound
    }
}