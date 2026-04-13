<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { authService } from './services/authService.js'

// Verify token on app load
onMounted(() => {
  if (authService.isAuthenticated()) {
    authService.verifyToken()
  }
})
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  min-height: 100vh;
}

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
