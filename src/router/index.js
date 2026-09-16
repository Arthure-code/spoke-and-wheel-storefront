import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// One page so far: home.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
  ],
})

export default router
