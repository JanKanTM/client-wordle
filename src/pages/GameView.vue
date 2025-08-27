<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LoginForm from '../components/LoginForm.vue'
import GameHeader from '../components/GameHeader.vue'
import WordleGame from '../components/WordleGame.vue'

const isLoggedIn = ref(false)
const username = ref('')

onMounted(() => {
  const user = localStorage.getItem('user')
  if (user) {
    const userData = JSON.parse(user)
    if (userData.isLoggedIn) {
      isLoggedIn.value = true
      username.value = userData.username
    }
  } else {
      isLoggedIn.value = false
  }
})

const onLoginSuccess = () => {
  isLoggedIn.value = true
  const user = localStorage.getItem('user')
  if (user) {
    const userData = JSON.parse(user)
    username.value = userData.username
  }
}

const handleLogout = () => {
  localStorage.removeItem('user');
  isLoggedIn.value = false;
}

</script>

<template>

  <div v-if="!isLoggedIn">
    <LoginForm @login-success="onLoginSuccess" />
  </div>

  <div v-else class="game-view-container">
    <GameHeader :username="username" @logout="handleLogout" />
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
