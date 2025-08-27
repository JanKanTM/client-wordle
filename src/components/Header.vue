<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { User } from '../types/user'

const router = useRouter()
const user = ref<User | null>(null)

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
})

const logout = () => {
  localStorage.removeItem('user')
  user.value = null
  router.push('/')
}
</script>

<template>
    <header>
        <div class="header-logo">
            <h1>Wortel</h1>
        </div>
        <div class="header-links">
            <div v-if="user?.isLoggedIn">
                <span>{{ user.username }}</span>
                <router-link to="/">Einstellungen</router-link>
                <button @click="logout">Logout</button>
            </div>
        </div>
    </header>
</template>

<style scoped>
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
}

.header-links div {
    display: flex;
    align-items: center;
}

.header-links span {
    margin-right: 1rem;
}

.header-links a {
    margin-right: 1rem;
}
</style>