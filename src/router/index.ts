import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import KakaoAuthenticationRoutes from '@/kakaoAuthentication/router/KakaoAuthenticationRoutes'

const routes: Array<RouteRecordRaw> = [
  ...KakaoAuthenticationRoutes,
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
