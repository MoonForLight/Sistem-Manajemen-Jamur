<template>
  <div class="petugas-layout">
    <PetugasSidebar />
    <div class="main-wrapper">
      <PetugasNavbar />
      <main class="content-area">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import PetugasSidebar from '../components/petugas/PetugasSidebar.vue'
import PetugasNavbar from '../components/petugas/PetugasNavbar.vue'
</script>

<style scoped>
.petugas-layout {
  display: flex;
  min-height: 100vh;
  background-color: #fafbfc;
  font-family: 'Inter', sans-serif;
  color: #333;
}
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.content-area {
  padding: 24px 32px;
  overflow-y: auto;
}
</style>
