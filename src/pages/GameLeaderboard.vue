<script setup lang="ts">
import { ref } from 'vue'
// import { computed, onMounted } from 'vue'
import LeaderboardItem from '../components/LeaderboardItem.vue'
// import useLeaderboard from '../service/useLeaderboard'

// API Integration (auskommentiert für Testdaten)
/*
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

  const token = sessionStorage.getItem('auth_token')
  if (token) {
    console.log('true') // Todo
  } else {
    router.push('/hub')
  }
})
*/

// Testdaten für die Entwicklung
const players = ref([
  {
    username: "WordleMaster",
    points: 15750,
    rank: 1
  },
  {
    username: "LetterNinja",
    points: 14200,
    rank: 2
  },
  {
    username: "PuzzlePro",
    points: 13800,
    rank: 3
  },
  {
    username: "GuessKing",
    points: 12500,
    rank: 4
  },
  {
    username: "WordHunter",
    points: 11900,
    rank: 5
  },
  {
    username: "GameExplorer",
    points: 10500,
    rank: 6
  },
  {
    username: "VocabMaster",
    points: 9800,
    rank: 7
  },
  {
    username: "WordWizard",
    points: 8900,
    rank: 8
  },
  {
    username: "LetterLord",
    points: 7500,
    rank: 9
  },
  {
    username: "WordSmith",
    points: 6800,
    rank: 10
  }
])
</script>

<template>
  <div class="leaderboard-container">
    <h2 class="leaderboard-title">Game Leaderboard</h2>
    
    <!-- API Integration Template (auskommentiert für Testdaten)
    <div v-if="isLoading" class="loading-state">
      Lade Leaderboard...
    </div>
    
    <div v-else-if="message && leaderboardUsers.length === 0" class="error-state">
      {{ message }}
    </div>
    
    <div v-else class="leaderboard-list">
    -->
    
    <div class="leaderboard-list">
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
</style>