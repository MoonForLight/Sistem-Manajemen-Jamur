<template>
  <div class="frame">
    <AppHeader />
    <main>
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
</script>

<style scoped>
.frame {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  width: 100%;
}
</style>
