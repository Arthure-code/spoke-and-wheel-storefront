<script setup>
import { onMounted, ref } from 'vue'
import ProductList from '../components/ProductList.vue'
import ProductDetail from '../components/ProductDetail.vue'
import { getProducts } from '../services/ProductService.js'

// The catalogue is asked for once, when the view is mounted; until it
// arrives a line says so. The bike clicked is shown under the list.
const products = ref([])
const loading = ref(true)
const error = ref('')
const selected = ref(null)

onMounted(async () => {
  try {
    products.value = await getProducts()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <p v-if="loading" class="text-muted" data-testid="loading">Loading the catalogue...</p>
  <p v-else-if="error" class="text-danger" role="alert" data-testid="error">{{ error }}</p>
  <ProductList v-else :products="products" :per-page="10" :selected="selected" @select="selected = $event" />
  <ProductDetail v-if="selected" :product="selected" class="mt-4" />
</template>
