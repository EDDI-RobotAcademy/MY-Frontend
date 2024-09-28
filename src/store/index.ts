import { createStore } from 'vuex'
import kakaoAuthenticationModule from '@/kakaoAuthentication/store/kakaoAuthenticationModule'
import googleAuthenticationModule from '@/googleAuthentication/store/GoogleAuthenticationModule'

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
  }
})
