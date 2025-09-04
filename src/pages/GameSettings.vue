<script setup lang="ts">
import { useWebSocket } from '../service/useWebSocket'
import { STOMP_ENDPOINTS } from '../config/websocket.config'

const { sendMessage, isConnected, error } = useWebSocket()

const sendHello = () => {
    sendMessage(STOMP_ENDPOINTS.HI, "hallo")
}
</script>

<template>
    <div class="game-settings">
        <button 
            @click="sendHello" 
            :disabled="!isConnected"
            class="wordle-button"
            :class="{ 'button-disabled': !isConnected }"
        >
            <span class="button-text">Sende Hallo</span>
            <span class="connection-indicator" :class="{ 'connected': isConnected }"></span>
        </button>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="isConnected" class="status connected">Verbunden</p>
        <p v-else class="status disconnected">Nicht verbunden</p>
    </div>
</template>

<style scoped>
.game-settings {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.wordle-button {
    position: relative;
    background-color: #538d4e; 
    color: white;
    border: none;
    border-radius: 4px;
    padding: 12px 24px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 200px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.wordle-button:hover:not(.button-disabled) {
    background-color: #447c41;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.wordle-button:active:not(.button-disabled) {
    transform: translateY(1px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.button-disabled {
    background-color: #787c7e;  /* Wordle's grey color */
    cursor: not-allowed;
    opacity: 0.7;
}

.button-text {
    flex-grow: 1;
    text-align: center;
}

.connection-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #dc3545;  /* Red for disconnected */
    transition: background-color 0.3s ease;
}

.connection-indicator.connected {
    background-color: #198754;  /* Green for connected */
}

.error {
    color: #dc3545;
    font-size: 0.9rem;
    background-color: rgba(220, 53, 69, 0.1);
    padding: 8px 16px;
    border-radius: 4px;
    text-align: center;
}

.status {
    font-size: 0.9rem;
    padding: 4px 12px;
    border-radius: 12px;
    font-weight: 500;
}

.status.connected {
    color: #198754;
    background-color: rgba(25, 135, 84, 0.1);
}

.status.disconnected {
    color: #dc3545;
    background-color: rgba(220, 53, 69, 0.1);
}
</style>