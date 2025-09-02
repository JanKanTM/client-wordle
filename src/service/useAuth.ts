import { ref, computed } from "vue";
import type { User, LoginRequest, RegisterRequest } from "../api/user";
import { loginUser, registerUser, getCurrentUser, logoutUser } from "../api/user";

const currentUser = ref<User | null>(null);
const isAuthenticated = computed(() => !!currentUser.value)
const authToken = ref<string | null>(sessionStorage.getItem('auth_token'))

const stateMessage = ref('')

const login = async (credentials: LoginRequest) => {
  try {
    stateMessage.value = ''

    const result = await loginUser(credentials)
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

    const result = await registerUser(credentials)
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

// Initialize user on composable creation
if (authToken.value && !currentUser.value) {
  loadCurrentUser()
}

export default function useAuth() {
  return {
    // State
    currentUser,
    isAuthenticated,
    authToken,
    message: computed(() => stateMessage.value),

    // Actions
    login,
    register,
    loadCurrentUser,
    logout
  }
}