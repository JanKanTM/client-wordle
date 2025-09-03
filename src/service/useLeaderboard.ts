import { ref, computed } from "vue";
import type { User } from "../api/leaderboard";
import { getLeaderboard } from "../api/leaderboard";

const leaderboardUsers = ref<User[]>([]);
const isLoading = ref(false);
const stateMessage = ref('');

const loadLeaderboard = async () => {
  try {
    isLoading.value = true;
    stateMessage.value = '';

    const users = await getLeaderboard();
    leaderboardUsers.value = users;
    
    stateMessage.value = 'Leaderboard erfolgreich geladen!';
    return users;
  } catch (error) {
    stateMessage.value = 'Fehler beim Laden des Leaderboards!';
    leaderboardUsers.value = [];
  } finally {
    isLoading.value = false;
  }
}

export default function useLeaderboard() {
  return {
    // State
    leaderboardUsers,
    isLoading,
    message: computed(() => stateMessage.value),
    
    // Actions
    loadLeaderboard
  }
}
