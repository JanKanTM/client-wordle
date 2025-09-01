<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import GameHeader from '../components/GameHeader.vue'
import InstructionsModal from '../components/Instructions.vue'
import type { User } from '../types/user'

const isLoggedIn = ref(false)
const user = ref<User | null>(null)
const router = useRouter()
const showInstructions = ref(false)

onMounted(() => {
  const userString = localStorage.getItem('user')
  if (userString) {
    const userData = JSON.parse(userString)
    if (userData.isLoggedIn) {
      isLoggedIn.value = true
      user.value = userData
    }
  }
})

const onLoginSuccess = () => {
  isLoggedIn.value = true;
  const userString = localStorage.getItem('user');
  if (userString) {
    const userData = JSON.parse(userString)
    user.value = userData
  }
}

const handleLogout = () => {
  localStorage.removeItem('user');
  isLoggedIn.value = false;
  user.value = null;
}

const openInstructions = () => {
  showInstructions.value = true
}

const closeInstructions = () => {
  showInstructions.value = false
}

function routeGame() {
  router.push('/game');
}
</script>

<template>
  <GameHeader :username="user?.username || ''" :isLoggedIn="isLoggedIn" @logout="handleLogout" />

  <div v-if="!isLoggedIn">
    <LoginForm @login-success="onLoginSuccess" />
  </div>

  <div v-else class="hub-container">

    <div class="title">
      <h1>Wortel</h1>

      <p>Willkommen, {{ user?.username }}</p>
    </div>

    <div class="hub-actions">
      <button class="hub-button play-button" @click="routeGame">Spielen</button>
      <div class="secondary-actions">
        <button class="hub-button dark-gray-button" @click="openInstructions">Anleitung</button>
        <button class="hub-button dark-gray-button">Highscore</button>
      </div>
    </div>

  </div>

  <InstructionsModal :show="showInstructions" @close="closeInstructions" />
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Modak&display=swap');

.hub-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  margin-top: 50px;
  text-align: center;
}

.title h1 {
  font-family: "Modak", system-ui;
  font-size: 4rem;
  font-weight: 400;
  font-style: normal;
  margin-bottom: 10px;
  color: #3a3a3c;
}

.title p {
  font-size: 1.2rem;
  color: #787c7e;
  margin-bottom: 30px;
}

.hub-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 400px;
}

.hub-button {
  padding: 12px 24px;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.hub-button:hover {
  transform: scale(1.025);
}

.play-button {
  width: 100%;
  background-color: #5e8d64;
  padding: 10px 15px;
  font-size: 1.7rem;
}
.play-button:hover {
  background-color: #6aaa64;
  box-shadow: 0 0 12px rgba(106, 170, 100, 0.6);
}

.secondary-actions {
  display: flex;
  width: 100%;
  gap: 15px;
}

.dark-gray-button {
  flex: 1;  
  background-color: #3a3a3c;
}
</style>
