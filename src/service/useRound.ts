import { ref, watch } from 'vue'
import type { WatchStopHandle } from 'vue'
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
    const { subscribe, unsubscribe, isConnected } = useWebSocket()

    const lastRoundMessage = ref<RoundResponse | null>(null)
    let stopWatch: WatchStopHandle | null = null

    const startListening = () => {
        if (stopWatch) return

        stopWatch = watch(isConnected, (connected) => {
            if (connected) {
                subscribe(WS_SUBSCRIPTIONS.ROUND, (message: IMessage) => {
                    try {
                        const round: RoundResponse = JSON.parse(message.body)

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

    const stopListening = () => {
        unsubscribe(WS_SUBSCRIPTIONS.ROUND)
        if (stopWatch) {
            stopWatch()
            stopWatch = null
        }
    }

    return {
        lastRoundMessage,
        startListening,
        stopListening
    }
}
