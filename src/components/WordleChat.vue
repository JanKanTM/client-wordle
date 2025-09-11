<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useChat } from '../service/useChat'

defineProps<{
  isVisible: boolean
}>()

const { chatMessages } = useChat()
const chatContainer = ref<HTMLElement | null>(null)

watch(chatMessages, async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}, { deep: true })
</script>

<template>
  <div class="chat-wrapper" v-show="isVisible">
    <header class="chat-header">
      <h3>Letzte Versuche</h3>
    </header>
    <div class="chat-messages" ref="chatContainer">
      <div v-if="chatMessages.length === 0" class="no-messages">
        Warte auf die ersten Versuche...
      </div>
      <div v-for="(msg, index) in chatMessages" :key="index" class="chat-message">
        <span class="chat-username">{{ msg.username }}:</span>
        <span class="chat-word">{{ msg.word }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.chat-header {
  padding: 15px;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.chat-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #1f2937;
  text-align: center;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 15px;
}

.chat-message {
  margin-bottom: 8px;
  padding: 6px 10px;
  background-color: #ffffff;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  font-size: 0.9rem;
}

.chat-username {
  font-weight: bold;
  color: #1f2937;
}

.chat-word {
  margin-left: 8px;
  color: #4b5563;
  font-family: monospace;
}

.no-messages {
  color: #9ca3af;
  text-align: center;
  margin-top: 20px;
  font-style: italic;
}
</style>