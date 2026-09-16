<script setup>
import { computed, ref, watch } from 'vue'

// The list receives the catalogue and shows each bike on one row of three
// cells: name, description, price; a discontinued model is written in red.
// Clicking a bike tells the parent which one, and the chosen row turns blue.
// Above the rows: a search field, three sort buttons and a pager. The rows
// shown are the catalogue filtered, then sorted, then cut to one page.
const props = defineProps({
  products: { type: Array, required: true },
  selected: { type: Object, default: null },
  perPage: { type: Number, default: 10 },
})

const emit = defineEmits(['select'])

const title = 'Our bikes'

const isSelected = (product) => props.selected !== null && props.selected.id === product.id

// Search: the field is bound with v-model; the match is case-insensitive.
const filterName = ref('')

const filteredProducts = computed(() => {
  const filter = new RegExp(filterName.value, 'i')
  return props.products.filter((product) => product.name.match(filter))
})

// Sort: the first click on a button sorts ascending, a second click on the
// same button flips the direction.
const sortName = ref('')
const sortDir = ref(1)

function sort(name) {
  sortDir.value = sortName.value === name ? -sortDir.value : 1
  sortName.value = name
}

// Numbers, strings and ISO dates all compare with < and >.
function compare(x, y) {
  if (x < y) return -1
  if (x > y) return 1
  return 0
}

const sortedFilteredProducts = computed(() => {
  const name = sortName.value
  if (name === '') return filteredProducts.value
  return [...filteredProducts.value].sort((a, b) => compare(a[name], b[name]) * sortDir.value)
})

// Pagination: the page number starts at 1; the buttons stop at both ends.
const currentPage = ref(1)

const pageCount = computed(() => Math.max(1, Math.ceil(sortedFilteredProducts.value.length / props.perPage)))

const sortedFilteredPaginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * props.perPage
  return sortedFilteredProducts.value.slice(start, start + props.perPage)
})

function previousPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < pageCount.value) currentPage.value++
}

// A new page, a new search or a new order drops the selection, and a search
// that shrinks the list brings the page back into range.
watch(currentPage, () => emit('select', null))
watch([filterName, sortName, sortDir], () => {
  currentPage.value = 1
  emit('select', null)
})

function sortLabel(name) {
  if (sortName.value !== name) return ''
  return sortDir.value === 1 ? ' ↑' : ' ↓'
}
</script>
<template>
  <section>
    <h2 class="h5">{{ title }}</h2>
    <p class="text-muted small">Click a bike to see its picture and details.</p>
    <form class="product-tools" @submit.prevent>
      <span>Sort by:</span>
      <button type="button" class="btn btn-light btn-sm border" data-testid="sort-name" :aria-pressed="sortName === 'name'" @click="sort('name')">Name{{ sortLabel('name') }}</button>
      <button type="button" class="btn btn-light btn-sm border" data-testid="sort-price" :aria-pressed="sortName === 'price'" @click="sort('price')">Price{{ sortLabel('price') }}</button>
      <button type="button" class="btn btn-light btn-sm border" data-testid="sort-date" :aria-pressed="sortName === 'modifiedDate'" @click="sort('modifiedDate')">Date{{ sortLabel('modifiedDate') }}</button>
      <label for="filterName" class="ms-auto">Search by name:</label>
      <input id="filterName" v-model="filterName" type="search" class="form-control form-control-sm w-auto" data-testid="search" autocomplete="off">
    </form>
    <nav class="product-pager" aria-label="Pages of bikes">
      <button type="button" class="btn btn-light btn-sm border" data-testid="previous" :disabled="currentPage === 1" @click="previousPage">&lt; Previous</button>
      <span aria-live="polite" data-testid="page">Page {{ currentPage }} of {{ pageCount }}</span>
      <button type="button" class="btn btn-light btn-sm border" data-testid="next" :disabled="currentPage === pageCount" @click="nextPage">Next &gt;</button>
    </nav>
    <p v-if="sortedFilteredPaginatedProducts.length === 0" class="text-muted" data-testid="no-match">No bike matches that name.</p>
    <div class="product-list">
      <button
        v-for="product in sortedFilteredPaginatedProducts"
        :key="product.id"
        type="button"
        class="product-row"
        data-testid="product"
        :class="{ discontinued: product.discontinued, selected: isSelected(product) }"
        :aria-pressed="isSelected(product)"
        @click="$emit('select', product)"
      >
        <span class="product-cell product-cell--dark">{{ product.name }}</span>
        <span class="product-cell product-cell--light">{{ product.description }}</span>
        <span class="product-cell product-cell--dark">{{ product.price.toFixed(2) }} $</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
/* The tool bar and the pager sit above the rows, as in the reference. */
.product-tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem;
  margin-bottom: 0.75rem;
  border: 1px solid #5d7987;
}

.product-pager {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

/* Three cells per row: dark, light, dark. The selected row turns blue, the
   discontinued one is written in red on light cells; both come from a class
   on the row. Every pair of colours reaches the 4.5:1 contrast of WCAG AA. */
.product-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-row {
  display: grid;
  grid-template-columns: 2fr 3fr 1fr;
  gap: 0.25rem;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  text-align: left;
  font: inherit;
  cursor: pointer;
}

.product-cell {
  padding: 0.35rem 0.6rem;
  border: 1px solid #9bacb4;
}

.product-cell--dark {
  background: #5d7987;
  color: #fff;
}

.product-cell--light {
  background: #eee;
  color: #212529;
}

.product-row.selected .product-cell--dark {
  background: #0026ff;
  border-color: #0026ff;
}

.product-row.selected .product-cell--light {
  background: #0072bf;
  border-color: #0072bf;
  color: #fff;
}

.product-row.discontinued:not(.selected) .product-cell {
  background: #eee;
  color: #b02a37;
}

.product-row:focus-visible {
  outline: 3px solid #0026ff;
  outline-offset: 2px;
}

@media (max-width: 575.98px) {
  .product-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
