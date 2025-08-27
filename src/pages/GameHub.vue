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

const startGame = () => {
  router.push('/game');
}

const showHowToPlay = () => {
  alert('So wird gespielt:\n\n1. Errate das Wort in 6 Versuchen.\n2. Jeder Versuch muss ein gültiges Wort mit 5 Buchstaben sein.\n3. Die Farbe der Kacheln ändert sich, um anzuzeigen, wie nah du an der Lösung bist.\n\nGrün: Der Buchstabe ist im Wort und an der richtigen Stelle.\nGelb: Der Buchstabe ist im Wort, aber an der falschen Stelle.\nGrau: Der Buchstabe ist nicht im Wort.');
}
</script>

<template>
    <GameHeader :username="username" :isLoggedIn="isLoggedIn" @logout="handleLogout" />

    <div v-if="!isLoggedIn">
      <LoginForm @login-success="onLoginSuccess" />
    </div>
    <div v-else class="hub-container">
        <p>Bist du bereit für eine neue Runde?</p>
        <div class="hub-actions">
            <button @click="startGame" class="hub-button play-button">Spielen</button>
            <button @click="showHowToPlay" class="hub-button how-to-play-button">How to Play</button>
        </div>
    </div>
</template>

<style scoped>
.hub-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  margin-top: 50px;
  text-align: center;
}

.hub-container h2 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.hub-container p {
  font-size: 1.2rem;
  color: #787c7e;
  margin-bottom: 30px;
}

.hub-actions {
  display: flex;
  gap: 20px;
}

.hub-button {
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hub-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.play-button {
  background-color: #6aaa64;
}

.how-to-play-button {
  background-color: #9fa3a4; 
}
</style>
