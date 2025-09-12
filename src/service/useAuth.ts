import { ref, computed } from "vue";
import type { User, LoginRequest, RegisterRequest, UpdateUsernameRequest, UpdatePasswordRequest } from "../api/user";
import { loginUser, registerUser, getCurrentUser, logoutUser, updateUsername, updatePassword } from "../api/user";

const currentUser = ref<User | null>(null);
const isAuthenticated = computed(() => !!currentUser.value)
const isAdmin = computed(() => currentUser.value?.role === "ADMIN");
const authToken = ref<string | null>(sessionStorage.getItem('auth_token'))

const stateMessage = ref('')

const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const login = async (credentials: LoginRequest) => {
  try {
    stateMessage.value = ''
    
    const hashedCredentials = {
      ...credentials,
      password: await hashPassword(credentials.password)
    }

    const result = await loginUser(hashedCredentials)
    currentUser.value = result.user
    authToken.value = result.token

    // Store token in sessionStorage
    sessionStorage.setItem("auth_token", result.token);

    stateMessage.value = 'Login erfolgreich!'

    return result
  } catch (error) {
    stateMessage.value = 'Login fehlgeschlagen!'
  }
}

const register = async (credentials: RegisterRequest) => {
  try {
    stateMessage.value = ''

    const hashedCredentials = {
      ...credentials,
      password: await hashPassword(credentials.password)
    }

    const result = await registerUser(hashedCredentials)
    currentUser.value = result.user
    authToken.value = result.token

    // Store token in sessionStorage
    sessionStorage.setItem("auth_token", result.token);

    stateMessage.value = 'Regestrierung erfolgreich!'
    return result
  } catch (error) {
    stateMessage.value = 'Regestrierung fehlgeschlagen!'
  }
}

const loadCurrentUser = async () => {
  if (!authToken.value) return

  try {
    const user = await getCurrentUser()
    currentUser.value = user
  } catch(error) {
    // if token is invalid -> clear
    logout()
  }
}

const logout = () => {
  try {
    logoutUser()
    currentUser.value = null
    authToken.value = null
    stateMessage.value = 'Erfolgreich abgemeldet!'
  } catch(error) {
    stateMessage.value = 'Abmeldung fehlgeschlagen!'
  }
}

const updateName = async (userId: string, data: UpdateUsernameRequest) => {
  try {
    stateMessage.value = ''
    const updatedUser = await updateUsername(userId, data)
    currentUser.value = updatedUser
    stateMessage.value = 'Benutzername erfolgreich aktualisiert!'
    return updatedUser
  } catch (error) {
    stateMessage.value = 'Fehler beim Aktualisieren des Benutzernamens.'
  }
}

const updatePass = async (userId: string, data: UpdatePasswordRequest) => {
  try {
    stateMessage.value = ''
    const updatedUser = await updatePassword(userId, data)
    currentUser.value = updatedUser
    stateMessage.value = 'Passwort erfolgreich aktualisiert!'
    return updatedUser
  } catch (error) {
    stateMessage.value = 'Fehler beim Aktualisieren des Passworts.'
  }
}

// Initialize user on composable creation
if (authToken.value && !currentUser.value) {
  loadCurrentUser()
}

export default function useAuth() {
  return {
    // State
    currentUser,
    isAuthenticated,
    isAdmin,
    authToken,
    message: computed(() => stateMessage.value),

    // Actions
    login,
    register,
    loadCurrentUser,
    logout,
    updateName,
    updatePass
  }
}