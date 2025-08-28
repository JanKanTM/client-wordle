<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import GameHeader from '../components/GameHeader.vue'

const isLoggedIn = ref(false)
const username = ref('')
const router = useRouter()

onMounted(() => {
  const user = localStorage.getItem('user')
  if (user) {
    const userData = JSON.parse(user)
    if (userData.isLoggedIn) {
      isLoggedIn.value = true
      username.value = userData.username
    }
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
  <GameHeader :username="username" :isLoggedIn="isLoggedIn" @logout="handleLogout" />

  <div v-if="!isLoggedIn">
    <LoginForm @login-success="onLoginSuccess" />
  </div>

  <div v-else class="hub-container">

    <div class="title">
      <h1>Wortel</h1>

      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
    </div>

    <div class="hub-actions">
      <button class="hub-button dark-gray-button">Anleitung</button>
      <button class="hub-button dark-gray-button">Highscore</button>
      <button class="hub-button play-button">Spielen</button>
    </div>

  </div>
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
  font-size: 3.5rem;
  font-weight: 400;
  font-style: normal;
  margin-bottom: 10px;
}

.title p {
  font-size: 1.2rem;
  color: #787c7e;
  margin-bottom: 30px;
}

.hub-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
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
  background-color: #5e8d64;
}
.play-button:hover {
  background-color: #6aaa64;
}

.dark-gray-button {
  background-color: #3a3a3c;
}
</style>
