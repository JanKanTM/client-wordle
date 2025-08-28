<script setup lang="ts">
import { ref } from 'vue'
import type { LoginRequest, RegisterRequest, User } from '../types/user'
import { loginUser, registerUser } from '../api/user'

const emit = defineEmits(['login-success'])

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const isRegistering = ref(false)

// In-memory user store to simulate a backend
const users = ref(JSON.parse(localStorage.getItem('users') || '[]'))

const handleSubmit = async () => {
  if (!username.value || !password.value) {
      alert("Benutzername und Passwort sind erforderlich.");
      return;
  }

  if (isRegistering.value) {
    // Registration logic
    if (password.value !== confirmPassword.value) {
      alert("Die Passwörter stimmen nicht überein!");
      return;
    }
    if (password.value.length < 4) {
      alert("Das Passwort muss mindestens 4 Zeichen lang sein.");
      return;
    }

    // Create new user (simulation)
    users.value.push({ username: username.value, password: password.value });
    localStorage.setItem('users', JSON.stringify(users.value));

    // Automatically log in
    localStorage.setItem('user', JSON.stringify({ username: username.value, isLoggedIn: true }));
    emit('login-success');

  } else {
    // Login logic
    const userExists = users.value.find(u => u.username === username.value);

    if (userExists) {
      if (userExists.password === password.value) {
        localStorage.setItem('user', JSON.stringify({ username: username.value, isLoggedIn: true }));
        emit('login-success');
      } else {
        alert("Falsches Passwort!");
      }
    } else {
      alert("Benutzerkonto nicht gefunden. Bitte registrieren Sie sich.");
    }
  }
}

// alles drüber soll gelöscht werden

const userData = ref<User | null>(null);

// soll ausgetauscht werden mit handleSubmit
async function handleLogin() {
  try {
    if (isRegistering.value) {
      // password check
      if (!username.value || !password.value) {
        alert("Benutzername und Passwort sind erforderlich.");
        return;
      }

      // Register
      const credentials: RegisterRequest = {
        username: username.value,
        password: password.value,
      };

      userData.value = await registerUser(credentials);
      console.log("Registrierung erfolgreich:", userData.value);

      isRegistering.value = false;
    } else {
      // Login
      const credentials: LoginRequest = {
        username: username.value,
        password: password.value,
      };

      userData.value = await loginUser(credentials);
      console.log("Login erfolgreich:", userData.value);
    }
  } catch (err) {
    console.error("Fehler beim Login:", err);
  }
}
</script>

<template>
  <div class="login-form-container">
    <div class="login-form-card">
      <h1 class="login-form-title">Wortel</h1>

      <form @submit.prevent="handleSubmit">
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