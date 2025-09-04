<script setup lang="ts">
import { LogOut, MedalIcon, SettingsIcon } from 'lucide-vue-next';
import { useRouter } from 'vue-router'
import useAuth from '../service/useAuth';

const router = useRouter()

const { logout, isAuthenticated, isAdmin } = useAuth();

defineEmits(['logout']);

const handleLogout = async () => {
  await logout()
  router.push('/')
}
function routeScoreboard() {
  router.push('/leaderboard')
}

function routeSettings() {
  console.log("settings")
}
</script>

<template>
  <header class="game-header">
    <div class="header-content">

      <img src="../assets/logo/Logo.png" alt="Wortel" class="logo-image">

      <template v-if="isAuthenticated">
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
          <button @click="handleLogout" class="logout-button"> <LogOut :size="16" /> Logout</button>
        </div>
      </template>
    </div>
  </header>
</template>

<style scoped>
.game-header {
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid #ddd;
}
.header-content {
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.logo-image {
  height: 40px;
  cursor: pointer;
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
  border-radius: 8px;
  cursor: pointer;
  background-color: #3a3a3c;
  transition: all 0.2s ease-in-out;
}
.logout-button:hover {
  background-color: #6aaa64;
  box-shadow: 0 0 12px rgba(106, 170, 100, 0.6);
  transform: scale(1.025);
}
.action-link {
  cursor: pointer;
  font-weight: 600;
  color: #3a3a3c;
  transition: color 0.2s ease-in-out;
}
.action-link:hover {
  color: #5e8d64;
}
.base-icon {
  color: #3a3a3c;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.base-icon:hover {
  color: #5e8d64;
  transform: scale(1.05);
}
</style>