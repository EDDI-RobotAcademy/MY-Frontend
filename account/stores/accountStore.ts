import { defineStore } from 'pinia'
import { createAxiosInstances } from '../../utility/axiosInstance'

interface AccountInfo {
  email: string
  nickname: string
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
          console.log("회원 가입 완료")
        }
      } catch (error) {
        console.error('신규 계정 생성 실패:', error)
        throw error
      }
    },
    async getNickname(nickname: string) {
      const { djangoAxiosInst } = createAxiosInstances()
      const userToken = localStorage.getItem("userToken")

      if (!userToken) {
          console.error('userToken is missing')
          return
      }

      try {
          const response = await djangoAxiosInst.post('user_profile/get-nickname', { userToken })
          console.log('nickname response:', response.data.nickname)
          return response.data.nickname
      } catch (error) {
          console.error('프로필 닉네임 가져오는 중 에러 발생:', error)
          throw error
      }
    }
  }
})