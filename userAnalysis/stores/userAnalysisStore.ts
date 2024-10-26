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
      const command = 7

      try {
        console.log('sendUserAnalysisToFastAPI()')
        const response = await fastapiAxiosInst.post('/request-ai-command', 
          { "command" : command,
            "data" : [
              payload.gender,
              payload.age_group,
              payload.mbti,
              payload.topic,
              payload.strength,
              payload.reveal,
              payload.platform,
              payload.interested_influencer
            ]
          }
        )
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
      user_analysis : number,
      user_analysis_answer: {[key: string]:string},
    }): Promise<any> {
      const { djangoAxiosInst } = createAxiosInstances()

      try {
        const userToken = localStorage.getItem('userToken')
        const response = await djangoAxiosInst.post('user_analysis/submit-answer',{ 
          userToken,
          user_analysis : payload.user_analysis,
          user_analysis_answer : payload.user_analysis_answer
        })
        return response.data
      } catch (error) {
        console.log('requestSubmitAnswerToDjango() 중 에러 발생')
        throw error
      }
    },

    async requestCreateUserAnalysisToDjango( payload: {
      title: string,
      description: string  
    }): Promise<any> {
      const { djangoAxiosInst } = createAxiosInstances()
      const { title, description } = payload
      try {
          const res = await djangoAxiosInst.post('/user_analysis/create', payload)
          return res.data
      } catch (error) {
          console.log('requestCreateUserAnalysisToDjango() 중 에러 발생')
          throw error
      } 
  },
  async requestCreateUserAnalysisQuestionToDjango( payload: { 
    user_analysis: number, 
    question: string, 
    user_analysis_type: number 
  }): Promise<any> {
    const { djangoAxiosInst } = createAxiosInstances()
    const { user_analysis, question, user_analysis_type } = payload
    try {
        const res = await djangoAxiosInst.post('user_analysis/create-question', {
            user_analysis,
            question,
            user_analysis_type
        })
        console.log(res.data)
        return res.data
    } catch (error) {
        console.log('requestCreateSurveyQuestionToDjango() 중 에러 발생')
        throw error
    }
  },
  async requestListUserAnalysisAnswerToDjango(payload: {
    filter: string,
    user_analysis_Id: number | null,
    question_Id: number | null,
    account_Id: number | null
  }): Promise<void> {
    const { filter, user_analysis_Id, question_Id, account_Id  } = payload
    const { djangoAxiosInst } = createAxiosInstances()
    try {
      const res = await djangoAxiosInst.post('user_analysis/list-answer', {
        filter, user_analysis_Id, question_Id, account_Id
      });
      
      const data = res.data;
      return data
    } catch (error) {
        console.error('requestListUserAnalysisAnswerToDjango() 중 에러 발생')
        throw error
    }
  },
  async requestCreateUserAnalysisSelectionToDjango(payload: { 
    question_id: number, 
    custom_text: string 
  }): Promise<any> {
    const { question_id, custom_text } = payload
    const { djangoAxiosInst } = createAxiosInstances()
    try {
        console.log(payload)
        const res = await djangoAxiosInst.post('user_analysis/create-user-analysis-selection', {
            question_id,
            custom_text
        })
        console.log(res.data)
        return res.data
    } catch (error) {
        console.log('requestCreateUserAnalysisSelectionToDjango() 중 에러 발생')
        throw error
    }
  },
  }
})