import { createStore } from 'vuex'
import kakaoAuthenticationModule from '@/kakaoAuthentication/store/kakaoAuthenticationModule'
import googleAuthenticationModule from '@/googleAuthentication/store/GoogleAuthenticationModule'
import naverAuthenticationModule from '@/naverAuthentication/store/naverAuthenticationModule'
import accountModule from '@/account/store/accountModule'
import authenticationModule from '@/authentication/store/authenticationModule'
import userAnalysisInputModule from '@/userAnalysis/store/userAnalysisInputModule'
import userInputModule from '@/chatbot/store/userInputModule'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    kakaoAuthenticationModule,
    googleAuthenticationModule,
    naverAuthenticationModule,
    accountModule,
    authenticationModule,
    userAnalysisInputModule,
    userInputModule,
  }
})
