<script setup lang="ts">
  import GameHeader from './components/GameHeader.vue';
  import GameFooter from './components/GameFooter.vue';
</script>

<template>
  <header>
    <GameHeader />
  </header>
  <main>
    <router-view />
  </main>
  <footer>
    <GameFooter />
  </footer>
</template>
