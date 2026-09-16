<script setup>
import { RouterLink, RouterView } from 'vue-router'
import logo from './assets/logo.svg'
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <header>
      <nav class="navbar navbar-expand navbar-light bg-white border-bottom shadow-sm mb-3" aria-label="Site">
        <div class="container">
          <RouterLink to="/" class="navbar-brand d-flex align-items-center gap-2">
            <img :src="logo" width="48" height="30" alt="">
            Spoke &amp; Wheel
          </RouterLink>
          <ul class="navbar-nav">
            <li class="nav-item"><RouterLink to="/" class="nav-link text-dark">Home</RouterLink></li>
          </ul>
        </div>
      </nav>
    </header>
    <main class="container flex-grow-1 pb-5">
      <RouterView />
    </main>
    <footer class="border-top py-3 text-muted">
      <div class="container">&copy; 2026 - Spoke &amp; Wheel - <a href="https://github.com/Arthure-code/spoke-and-wheel-storefront/blob/main/LICENSE">Licence</a></div>
    </footer>
  </div>
</template>

<style>
/* The page being shown is the menu entry written in bold. */
.nav-link.router-link-active {
  font-weight: 600;
}
</style>
