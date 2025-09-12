<script setup lang="ts">
import { ref } from 'vue'
import useAuth from '../service/useAuth'

const { currentUser, updateName, updatePass, message } = useAuth()

const newName = ref(currentUser.value?.username || '')
const newPassword = ref('')
const confirmPassword = ref('')
const errMessage = ref('')
const successMessage = ref('')

const handleUpdateUserData = async () => {
  errMessage.value = ''
  successMessage.value = ''

  if (!currentUser.value) {
    errMessage.value = "Nicht angemeldet."
    return
  }

  // Update username if it has changed
  if (newName.value && newName.value !== currentUser.value.username) {
    await updateName(currentUser.value._id, { username: newName.value, password: '' }) // Assuming password is not needed or handled differently by backend
    successMessage.value = message.value
  }

  // Update password if new password is provided and confirmed
  if (newPassword.value) {
    if (newPassword.value !== confirmPassword.value) {
      errMessage.value = "Die Passwörter stimmen nicht überein."
      return
    }
    await updatePass(currentUser.value._id, { username: currentUser.value.username, password: newPassword.value })
    successMessage.value = message.value
  }
}
</script>

<template>
  <div class="login-form-container">
    <div class="login-form-card">
      <h1 class="login-form-title">Einstellungen</h1>
      <form @submit.prevent="handleUpdateUserData">
        <div>
          <label for="newName">Benutzername</label>
          <input type="text" id="newName" v-model="newName" />
        </div>
        <div>
          <label for="newPassword">Neues Passwort</label>
          <input type="password" id="newPassword" v-model="newPassword" placeholder="Leer lassen, um nicht zu ändern" />
        </div>
        <div>
          <label for="confirmPassword">Passwort bestätigen</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" />
        </div>
        <p class="error-info">{{ errMessage }}</p>
        <p class="success-info">{{ successMessage }}</p>
        <button type="submit" class="submit-button">Speichern</button>
      </form>
    </div>
  </div>
</template>

<style scoped src="../styles/LoginForm.css"></style>
<style scoped>
.success-info {
  color: #27ae60;
  font-size: 12px;
  text-align: center;
}
</style>
