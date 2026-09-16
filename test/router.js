import { createMemoryHistory, createRouter } from 'vue-router'

// A fresh router per test, as the Vue Test Utils guide on Vue Router asks,
// on a memory history so no browser address bar is involved. The routes
// are the application's own.
import HomeView from '../src/views/HomeView.vue'
import ProductsView from '../src/views/ProductsView.vue'
import ProductView from '../src/views/ProductView.vue'

export function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: HomeView },
      { path: '/products', name: 'products', component: ProductsView },
      { path: '/products/:id', name: 'product', component: ProductView, props: true },
    ],
  })
}
