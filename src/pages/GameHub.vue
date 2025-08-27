<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LoginForm from '../components/LoginForm.vue'
import GameHeader from '../components/GameHeader.vue'

const isLoggedIn = ref(false)
const username = ref('')

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
</script>

<template>
    <GameHeader :username="username" :isLoggedIn="isLoggedIn" @logout="handleLogout" />

    <div v-if="!isLoggedIn">
      <LoginForm @login-success="onLoginSuccess" />
    </div>
</template>
