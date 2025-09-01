<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      version: '0.0.0',
      developerName: 'Jan Hildmann'
    }
  },
  computed: {
    currentDate() {
      return new Date().toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script>

<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-item">{{ currentDate }}</div>
      <div class="footer-item">Version {{ version }}</div>
      <div class="footer-item">Entwickelt von {{ developerName }}</div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  padding: 20px;
  text-align: center;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-item {
  margin: 5px 0;
  color: #6c757d;
  font-size: 14px;
}

.footer-item:last-child {
  margin-bottom: 0;
}
</style>