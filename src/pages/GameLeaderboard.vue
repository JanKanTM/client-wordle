<script setup lang="ts">
import { computed, onMounted } from 'vue'
import LeaderboardItem from '../components/LeaderboardItem.vue'
import useLeaderboard from '../service/useLeaderboard'

const { leaderboardUsers, isLoading, message, loadLeaderboard } = useLeaderboard()

const players = computed(() => 
  leaderboardUsers.value.map((user, index) => ({
    username: user.username,
    points: user.score,
    rank: index + 1
  }))
)

onMounted(() => {
  loadLeaderboard()
})
</script>

<template>
  <div class="leaderboard-container">
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
  max-width: 600px;
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
</style>