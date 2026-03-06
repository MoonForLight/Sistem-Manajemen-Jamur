<template>
  <header class="navbar">
    <div class="navbar-inner">
      <div class="brand">MycoFlow</div>
      <nav class="navlinks">
        <RouterLink to="/" exact-active-class="router-link-active">Landing</RouterLink>
        <RouterLink to="/edukasi">Edukasi</RouterLink>
        <RouterLink to="/data">Data</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
