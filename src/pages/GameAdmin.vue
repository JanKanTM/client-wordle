<script setup lang="ts">
import { ref } from 'vue'
import useAuth from '../service/useAuth'

const { isAdmin, currentUser } = useAuth()

const newName = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const handleUpdateUserData = () => {
  // TODO: Implement API call to update user data
  console.log('Updating user data:', {
    newName: newName.value,
    newPassword: newPassword.value
  })
}
</script>

<template>
  <div class="admin-page">
    <h1>Adminbereich</h1>
    <div v-if="isAdmin">
      <!-- Admin-specific content will go here -->
      <p>Willkommen, Admin! Hier kannst du Wörter hinzufügen.</p>
      <!-- This part will be implemented later -->
    </div>
    <div v-else>
      <h2>Benutzerdaten ändern</h2>
      <form @submit.prevent="handleUpdateUserData">
        <div class="form-group">
          <label for="newName">Neuer Name</label>
          <input type="text" id="newName" v-model="newName" />
        </div>
        <div class="form-group">
          <label for="newPassword">Neues Passwort</label>
          <input type="password" id="newPassword" v-model="newPassword" />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Passwort bestätigen</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" />
        </div>
        <button type="submit">Speichern</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
</style>
