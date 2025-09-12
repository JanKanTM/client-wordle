<template>
  <div class="game-timer">
    <span>{{ timeLeft }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRound } from '../service/useRound';
import type { RoundResponse } from '../service/useRound';

const timeLeft = ref(60);
const isTimerRunning = ref(false);
const { lastRoundMessage, startRoundListening, stopRoundListening } = useRound();

let timer: number | undefined;

onMounted(() => {
  console.log('GameTimer mounted.');
  startRoundListening();

  timer = setInterval(() => {
    if (isTimerRunning.value && timeLeft.value > 0) {
      timeLeft.value--;
    }
  }, 1000);

  watch(lastRoundMessage, (message) => {
    console.log('Received round message:', message);
    let roundData: RoundResponse | null = null;

    if (message && typeof (message as any).body === 'string') {
      try {
        roundData = JSON.parse((message as any).body);
      } catch (e) {
        console.error("Failed to parse round message body:", e);
        return;
      }
    } else {
      roundData = message as RoundResponse | null;
    }

    if (!roundData) return;

    if (roundData.round === 'started') {
      console.log('Round started -> Resetting timer to 60 and starting countdown.');
      timeLeft.value = 60;
      isTimerRunning.value = true;
    } else if (roundData.round === 'ended') {
      console.log('Round ended -> Resetting timer to 60 and stopping countdown.');
      timeLeft.value = 60;
      isTimerRunning.value = false;
    }
  }, { immediate: true });
});

onUnmounted(() => {
  console.log('GameTimer unmounted.');
  stopRoundListening();
  clearInterval(timer);
});
</script>

<style scoped>
.game-timer {
  font-size: 2rem;
  font-weight: bold;
  color: #ffffff;
}
</style>
