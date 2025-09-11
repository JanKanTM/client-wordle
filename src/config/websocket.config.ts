export const WS_URL = 'ws://localhost:8080/ws'
export const WS_SUBSCRIPTIONS = {
  CHAT: '/topic/chat', //broadcast
  ROUND: '/topic/round', //broadcast
  GUESS: '/user/queue/guess-result' //(Unicast)
}
export const STOMP_ENDPOINTS = {
  GUESS: '/app/guess'
}