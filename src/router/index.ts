import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import KakaoAuthenticationRoutes from '@/kakaoAuthentication/router/KakaoAuthenticationRoutes'
import GoogleAuthenticationRoutes from '@/googleAuthentication/router/GoogleAuthenticationRoutes'
import SurveyRoutes from '@/survey/router/SurveyRoutes'
import HomeRoutes from '@/home/router/HomeRoutes'
import NaverAuthenticationRoutes from '@/naverAuthentication/router/NaverAuthenticationRoutes'
import LoginRoutes from '@/account/router/LoginRoutes'
import ChatbotRoutes from '@/chatbot/router/ChatbotRoutes'



const routes: Array<RouteRecordRaw> = [
  ...HomeRoutes,
  ...LoginRoutes,
  ...KakaoAuthenticationRoutes,
  ...GoogleAuthenticationRoutes,
  ...NaverAuthenticationRoutes,
  ...SurveyRoutes,
  ...ChatbotRoutes,
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
