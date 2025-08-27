<script setup lang="ts">
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
      <button @click="$emit('logout')" class="logout-button">Logout</button>
    </div>
  </header>
</template>

<style scoped>
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
    padding: 6px 12px;
    font-size: 0.875rem;
    background-color: transparent;
    color: #374151; /* text-gray-700 */
    border: 1px solid #d1d5db; /* border-gray-300 */
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}
.logout-button:hover {
    background-color: #f3f4f6; /* gray-100 */
    border-color: #9ca3af; /* gray-400 */
}
</style>