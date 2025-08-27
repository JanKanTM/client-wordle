<script setup lang="ts">
import { LogOut } from 'lucide-vue-next';

defineProps<{
  username: string;
  isLoggedIn: boolean;
}>();

defineEmits(['logout']);
</script>

<template>
  <header class="game-header">
    <h1>Wortel</h1>
    <div v-if="isLoggedIn" class="user-actions">
      <span>Willkommen, {{ username }}</span>
      <button @click="$emit('logout')" class="logout-button"> <LogOut :size="16" /> Logout</button>
    </div>
  </header>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap');

h1 {
  font-family: 'Luckiest Guy', cursive;
  color: #3a3a3c;
  font-size: 28px;
  margin: 0;
}

.game-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #ddd;
}
.user-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}
.logout-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 0.875rem;
  color: white;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  background-color: #9fa3a4; /* Wordle grey */
  transition: all 0.3s ease-in-out;
}
.logout-button:hover {
  background-color: #6aaa64; /* Wordle green */
  transform: scale(1.025);
}
</style>