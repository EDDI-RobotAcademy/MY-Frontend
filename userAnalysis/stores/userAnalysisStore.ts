import { defineStore } from 'pinia'
import { createAxiosInstances } from '../../utility/axiosInstance'

interface UserAnalysisPayload {
  gender: string
  age_group: string
  mbti: string
  topic: string
  strength: string
  reveal: string
  platform: string
  interested_influencer: string
}

interface UserAnalysisInputAnswer {
  // Define the structure of UserAnalysisInputAnswer
}

export const useUserAnalysisStore = defineStore('userAnalysisStore', {
  state: () => ({}),

  actions: {
    async sendUserAnalysisToFastAPI(payload: UserAnalysisPayload): Promise<any> {
      const { fastapiAxiosInst } = createAxiosInstances()

      try {
        console.log('sendUserAnalysisToFastAPI()')
        const response = await fastapiAxiosInst.post('/growth-strategy', payload)
        return response.data
      } catch (error) {
        console.log('sendUserAnalysisToFastAPI() 중 문제 발생:', error)
        throw error
      }
    },

    async requestListQuestionToDjango(userAnalysisId: string): Promise<any> {
      const { djangoAxiosInst } = createAxiosInstances()

      try {
        const response = await djangoAxiosInst.post('user_analysis/list-question', {
          user_analysis_Id: userAnalysisId
        })
        console.log('질문 리스트: ', response.data)
        return response.data
      } catch (error) {
        console.error('requestListQuestionToDjango() 중 에러 발생')
        throw error
      }
    },

    async requestListSelectionToDjango(questionId: string): Promise<any> {
      const { djangoAxiosInst } = createAxiosInstances()

      try {
        const response = await djangoAxiosInst.post('user_analysis/list-selection', {
          question_Id: questionId
        })
        return response.data
      } catch (error) {
        console.error('requestListSelectionToDjango() 중 에러 발생')
        throw error
      }
    },

    async requestSubmitAnswerToDjango(payload: {
      user_analysis_answer: UserAnalysisInputAnswer[],
      userToken: string | null
    }): Promise<any> {
      const { user_analysis_answer, userToken } = payload
      const { djangoAxiosInst } = createAxiosInstances()

      try {
        const userToken = localStorage.getItem('userToken')
        const response = await djangoAxiosInst.post('user_analysis/submit-answer',{ 
          user_analysis_answer, userToken })
        return response.data
      } catch (error) {
        console.log('requestSubmitAnswerToDjango() 중 에러 발생')
        throw error
      }
    }
  }
})