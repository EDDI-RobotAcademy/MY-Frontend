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

interface UserAnalysisSurveyData {
  ages: string
  gender: string
  content_categories: string
  visibility: string
  platforms: string
  investment_amount: string
  upload_frequency: string
  interested_influencer: string
}

export const useUserAnalysisStore = defineStore('userAnalysisStore', {
  state: () => ({
    requests: [],
    selectedRequestDetails: null,
    currentSurveyData: null as UserAnalysisSurveyData | null,
    currentRequestId: null as number | null
  }),

  actions: {
    async sendUserAnalysisToFastAPI(payload: UserAnalysisPayload): Promise<any> {
      const { fastapiAxiosInst } = createAxiosInstances()
      const command = 7

      try {
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
         console.error('sendUserAnalysisToFastAPI 중 문제 발생:', error)
        throw error
      }
    },

    async requestListQuestionToDjango(userAnalysisId: string): Promise<any> {
      const { djangoAxiosInst } = createAxiosInstances()

      try {
        const response = await djangoAxiosInst.post('user_analysis/list-question', {
          user_analysis_Id: userAnalysisId
        })
        
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
      user_analysis: number,
      user_analysis_answer: {[key: string]:string},
    }): Promise<any> {
      const { djangoAxiosInst } = createAxiosInstances()

      try {
        const userToken = localStorage.getItem('userToken') || localStorage.getItem('guestToken');
        const response = await djangoAxiosInst.post('user_analysis/submit-answer',{ 
          userToken,
          user_analysis: payload.user_analysis,
          user_analysis_answer: payload.user_analysis_answer
        })
        return response.data
      } catch (error) {
         console.error('sendUserAnalysisToFastAPI중 에러 발생')
        throw error
      }
    },

    async requestCreateUserAnalysisToDjango(payload: {
      title: string,
      description: string  
    }): Promise<any> {
      const { djangoAxiosInst } = createAxiosInstances()
      const { title, description } = payload
      try {
          const res = await djangoAxiosInst.post('/user_analysis/create', payload)
          return res.data
      } catch (error) {
           console.error('requestCreateUserAnalysisToDjango 중 에러 발생', error)
          throw error
      } 
    },

    async requestCreateUserAnalysisQuestionToDjango(payload: { 
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
          
          return res.data
      } catch (error) {
          console.error('requestCreateUserAnalysisQuestionToDjango 중 에러 발생')
          throw error
      }
    },

    async requestListUserAnalysisAnswerToDjango(payload: {
      user_analysis_id: number
    }): Promise<void> {
      const { djangoAxiosInst } = createAxiosInstances()
      try {
        const res = await djangoAxiosInst.post('user_analysis/list-answer', payload);   
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
          const res = await djangoAxiosInst.post('user_analysis/create-user-analysis-selection', {
              question_id,
              custom_text
          })
          
          return res.data
      } catch (error) {
          console.error('requestCreateUserAnalysisSelectionToDjango() 중 에러 발생')
          throw error
      }
    },

    async listAllUserAnalysisRequestToDjango(): Promise<any> {
      const { djangoAxiosInst } = createAxiosInstances();
      try {
        const res = await djangoAxiosInst.get('user_analysis/list-all-request');
        this.requests = res.data;
        return res.data;
      } catch (error) {
        console.error('listAllUserAnalysisRequestToDjango() 중 에러 발생');
        throw error;
      }
    },

    async listOwnUserAnalysisRequestToDjango(): Promise<any> {
      const { djangoAxiosInst } = createAxiosInstances();
      const userToken = localStorage.getItem("userToken")
      try {
        const res = await djangoAxiosInst.get('user_analysis/list-own-request', {
          params: {
            userToken: userToken
          }
        });
        this.requests = res.data;
        return res.data;
      } catch (error) {
        console.error('listOwnUserAnalysisRequestToDjango() 중 에러 발생');
        throw error;
      }
    },

    async readUserAnalysisRequestToDjango(requestId: number): Promise<void> {
      const { djangoAxiosInst } = createAxiosInstances();
      try {
        const res = await djangoAxiosInst.get(`user_analysis/read-request/${requestId}`);
        this.selectedRequestDetails = res.data;
      } catch (error) {
        console.error('readUserAnalysisRequestToDjango() 중 에러 발생');
        throw error;
      }
    },

    async sendUserAnalysisRequestToFastapiByDjango(request_id: number): Promise<any> {
      const { djangoAxiosInst } = createAxiosInstances();
      const userToken = localStorage.getItem("userToken") || localStorage.getItem("guestToken")

      const payload = {
        command: 7,
        request_id: request_id,
        userToken: userToken
      }
      try {
        const res = await djangoAxiosInst.post('ai_request/send', payload)
        return res.data;
      } catch (error) {
        console.error('sendUserAnalysisRequestToFastapiByDjango() 중 에러 발생');
        throw error;
      }
    },

    async getUserAnalysisResultFromFastAPI(): Promise<any> {
      const { fastapiAxiosInst } = createAxiosInstances()
      try {
          const maxAttempts = 50
          const delay = 8000

          for (let attempt = 0; attempt < maxAttempts; attempt++) {
              const response = await fastapiAxiosInst.post('/growth-strategy')

              if (response.data !== "아직 데이터를 처리 중이거나 요청한 데이터가 없습니다") {
                  return response.data
              }

              await new Promise(resolve => setTimeout(resolve, delay))
          }

          throw new Error('결과를 가져오는 데 실패했습니다.')
      } catch (error) {
          throw error
      }
    },

    async getLatestCustomStrategyFromDjango(): Promise<any> {
      const { djangoAxiosInst } = createAxiosInstances();
      const userToken = localStorage.getItem("userToken") || localStorage.getItem("guestToken")

      const payload = {
        userToken: userToken
      }
      try {
        const res = await djangoAxiosInst.post('custom_strategy_history/read-latest', payload)
        return res.data;
      } catch (error) {
        console.error('getCustomStrategyFromDjango() 중 에러 발생');
        throw error;
      }
    },

    async getCustomStrategyFromDjango(request_id: number): Promise<any> {
      const { djangoAxiosInst } = createAxiosInstances();

      try {
        const res = await djangoAxiosInst.post(`custom_strategy_history/read/${request_id}`)
        return res.data;
      } catch (error) {
        console.error('getCustomStrategyFromDjango() 중 에러 발생', error);
        throw error;
      }
    },

    setSurveyDataAndRequest(surveyData: UserAnalysisSurveyData, requestId: number) {
      this.currentSurveyData = surveyData
      this.currentRequestId = requestId
    },

    clearSurveyData() {
      this.currentSurveyData = null
      this.currentRequestId = null
    }
  }
})