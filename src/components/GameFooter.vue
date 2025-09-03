<template>
  <footer class="footer">
  <div>{{ new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }) }}</div>
    <span>© 2025 Jan Hildmann &ndash; Version 0.0.0</span>
  </footer>
</template>

<style scoped>
.footer {
  width: 100%;
  text-align: center;
  padding: 1rem 0;
  color: #787c7e;
  font-size: 1rem;
  position: relative;
}
</style>