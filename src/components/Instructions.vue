<script setup lang="ts">
import { X } from 'lucide-vue-next';

defineProps<{
  show: boolean;
}>();

const emit = defineEmits(['close']);
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="emit('close')">
      <div class="modal-content">
        <button class="close-button" @click="emit('close')">
          <X :size="28" />
        </button>
        <h2>Anleitung</h2>
        <p>Errate das Wort in 6 Versuchen.</p>
        <ul>
          <li>Jeder Versuch muss ein gültiges Wort mit 5 Buchstaben sein.</li>
          <li>Drücke die Enter-Taste, um deinen Versuch abzuschicken.</li>
          <li>Nach jedem Versuch ändert sich die Farbe der Kacheln, um anzuzeigen, wie nah du am richtigen Wort bist.</li>
          <li>Spiele gegen andere und sieh ihre Versuche in Echtzeit.</li>
        </ul>
        <div class="examples">
            <p><strong>Beispiele</strong></p>
            <div class="example">
                <div class="tile correct">A</div>
                <div class="tile">P</div>
                <div class="tile">F</div>
                <div class="tile">E</div>
                <div class="tile">L</div>
            </div>
            <p>Der Buchstabe A ist im Wort und an der richtigen Stelle.</p>

            <div class="example">
                <div class="tile">W</div>
                <div class="tile present">O</div>
                <div class="tile">R</div>
                <div class="tile">T</div>
                <div class="tile">E</div>
            </div>
            <p>Der Buchstabe O ist im Wort, aber an der falschen Stelle.</p>

            <div class="example">
                <div class="tile">S</div>
                <div class="tile">T</div>
                <div class="tile">U</div>
                <div class="tile absent">H</div>
                <div class="tile">L</div>
            </div>
            <p>Der Buchstabe H ist in keiner Stelle im Wort.</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 25px 35px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  position: relative;
  width: 90%;
  max-width: 500px;
  color: #333;
}

.modal-content h2 {
    margin-top: 0;
    color: #3a3a3c;
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: 20px;
}

.modal-content p, .modal-content li {
    font-size: 1rem;
    line-height: 1.6;
}

.modal-content ul {
    padding-left: 20px;
    margin-bottom: 20px;
    list-style-type: disc;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  transition: color 0.2s;
}

.close-button:hover {
    color: #333;
}

.examples {
    border-top: 1px solid #eee;
    margin-top: 20px;
    padding-top: 15px;
}

.example {
    display: flex;
    gap: 5px;
    margin-bottom: 10px;
}

.tile {
  width: 40px;
  height: 40px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  border: 2px solid #d3d6da;
  box-sizing: border-box;
  color: white;
}

.tile.correct {
  background-color: #5e8d64;
  border-color: #5e8d64;
}

.tile.present {
  background-color: #c9b458;
  border-color: #c9b458;
}

.tile.absent {
  background-color: #787c7e;
  border-color: #787c7e;
}
</style>
