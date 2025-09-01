<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import WordleGame from '../components/WordleGame.vue'

const router = useRouter()

onMounted(() => {
  const user = localStorage.getItem('user')
  if (user) {
    const userData = JSON.parse(user)
    if (!userData.isLoggedIn) {
      router.push('/hub')
    }
  } else {
    router.push('/hub')
  }
})

</script>

<template>
  <div class="game-view-container">
    <main>
      <WordleGame />
    </main>
  </div>
</template>

<style scoped>
.game-view-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
main {
    display: flex;
    justify-content: center;
    width: 100%;
}
</style>  
