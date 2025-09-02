<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import InstructionsModal from '../components/Instructions.vue'
import useAuth from '../service/useAuth'

const router = useRouter()
const showInstructions = ref(false)
const { currentUser, isAuthenticated } = useAuth()

const toggleInstructions = (show: boolean) => {
  showInstructions.value = show
}

function routeGame() {
  router.push('/game');
}
</script>

<template>
  <!-- <GameHeader />  -->

  <div v-if="!isAuthenticated">
    <LoginForm />
  </div>

  <div v-else class="hub-container">
    <div class="title">
      <h1>Wortel</h1>
      <p>Willkommen, {{ currentUser?.username }}</p>
    </div>

    <div class="hub-actions">
      <button class="hub-button play-button" @click="routeGame">Spielen</button>
      <div class="secondary-actions">
        <button class="hub-button dark-gray-button" @click="toggleInstructions(true)">Anleitung</button>
        <button class="hub-button dark-gray-button">Highscore</button>
      </div>
    </div>
  </div>

  <InstructionsModal :show="showInstructions" @close="() => toggleInstructions(false)" />
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
