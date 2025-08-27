<script setup lang="ts">
defineProps<{
  username: string;
}>();

defineEmits(['logout']);
</script>

<template>
  <header class="game-header">
    <h1>Wortel</h1>
    <div class="user-actions">
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
  background-color: #f0f0f0;
  border-bottom: 1px solid #ddd;
}
.user-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}
.logout-button {
    padding: 8px 16px;
    font-size: 1rem;
    background-color: #e63946;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
.logout-button:hover {
    background-color: #c4303d;
}
</style>