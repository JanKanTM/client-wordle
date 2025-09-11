import { ref, watch } from 'vue'
import { Client } from '@stomp/stompjs'
import type { IMessage, StompSubscription } from '@stomp/stompjs'
import { WS_URL } from '../config/websocket.config'
import useAuth from './useAuth'

const { currentUser } = useAuth()

let stompClient: Client | null = null
const isConnected = ref(false)
const error = ref<string | null>(null)
const activeSubscriptions: Map<string, StompSubscription> = new Map()

const connect = async () => {
  if (!currentUser.value?._id || (stompClient && stompClient.active)) {
    return
  }

  stompClient = new Client({
    brokerURL: WS_URL + `?userId=${currentUser.value._id}`,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000
  })

  stompClient.onConnect = () => {
    isConnected.value = true
    error.value = null
    console.log('WebSocket connected successfully.')
    // Optional: Re-subscribe to topics if needed
  }

  stompClient.onStompError = (frame) => {
    error.value = `STOMP Error: ${frame.headers['message']}`
    isConnected.value = false
  }

  stompClient.onWebSocketError = (event) => {
    error.value = `WebSocket Error: ${event}`
    isConnected.value = false
  }

  try {
    await stompClient.activate()
  } catch (err) {
    error.value = `Connection failed: ${err}`
  }
}

const disconnect = () => {
  if (stompClient && stompClient.active) {
    stompClient.deactivate()
  }
  activeSubscriptions.clear()
  isConnected.value = false
  stompClient = null
  console.log('WebSocket disconnected.')
}

const subscribe = (destination: string, callback: (msg: IMessage) => void) => {
  if (!isConnected.value || !stompClient) {
    console.warn(`Cannot subscribe to ${destination}. Not connected.`)
    return
  }
  if (activeSubscriptions.has(destination)) {
    console.warn(`Already subscribed to ${destination}.`)
    return
  }
  const subscription = stompClient.subscribe(destination, callback)
  activeSubscriptions.set(destination, subscription)
}

const unsubscribe = (destination: string) => {
  if (activeSubscriptions.has(destination)) {
    activeSubscriptions.get(destination)?.unsubscribe()
    activeSubscriptions.delete(destination)
  }
}

const sendMessage = (destination: string, body: any) => {
  if (isConnected.value && stompClient) {
    stompClient.publish({ destination, body: JSON.stringify(body) })
  } else {
    error.value = 'Cannot send message. Not connected.'
  }
}

watch(
  currentUser,
  (user) => {
    if (user?._id) {
      connect()
    } else {
      disconnect()
    }
  },
  { immediate: true }
)

export function useWebSocket() {
  return {
    isConnected,
    error,
    connect, 
    disconnect,
    subscribe,
    unsubscribe,
    sendMessage
  }
}
