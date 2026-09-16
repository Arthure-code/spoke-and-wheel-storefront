<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ProductList from '../components/ProductList.vue'
import { getProducts } from '../services/ProductService.js'

// The catalogue is asked for once, when the view is mounted; until it
// arrives a line says so. Clicking a bike goes to its own page.
const products = ref([])
const loading = ref(true)
const error = ref('')
const router = useRouter()

onMounted(async () => {
  try {
    products.value = await getProducts()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

function open(product) {
  if (product !== null) router.push({ name: 'product', params: { id: product.id } })
}
</script>

<template>
  <p v-if="loading" class="text-muted" data-testid="loading">Loading the catalogue...</p>
  <p v-else-if="error" class="text-danger" role="alert" data-testid="error">{{ error }}</p>
  <ProductList v-else :products="products" :per-page="10" @select="open" />
</template>
