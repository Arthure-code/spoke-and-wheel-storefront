import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// Three pages: home, the catalogue, one product. The last two are loaded
// when first visited.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/products', name: 'products', component: () => import('../views/ProductsView.vue') },
    { path: '/products/:id', name: 'product', component: () => import('../views/ProductView.vue'), props: true },
  ],
})

export default router
