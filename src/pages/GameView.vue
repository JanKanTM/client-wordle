<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import WordleGame from '../components/WordleGame.vue'
import WordleChat from '../components/WordleChat.vue'
import { useRound } from '../service/useRound'
import { MessageCircle, MessageCircleOff } from 'lucide-vue-next';

const router = useRouter()

const { startListening, stopListening, lastRoundMessage } = useRound()

const isChatVisible = ref(true)
const toggleChat = () => (isChatVisible.value = !isChatVisible.value)

onMounted(() => {
  /*
  const user = localStorage.getItem('user')
  if (user) {
    const userData = JSON.parse(user)
    if (userData.isLoggedIn) {
      isLoggedIn.value = true
      username.value = userData.username
    } else {
      router.push('/hub')
    }
  } else {
    router.push('/hub')
  }
  */
  const token = sessionStorage.getItem('auth_token')
  if (token) {
    console.log('true') // Todo
    startListening()
  } else {
    router.push('/hub')
  }
})

onUnmounted(() => {
  stopListening()
})

watch(lastRoundMessage, (msg) => {
  if (msg) {
    console.log(`${msg.round}${'word' in msg ? `: ${msg.word}` : ''}`)
  }
})
</script>

<template>
  <div class="game-view-container">
    <!-- Main Game Sidebar -->
    <main class="game-content">
      <WordleGame />
    </main>

    <!-- Chat Sidebar -->
    <aside class="chat-sidebar" :class="{ 'is-collapsed': !isChatVisible }">
      <div class="sidebar-handle">
        <button @click="toggleChat" class="toggle-button" :title="isChatVisible ? 'Chat ausblenden' : 'Chat einblenden'">
          <span v-if="isChatVisible">
            <MessageCircleOff :size="24" />
          </span>
          <span v-else>
            <MessageCircle :size="24" />
          </span>
        </button>
      </div>
      <WordleChat :is-visible="isChatVisible" />
    </aside>
  </div>
</template>

<style scoped>
.game-view-container {
  width: 100%;
  padding: 20px;
  position: relative;
}

.game-content {
  display: flex;
  justify-content: center;
  width: 100%;
}

.chat-sidebar {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 300px;
  height: 80vh;
  min-height: 500px;
  background-color: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  z-index: 10;
  display: flex;
}

.chat-sidebar.is-collapsed {
  transform: translateY(-50%) translateX(calc(100% - 40px));
}

.sidebar-handle {
  position: absolute;
  left: -20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
}

.toggle-button {
  background: #e5e7eb;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: -2px 2px 5px rgba(0,0,0,0.1);
  transition: background-color 0.2s, transform 0.2s;
}

.toggle-button:hover {
  background-color: #d1d5db;
  transform: scale(1.1);
}
</style>