<script setup lang="ts">
import { ArrowLeft, TimerIcon } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useWebSocket } from '../service/useWebSocket'

const { currentWord } = useWebSocket()

const gameTimer = 60

const WORD_LENGTH = 5
const MAX_GUESSES = 6

// Das Zielwort kommt vom WebSocket
const targetWord = computed(() => currentWord.value.toUpperCase())

const guesses = ref<string[]>(Array(MAX_GUESSES).fill(''))
const currentRow = ref(0)
const currentGuess = ref('')
const gameStatus = ref<'playing' | 'won' | 'lost'>('playing')
const message = ref('')
const letterStates = ref<Record<string, 'correct' | 'present' | 'absent'>>({})

const router = useRouter()

const keyboardRows = [
  ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
]

const board = computed(() => {
  const boardState: { letter: string; state: string }[][] = []
  for (let i = 0; i < MAX_GUESSES; i++) {
    const row: { letter: string; state: string }[] = []
    const guess = guesses.value[i]
    const isCurrentRow = i === currentRow.value

    for (let j = 0; j < WORD_LENGTH; j++) {
      const letter = isCurrentRow ? currentGuess.value[j] : guess[j]
      let state = ''

      if (letter) {
        if (isCurrentRow) {
          state = 'active'
        } else {
          const targetLetter = targetWord.value[j]
          if (letter === targetLetter) {
            state = 'correct'
          } else if (targetWord.value.includes(letter)) {
            state = 'present'
          } else {
            state = 'absent'
          }
        }
      }
      row.push({ letter: letter || '', state })
    }
    boardState.push(row)
  }
  return boardState
})

const startNewGame = () => {
  // Das Zielwort wird jetzt vom WebSocket gesteuert
  guesses.value = Array(MAX_GUESSES).fill('')
  currentRow.value = 0
  currentGuess.value = ''
  gameStatus.value = 'playing'
  message.value = ''
  letterStates.value = {}
}

const submitGuess = () => {
  if (gameStatus.value !== 'playing') return

  if (currentGuess.value.length !== WORD_LENGTH) {
    message.value = 'Nicht genügend Buchstaben'
    setTimeout(() => (message.value = ''), 2000)
    return
  }

  // Update letter states for the keyboard
  for (let i = 0; i < currentGuess.value.length; i++) {
    const letter = currentGuess.value[i]
    if (targetWord.value[i] === letter) {
      letterStates.value[letter] = 'correct'
    } else if (targetWord.value.includes(letter)) {
      if (letterStates.value[letter] !== 'correct') {
        letterStates.value[letter] = 'present'
      }
    } else {
      letterStates.value[letter] = 'absent'
    }
  }

  guesses.value[currentRow.value] = currentGuess.value

  if (currentGuess.value === targetWord.value) {
    gameStatus.value = 'won'
    message.value = 'Gewonnen! Super!'
  } else if (currentRow.value === MAX_GUESSES - 1) {
    gameStatus.value = 'lost'
    message.value = `Verloren! Das Wort war: ${targetWord.value}`
  } else {
    currentRow.value++
    currentGuess.value = ''
  }
}

const handleKey = (key: string) => {
  if (gameStatus.value !== 'playing') return

  if (key === 'Enter') {
    submitGuess()
  } else if (key === 'Backspace') {
    currentGuess.value = currentGuess.value.slice(0, -1)
  } else if (currentGuess.value.length < WORD_LENGTH && /^[A-ZÄÖÜ]$/i.test(key)) {
    currentGuess.value += key.toUpperCase()
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleKey('Enter')
  } else if (e.key === 'Backspace') {
    handleKey('Backspace')
  } else if (e.key.length === 1 && e.key.match(/[a-zA-ZäöüÄÖÜ]/i)) {
    handleKey(e.key)
  }
}

watch(currentWord, (newWord, oldWord) => {
  if (newWord && oldWord && newWord.toUpperCase() !== oldWord.toUpperCase()) {
    message.value = 'Ein neues Wort ist da! Das Spiel wird zurückgesetzt.'
    setTimeout(() => (message.value = ''), 3000)
    startNewGame()
  }
})

onMounted(() => {
  startNewGame()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

//route
const routeToHub = () => {
  router.push('/hub');
}
</script>

<template>
  <div class="wordle-container">
    <div class="top-container">
      <button class="top-container-action" @click="routeToHub">
        <ArrowLeft :size="18" />
        Verlassen
      </button>

      <h1 class="game-title">Wortel</h1>

      <div class="timer-container">
        <TimerIcon :size="18" />
        <p>{{ gameTimer }}</p>
      </div>
    </div> 
    
    <div id="game-board">
      <div v-for="(row, rowIndex) in board" :key="rowIndex" class="board-row">
        <div
          v-for="(tile, tileIndex) in row"
          :key="tileIndex"
          class="tile"
          :class="[tile.state, { filled: tile.letter }]"
        >
          {{ tile.letter }}
        </div>
      </div>
    </div>

    <div v-if="message" class="message">
      {{ message }}
      <button v-if="gameStatus !== 'playing'" @click="startNewGame" class="new-game-button">Neues Spiel</button>
    </div>

    <div id="keyboard">
      <div v-for="(row, rowIndex) in keyboardRows" :key="rowIndex" class="keyboard-row">
        <button
          v-for="key in row"
          :key="key"
          :class="['key', letterStates[key.toUpperCase()], { large: key.length > 1 }]"
          @click="handleKey(key)"
        >
          {{ key === 'Backspace' ? '⌫' : key }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wordle-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
  width: 100%;
  height: 100vh;
  justify-content: space-between;
}

.top-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 80%;
  margin: 0 auto;
}

.top-container > button {
  justify-self: start;
}

.game-title {
  font-size: 2.25rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.1em;
}

.timer-container {
  justify-self: end;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 0.875rem;
  font-weight: bold;
  color: white;
  background-color: #3a3a3c;
  border: 0;
  border-radius: 8px;
  font-family: inherit;
}
.timer-container p {
  font-size: 16px;
}

.top-container-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 0.875rem;
  font-weight: bold;
  color: white;
  background-color: #3a3a3c;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-family: inherit;
}

.top-container-action:hover {
  transform: scale(1.025);
}

#game-board {
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  gap: 5px;
  width: 100%;
  max-width: 350px;
  height: 420px;
  margin: 20px 0;
}

.board-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
}

.tile {
  width: 100%;
  height: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  border: 2px solid #d3d6da;
  box-sizing: border-box;
}

.tile.filled {
  border-color: #878a8c;
}

.tile.active {
  border-color: #565758;
}

.tile.correct, .key.correct {
  background-color: #6aaa64;
  border-color: #6aaa64;
  color: white;
}

.tile.present, .key.present {
  background-color: #c9b458;
  border-color: #c9b458;
  color: white;
}

.tile.absent, .key.absent {
  background-color: #787c7e;
  border-color: #787c7e;
  color: white;
}

.message {
  padding: 16px;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  text-align: center;
}

.message .new-game-button {
  margin-left: 15px;
  padding: 8px 12px;
  font-size: 1rem;
  cursor: pointer;
  background-color: #6aaa64;
  color: white;
  border: none;
  border-radius: 4px;
}

#keyboard {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  margin: 0 auto 8px;
  gap: 6px;
}

.key {
  font-family: inherit;
  font-weight: bold;
  border: 0;
  padding: 0;
  height: 58px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  background-color: #d3d6da;
  color: #1a1a1b;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
}

.key.large {
  flex: 1.5;
}
</style>