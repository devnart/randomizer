import { createRouter, createWebHistory } from 'vue-router'
import RandomizerView from '../views/RandomizerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: RandomizerView
    },
    {
      path: '/randomizer',
      name: 'randomizer',
      component: RandomizerView
    }
  ]
})

export default router
