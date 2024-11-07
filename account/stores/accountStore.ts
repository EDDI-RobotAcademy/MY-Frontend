import { defineStore } from 'pinia'
import { createAxiosInstances } from '../../utility/axiosInstance'

interface AccountInfo {
  email: string
  name: string
}

export const useAccountStore = defineStore('accountStore', {
  state: () => ({}),
  actions: {
    async requestEmailDuplicationCheckToDjango(email: string): Promise<boolean> {
      const { djangoAxiosInst } = createAxiosInstances()

      try {
        const response = await djangoAxiosInst.post('/user_profile/email-duplication-check', { email })
        return response.data.isDuplicate
      } catch (error) {
        console.error('이메일 중복 체크 중 에러가 발생했습니다:', error)
        throw error
      }
    },
    async requestCreateNewAccountToDjango(accountInfo: AccountInfo): Promise<void> {
      const { djangoAxiosInst } = createAxiosInstances()

      try {
        const response = await djangoAxiosInst.post('/account/register', accountInfo)
        if (response.data) {
          
        }
      } catch (error) {
        console.error('신규 계정 생성 실패:', error)
        throw error
      }
    },
    async requestGetUserProfileByUserTokenToDjango(): Promise<void> {
      const { djangoAxiosInst } = createAxiosInstances()
      const userToken = localStorage.getItem("userToken")

      const payload = {
        userToken: userToken,
      }
      try {
        const response = await djangoAxiosInst.post('/user_profile/get-self-profile', payload)
        if (response.data) {
          
          return response.data
        }
      } catch (error) {
        console.error('사용자 정보 요청 실패:', error)
        throw error
      }
    },
    async requestchangeNicknameToDjango(newNickname: string, userToken: string) {
      const { djangoAxiosInst } = createAxiosInstances()
      try {
        const response = await djangoAxiosInst.put('/user_profile/change-nickname', {
          newNickname: newNickname,
          userToken: userToken
        })
        if (response.data) {
          
          return response.data
        }
      } catch (error) {
        console.error('사용자 닉네임 변경 요청 실패:', error)
        throw error
      }
    },
    // 기존 함수 수정
    async requestGetUserProfileByAccountIdToDjango(accountIds: string[]): Promise<void> {
      const { djangoAxiosInst } = createAxiosInstances()

      try {
        const response = await djangoAxiosInst.post('/user_profile/nickname-by-accountid', {
          accountIds: accountIds  // 배열로 전송
        })
        if (response.data) {
          
          return response.data
        }
      } catch (error) {
        console.error('requestGetUserProfileByAccountIdToDjango 실패:', error)
        throw error
      }
    },
    async requestchangeMembershipToDjango() {
      const { djangoAxiosInst } = createAxiosInstances()
      try {
        const userToken = localStorage.getItem("userToken")

        const payload = {
          userToken: userToken,
        }
        const response = await djangoAxiosInst.put('/user_profile/change-membership', payload)
        if (response.data) {
          
          return response.data
        }
      } catch (error) {
        console.error('멤버쉽 변경 요청 실패:', error)
        throw error
      }
    },
  }
})