<script setup lang="ts">
import { ref } from 'vue'
import type { LoginRequest, RegisterRequest, User } from '../types/user'
import { loginUser, registerUser } from '../api/user'

const emit = defineEmits(['login-success'])

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const isRegistering = ref(false)
const errMessage = ref('')

const userData = ref<User | null>(null);

async function handleLogin() {
  errMessage.value = ''

  try {
    // password check
    if (!username.value || !password.value) {
      errMessage.value = 'Benutzername und Passwort sind erforderlich.';
      return;
    }

    if (isRegistering.value) {
      // Register

      // basic logic
      if (checkPassword()) {
        const credentials: RegisterRequest = {
        username: username.value,
        password: password.value,
      };

        userData.value = await registerUser(credentials);
        console.log("Registrierung erfolgreich:", userData.value);

        isRegistering.value = false;
      }
    } else {
      // Login
      
      const credentials: LoginRequest = {
        username: username.value,
        password: password.value,
      };

      userData.value = await loginUser(credentials);
      console.log("Login erfolgreich:", userData.value);

      if (userData.value) {
        localStorage.setItem('user', JSON.stringify({ ...userData.value, isLoggedIn: true }));
        emit('login-success');
      }
    } 
  } catch (err) {
    console.error("Fehler beim Login:", err);
  }
}

function checkPassword(): boolean {
  if (password.value !== confirmPassword.value) {
    errMessage.value = 'Die Passwörter stimmen nicht überein.'
    return false;
  }
  if (password.value.length < 4) {
    errMessage.value = 'Das Passwort muss mindestens 4 Zeichen lang sein.';
    return false;
  }

  return true;
}
</script>

<template>
  <div class="login-form-container">
    <div class="login-form-card">
      <h1 class="login-form-title">Wortel</h1>

      <form @submit.prevent="handleLogin">
        <div>
          <label for="username">Benutzername</label>
          <input id="username" type="text" placeholder="Benutzername" v-model="username" required />
        </div>

        <div>
          <label for="password">Passwort</label>
          <input id="password" type="password" placeholder="Passwort" v-model="password" required />
        </div>

        <Transition name="form-field">
          <div v-if="isRegistering">
            <label for="confirm-password">Passwort bestätigen</label>
            <input id="confirm-password" type="password" placeholder="Passwort bestätigen" v-model="confirmPassword" :required="isRegistering" />
          </div>
        </Transition>
        
        <p class="error-info">{{ errMessage }}</p>

        <button type="submit" class="submit-button">
          {{ isRegistering ? 'Registrieren' : 'Anmelden' }}
        </button>
      </form>

      <div class="toggle-container">
        <button @click="isRegistering = !isRegistering" class="toggle-button">
          {{ isRegistering ? 'Haben Sie bereits ein Konto? Anmelden' : 'Noch kein Konto? Registrieren' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped src="../styles/LoginForm.css"></style>