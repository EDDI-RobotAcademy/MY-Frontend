// stores/authenticationStore.ts

import { defineStore } from 'pinia'
import { createAxiosInstances } from '../../utility/axiosInstance'

export const useAuthenticationStore = defineStore('authentication', {
  state: () => ({
    isAuthenticated: false
  }),

  actions: {
    async requestAddRedisAccessTokenToDjango(email: string): Promise<any> {
      const { djangoAxiosInst } = createAxiosInstances()
      try {
        const response = await djangoAxiosInst.post(
          '/redis_token/redis-access-token', { email }
        )

        console.log('userToken:', response.data.userToken)

        localStorage.setItem("userToken", response.data.userToken)
        this.isAuthenticated = true
        return response.data
      } catch (error) {
        console.error('Error adding redis access token:', error)
        throw error
      }
    },

    async requestLogoutToDjango(): Promise<void> {
      const { djangoAxiosInst } = createAxiosInstances()
      try {
        const userToken = localStorage.getItem("userToken")

        const res = await djangoAxiosInst.post('/redis_token/logout', {
          userToken: userToken
        })

        console.log('res:', res.data.isSuccess)
        if (res.data.isSuccess === true) {
          this.isAuthenticated = false
          localStorage.removeItem("userToken")
        }
      } catch (error) {
        console.error('requestLogoutToDjango() 중 에러 발생:', error)
        throw error
      }
    },

    checkAndSetAuthStatus(): void {
      const userToken = localStorage.getItem("userToken")
      if (userToken) {
        console.log("User token found in localStorage")
        this.isAuthenticated = true
      } else {
        this.isAuthenticated = false
      }
    }
  },

  getters: {
    getIsAuthenticated: (state) => state.isAuthenticated
  }
})