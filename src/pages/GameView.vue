<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import WordleGame from '../components/WordleGame.vue'
import { useChat } from '../service/useChat'
import { useRound } from '../service/useRound'

const router = useRouter()

const { subscribeToChat, lastChatMessage } = useChat()
const { subscribeToRound, lastRoundMessage } = useRound()

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
    subscribeToChat()
    subscribeToRound()
  } else {
    router.push('/hub')
  }
})

watch(lastChatMessage, (msg) => {
  if (msg) {
        console.log(`${msg.username}: ${msg.word}`)
    }
})

watch(lastRoundMessage, (msg) => {
  if (msg) {
    console.log(`${msg.round}${'word' in msg ? `: ${msg.word}` : ''}`)
  }
})
</script>

<template>
  <div class="game-view-container">
    <main>
      <WordleGame />
    </main>
  </div>
</template>

<style scoped>
.game-view-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
main {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>  
