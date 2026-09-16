<script setup>
import { onMounted, ref } from 'vue'
import ProductDetail from '../components/ProductDetail.vue'
import { getProduct } from '../services/ProductService.js'

// The id comes from the route, as a prop; the product is asked for by that
// id when the view is mounted.
const props = defineProps({
  id: { type: String, required: true },
})

const product = ref(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    product.value = await getProduct(props.id)
    if (product.value === null) error.value = `There is no bike number ${props.id}.`
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-12 col-lg-8">
      <p class="mb-3"><RouterLink to="/products" data-testid="back">&lt; All the bikes</RouterLink></p>
      <p v-if="loading" class="text-muted" data-testid="loading">Loading the bike...</p>
      <p v-else-if="error" class="text-danger" role="alert" data-testid="error">{{ error }}</p>
      <ProductDetail v-else :product="product" />
    </div>
  </div>
</template>
