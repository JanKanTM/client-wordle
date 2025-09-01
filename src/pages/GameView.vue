<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import GameHeader from '../components/GameHeader.vue'
import WordleGame from '../components/WordleGame.vue'

const router = useRouter()
const isLoggedIn = ref(false)
const username = ref('')

onMounted(() => {
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
})

const handleLogout = () => {
  localStorage.removeItem('user')
  isLoggedIn.value = false
  router.push('/hub')
}
</script>

<template>
  <div class="game-view-container">
    <GameHeader :username="username" :isLoggedIn="isLoggedIn" @logout="handleLogout" />
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
