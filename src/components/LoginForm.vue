<script setup lang="ts">
import { ref } from 'vue'
import useAuth from '../service/useAuth'

const emit = defineEmits(['login-success'])

const { login, register, message } = useAuth()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const isRegistering = ref(false)
const errMessage = ref('')

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
      if (checkUsername() && checkPassword()) {

        const credentials = {
          username: username.value,
          password: password.value,
        };

        const result = await register(credentials);

        if (result) {
          console.log('Registrierung erfolgreich:', result);
          emit('login-success');

          resetForm();
        } else {
          errMessage.value = message.value || 'Registrierung fehlgeschlagen';
        }
      }
    } else {
      // Login
      const credentials = {
        username: username.value,
        password: password.value,
      };
      
      const result = await login(credentials);

      if (result) {
        console.log('Login erfolgreich:', result);
        emit('login-success');

        resetForm();
      } else {
        errMessage.value = message.value || 'Login fehlgeschlagen';
      }
    } 
  } catch (err) {
    console.error("Fehler beim Login:", err);
    errMessage.value = 'Ein unerwarteter Fehler ist aufgetreten.';
  }
}

function checkUsername(): boolean {
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!usernameRegex.test(username.value)) {
    errMessage.value = "Der Benutzername darf nur Buchstaben und Zahlen ohne Leerzeichen enthalten.";
    return false;
  }

  const letterCount = (username.value.match(/[a-zA-Z]/g) || []).length;
  if (letterCount < 2) {
    errMessage.value = "Der Benutzername muss mindestens 2 Buchstaben enthalten.";
    return false;
  }

  return true;
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

function resetForm() {
  username.value = '';
  password.value = '';
  confirmPassword.value = '';
  errMessage.value = '';
}

function toggleMode() {
  isRegistering.value = !isRegistering.value;
  errMessage.value = '';
  confirmPassword.value = '';
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
        <button @click="toggleMode" class="toggle-button">
          {{ isRegistering ? 'Haben Sie bereits ein Konto? Anmelden' : 'Noch kein Konto? Registrieren' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped src="../styles/LoginForm.css"></style>