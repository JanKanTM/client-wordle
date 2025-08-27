<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const WORD_LENGTH = 5
const MAX_GUESSES = 6

// Eine einfache Wortliste für die Demo
const wordList = ['APFEL', 'HAUSE', 'WORTE', 'SPIEL', 'SONNE', 'TISCH', 'STUHL']
const targetWord = ref('')

const guesses = ref<string[]>(Array(MAX_GUESSES).fill(''))
const currentRow = ref(0)
const currentGuess = ref('')
const gameStatus = ref<'playing' | 'won' | 'lost'>('playing')
const message = ref('')
const letterStates = ref<Record<string, 'correct' | 'present' | 'absent'>>({})

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
          // Logik zur Bestimmung des Zustands (correct, present, absent)
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
  targetWord.value = wordList[Math.floor(Math.random() * wordList.length)]
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

onMounted(() => {
  startNewGame()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="wordle-container">
    <h1 class="game-title">Wortel</h1>
    
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

<style scoped src="../styles/WordleGame.css"></style>