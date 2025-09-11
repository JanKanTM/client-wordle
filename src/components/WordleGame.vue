<template>
  <div class="wordle-game">
    <header class="game-header">
      <h1>Multiplayer Wordle</h1>
      <div class="connection-status">
        <span :class="{ 'connected': isConnected, 'disconnected': !isConnected }">
          {{ isConnected ? '🟢 Verbunden' : '🔴 Nicht verbunden' }}
        </span>
      </div>
    </header>

    <main class="game-main">
      <!-- Spielfeld -->
      <div class="game-grid">
        <div 
          v-for="(row, rowIndex) in gameGrid" 
          :key="rowIndex"
          class="grid-row"
        >
          <div
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            class="grid-cell"
            :class="getCellClass(rowIndex, cellIndex)"
          >
            {{ cell.letter }}
          </div>
        </div>
      </div>

      <!-- Spielstatus -->
      <div class="game-status">
        <p>Versuch: {{ currentAttempt + 1 }} / {{ maxAttempts }}</p>
        <p v-if="gameWon" class="win-message">Gewonnen! Das Wort war richtig!</p>
        <p v-else-if="currentAttempt >= maxAttempts" class="lose-message">Verloren! Keine Versuche mehr übrig.</p>
      </div>

      <!-- Alphabet -->
      <div class="alphabet">
        <div class="alphabet-row" v-for="(row, index) in keyboardRows" :key="index">
          <button
            v-for="key in row"
            :key="key"
            :class="getDynamicKeyClass(key)"
            @click="handleKeyPress(key)"
            :disabled="isKeyDisabled(key)"
          >
            {{ key === 'ENTER' ? '↵' : (key === 'BACKSPACE' ? '⌫' : key) }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useGuess, type GuessResponse, type GuessResult } from '../service/useGuess'

interface GameCell {
  letter: string
  status: 'correct' | 'present' | 'absent' | 'empty' | 'pending'
}

const { lastResponse, isConnected, subscribeToGuess, submitGuess } = useGuess()

// Game State
const maxAttempts = ref(6)
const currentAttempt = ref(0)
const currentGuess = ref('')
const gameWon = ref(false)
const isSubmitting = ref(false)
const gameGrid = ref<GameCell[][]>([])
const letterStates = ref<{ [key: string]: 'correct' | 'present' | 'absent' }>({})

// Keyboard Layout
const keyboardRows = [
  ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
]

// Computed Properties
const canSubmit = computed(() => {
  return currentGuess.value.length === 5 && 
         isConnected.value && 
         !gameWon.value && 
         currentAttempt.value < maxAttempts.value
})

// Initialize Game Grid
const initializeGrid = () => {
  gameGrid.value = Array.from({ length: maxAttempts.value }, () => 
    Array.from({ length: 5 }, () => ({ letter: '', status: 'empty' as const }))
  )
}

// Handle Key Press from virtual or physical keyboard
const handleKeyPress = (key: string) => {
  if (gameWon.value || currentAttempt.value >= maxAttempts.value || isSubmitting.value) return

  if (key === 'ENTER') {
    submitCurrentGuess()
  } else if (key === 'BACKSPACE') {
    deleteLetter()
  } else if (key.length === 1 && key.match(/[A-Z]/)) {
    addLetterToGuess(key)
  }
}

// Add Letter to Current Guess
const addLetterToGuess = (letter: string) => {
  if (currentGuess.value.length < 5) {
    currentGuess.value += letter
  }
}

// Delete Letter
const deleteLetter = () => {
  if (currentGuess.value.length > 0) {
    currentGuess.value = currentGuess.value.slice(0, -1)
  }
}

// Update Current Row Display
const updateCurrentRow = () => {
  if (currentAttempt.value < maxAttempts.value) {
    const row = gameGrid.value[currentAttempt.value]
    for (let i = 0; i < 5; i++) {
      if (i < currentGuess.value.length) {
        row[i].letter = currentGuess.value[i]
        row[i].status = 'pending'
      } else {
        row[i].letter = ''
        row[i].status = 'empty'
      }
    }
  }
}

// Submit Current Guess
const submitCurrentGuess = () => {
  if (!canSubmit.value || isSubmitting.value) return

  isSubmitting.value = true
  console.log(`Submitting guess: ${currentGuess.value}, attempt: ${currentAttempt.value + 1}`)
  submitGuess(currentGuess.value, currentAttempt.value + 1)
}

// Process Guess Response
const processGuessResponse = (response: GuessResponse) => {
  console.log('Processing guess response:', response)
  
  if (currentAttempt.value < maxAttempts.value) {
    const row = gameGrid.value[currentAttempt.value]
    
    response.result.forEach((result: GuessResult, index: number) => {
      row[index].letter = result.letter
      row[index].status = result.status
      
      const currentState = letterStates.value[result.letter]
      if (!currentState || 
          (currentState === 'absent' && result.status !== 'absent') ||
          (currentState === 'present' && result.status === 'correct')) {
        letterStates.value[result.letter] = result.status
      }
    })
    
    if (response.isWin) {
      gameWon.value = true
      console.log('Game won!')
    }
    
    currentAttempt.value++
    currentGuess.value = ''
    isSubmitting.value = false
  }
}

// --- Styling and Class Helpers ---

const getCellClass = (rowIndex: number, cellIndex: number) => {
  const cell = gameGrid.value[rowIndex]?.[cellIndex]
  return cell ? `grid-cell cell-${cell.status}` : 'grid-cell'
}

const getDynamicKeyClass = (key: string) => {
  if (key === 'ENTER' || key === 'BACKSPACE') {
    return 'control-key'
  }
  const state = letterStates.value[key]
  return state ? `alphabet-key key-${state}` : 'alphabet-key'
}

const isKeyDisabled = (key: string) => {
  if (isSubmitting.value) {
    return true
  }
  if (gameWon.value || currentAttempt.value >= maxAttempts.value) {
    return true
  }
  if (key === 'ENTER') {
    return !canSubmit.value
  }
  if (key === 'BACKSPACE') {
    return currentGuess.value.length === 0
  }
  return false
}

// --- Lifecycle and Event Listeners ---

const handleKeyDown = (event: KeyboardEvent) => {
  const key = event.key.toUpperCase()
  if (key === 'ENTER') {
    event.preventDefault()
    handleKeyPress('ENTER')
  } else if (key === 'BACKSPACE') {
    event.preventDefault()
    handleKeyPress('BACKSPACE')
  } else if (key.length === 1 && key >= 'A' && key <= 'Z') {
    event.preventDefault()
    handleKeyPress(key)
  }
}

onMounted(() => {
  initializeGrid()
  subscribeToGuess()
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

// Watch for guess responses
watch(lastResponse, (newResponse) => {
  if (newResponse) {
    processGuessResponse(newResponse)
  }
})

// Watch current guess for live update
watch(currentGuess, () => {
  updateCurrentRow()
})
</script>

<style scoped>
.wordle-game {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.game-header {
  text-align: center;
  margin-bottom: 30px;
}

.game-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.connection-status {
  font-size: 14px;
}

.connected {
  color: #27ae60;
  font-weight: bold;
}

.disconnected {
  color: #e74c3c;
  font-weight: bold;
}

.game-grid {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 30px;
  justify-content: center;
  align-items: center;
}

.grid-row {
  display: flex;
  gap: 5px;
}

.grid-cell {
  width: 50px;
  height: 50px;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.cell-empty {
  background-color: #ffffff;
  border-color: #d1d5db;
}

.cell-pending {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.cell-correct {
  background-color: #22c55e;
  color: white;
  border-color: #16a34a;
}

.cell-present {
  background-color: #eab308;
  color: white;
  border-color: #ca8a04;
}

.cell-absent {
  background-color: #6b7280;
  color: white;
  border-color: #4b5563;
}

.game-status {
  text-align: center;
  margin-bottom: 30px;
}

.win-message {
  color: #22c55e;
  font-weight: bold;
  font-size: 18px;
}

.lose-message {
  color: #ef4444;
  font-weight: bold;
  font-size: 18px;
}

.alphabet {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.alphabet-row {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.alphabet-key, .control-key {
  height: 45px;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alphabet-key {
  width: 40px;
}

.control-key {
  width: 60px;
  background-color: #d1d5db;
}

.alphabet-key:hover:not(:disabled), .control-key:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.alphabet-key:disabled, .control-key:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.key-correct {
  background-color: #22c55e !important;
  color: white;
  border-color: #16a34a;
}

.key-present {
  background-color: #eab308 !important;
  color: white;
  border-color: #ca8a04;
}

.key-absent {
  background-color: #6b7280 !important;
  color: white;
  border-color: #4b5563;
}

@media (max-width: 640px) {
  .wordle-game {
    padding: 10px;
  }
  
  .grid-cell {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
  
  .alphabet-key {
    width: 30px;
    height: 40px;
    font-size: 12px;
  }

  .control-key {
    width: 45px;
    font-size: 12px;
  }
}
</style>