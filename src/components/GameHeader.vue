<script setup lang="ts">
import { LogOut, MedalIcon, Settings, SettingsIcon, TrophyIcon } from 'lucide-vue-next';

defineProps<{
  username: string;
  isLoggedIn: boolean;
}>();

defineEmits(['logout']);

function routeScoreboard() {
  console.log("score")
}

function routeSettings() {
  console.log("settings")
}
</script>

<template>
  <header class="game-header">
    <h1>Wortel</h1>

    <template v-if="isLoggedIn">
      <div class="user-actions">
        <MedalIcon 
          :size="28"
          class="base-icon"
          @click="routeScoreboard"
        />
        <SettingsIcon 
          :size="28"
          class="base-icon"
          @click="routeSettings"
        />
        <button @click="$emit('logout')" class="logout-button"> <LogOut :size="16" /> Logout</button>
      </div>
    </template>
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
  background-color: #3a3a3c;
  transition: all 0.3s ease-in-out;
}
.logout-button:hover {
  background-color: #6aaa64;
  transform: scale(1.025);
}
.action-link {
  cursor: pointer;
  font-weight: 600;
  color: #3a3a3c;
  transition: color 0.2s ease-in-out;
}
.action-link:hover {
  color: #6aaa64;
}
.base-icon {
  color: #3a3a3c;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.base-icon:hover {
  color: #6aaa64;
  transform: scale(1.05);
}
</style>