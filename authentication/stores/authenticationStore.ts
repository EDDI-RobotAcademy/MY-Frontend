// stores/authenticationStore.ts

import { defineStore } from 'pinia'
import { createAxiosInstances } from '../../utility/axiosInstance'

export const useAuthenticationStore = defineStore('authentication', {
  state: () => ({
    isAuthenticated: false,
    isAdmin: false
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

        await this.checkAndSetAuthStatus()
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

          await this.checkAndSetAuthStatus()
        }
      } catch (error) {
        console.error('requestLogoutToDjango() 중 에러 발생:', error)
        throw error
      }
    },

    async checkAndSetAuthStatus(): Promise<void> {
      const { djangoAxiosInst } = createAxiosInstances()
      const userToken = localStorage.getItem("userToken")
      if (userToken) {
        console.log("User token found in localStorage")
        console.log("userToken: ", userToken)
        this.isAuthenticated = true
        
        try{
          const res = await djangoAxiosInst.post('/account/roletype-check',{
            userToken
          })
          if (res.data === "ADMIN"){
            console.log("관리자 계정입니다.")
            this.isAdmin = true
          }
          else {
            console.log("관리자 계정이 아닙니다.")
            this.isAdmin = false
          }
        } catch (error){
          console.error("관리자 확인 중 오류 발생: ", error);
          this.isAdmin = false
        }
      } else {
        this.isAuthenticated = false
        this.isAdmin = false
      }
    }
  },

  getters: {
    getIsAuthenticated: (state) => state.isAuthenticated
  }
})