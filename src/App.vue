<script setup lang="ts">
import GameHeader from './components/GameHeader.vue'
import GameFooter from './components/GameFooter.vue'
</script>

<template>
  <div class="page-container">
    <GameHeader />
    <main class="main-content">
      <router-view />
    </main>
    <GameFooter />
  </div>
</template>

<style>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
}
</style>