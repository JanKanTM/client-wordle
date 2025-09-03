<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'
import LeaderboardItem from '../components/LeaderboardItem.vue'
import useLeaderboard from '../service/useLeaderboard'

const router = useRouter()

const { leaderboardUsers, isLoading, message, loadLeaderboard } = useLeaderboard()

const routeToHub = () => router.push('/hub')

const players = computed(() => 
  leaderboardUsers.value.map((user, index) => ({
    username: user.username,
    points: user.score,
    rank: index + 1
  }))
)

onMounted(() => {
  loadLeaderboard()

  const token = sessionStorage.getItem('auth_token')
  if (!token) {
    router.push('/hub')
  }
})
</script>

<template>
  <div class="leaderboard-container">
    <button class="top-container-action" @click="routeToHub">
      <ArrowLeft :size="18" />
      Zurück
    </button>

    <h2 class="leaderboard-title">Game Leaderboard</h2>
    
    <div v-if="isLoading" class="loading-state">
      Lade Leaderboard...
    </div>
    
    <div v-else-if="message && leaderboardUsers.length === 0" class="error-state">
      {{ message }}
    </div>
    
    <div v-else class="leaderboard-list">
      <LeaderboardItem
        v-for="player in players"
        :key="player.username"
        :rank="player.rank"
        :username="player.username"
        :points="player.points"
      />
    </div>
  </div>
</template>

<style scoped>
.leaderboard-container {
  max-width: 750px;
  margin: 0 auto;
  padding: 20px;
}

.leaderboard-title {
  text-align: center;
  color: #1f2937;
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 700;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 2rem;
  color: #4a5568;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error-state {
  color: #8e3737;
}

.top-container-action {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #3a3a3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  margin-bottom: 20px;
}

.top-container-action:hover {
  transform: scale(1.025);
}
</style>