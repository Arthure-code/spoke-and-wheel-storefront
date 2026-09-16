<script setup>
import logo from '../assets/logo.svg'
</script>

<template>
  <div class="text-center py-4">
    <img :src="logo" width="128" height="80" alt="" class="mb-2">
    <h1 class="display-4">Home</h1>
    <p class="mb-4">Road, city, trail and electric bikes. Thirteen models in the catalogue this season.</p>
    <RouterLink to="/products" class="btn btn-primary" data-testid="see-bikes">See the bikes</RouterLink>
  </div>
</template>
