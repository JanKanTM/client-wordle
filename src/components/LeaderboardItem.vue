<script setup lang="ts">
import { Trophy, Medal, CrownIcon } from 'lucide-vue-next'

interface Props {
  rank: number
  username: string
  points: number
}

defineProps<Props>()

const formatPoints = (points: number): string => {
  return points.toLocaleString()
}

const getIcon = (rank: number) => {
  if (rank === 1) return CrownIcon
  if (rank <= 3) return Medal
  return Trophy
}

const getBackgroundColor = (rank: number): string => {
  switch(rank) {
    case 1: return '#fbbf24' // Gold
    case 2: return '#9ca3af' // Silber
    case 3: return '#cd7c2f' // Bronze
    default: return '#cbd5e0'
  }
}
</script>

<template>
  <div class="leaderboard-item">
    <div class="icon-container" :style="{ backgroundColor: getBackgroundColor(rank) }">
      <component :is="getIcon(rank)" class="icon" />
    </div>
    
    <div class="rank">
      #{{ rank }}
    </div>
    
    <div class="username">
      {{ username }}
    </div>
    
    <div class="points-container">
      <div class="points">{{ formatPoints(points) }}</div>
      <div class="points-label">Scoring</div>
    </div>
  </div>
</template>

<style scoped>
.leaderboard-item {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.leaderboard-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.icon-container {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.icon {
  font-size: 24px;
}

.rank {
  font-size: 18px;
  font-weight: 700;
  color: #6b7280;
  margin-right: 16px;
  min-width: 40px;
  flex-shrink: 0;
}

.username {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-right: 16px;
}

.points-container {
  text-align: right;
  flex-shrink: 0;
}

.points {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.points-label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>