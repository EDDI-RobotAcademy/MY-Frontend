import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import DashBoardRoutes from '@/dashboard/router/DashBoardRoutes'
import KakaoAuthenticationRoutes from '@/kakaoAuthentication/router/KakaoAuthenticationRoutes'
import GoogleAuthenticationRoutes from '@/googleAuthentication/router/GoogleAuthenticationRoutes'


const routes: Array<RouteRecordRaw> = [
  ...DashBoardRoutes,
  ...KakaoAuthenticationRoutes,
  ...GoogleAuthenticationRoutes,
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
