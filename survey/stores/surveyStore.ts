import { defineStore } from 'pinia'
import { createAxiosInstances } from '../../utility/axiosInstance'


interface SurveyAnswer {
    question_id: number;
    answer_data: string | number | boolean;
}

export const useSurveyStore = defineStore('surveyStore', {
  state: () => ({}),

  actions: {
    async requestCreateSurveyToDjango(payload: { title: string, description: string }) {
      const { djangoAxiosInst } = createAxiosInstances()
      try {
        const res = await djangoAxiosInst.post('/survey/create', payload)
        return res.data
      } catch (error) {
        console.log('requestCreateToDjango() 중 에러 발생')
        throw error
      }
    },

    async requestCreateSurveyQuestionToDjango(payload: {
      survey: number,
      question: string,
      survey_type: number,
      is_essential: boolean
    }) {
      const { djangoAxiosInst } = createAxiosInstances()
      try {
        const res = await djangoAxiosInst.post('survey/create-question', payload)
        console.log(res.data)
        return res.data
      } catch (error) {
        console.log('requestCreateSurveyQuestionToDjango() 중 에러 발생')
        throw error
      }
    },

    async requestCreateSurveySelectionToDjango(payload: { question_id: number, custom_text: string }) {
      const { djangoAxiosInst } = createAxiosInstances()
      try {
        const res = await djangoAxiosInst.post('survey/create-survey-selection', payload)
        console.log(res.data)
        return res.data
      } catch (error) {
        console.log('requestCreateSurveySelectionToDjango() 중 에러 발생')
        throw error
      }
    },

    async requestListSurveyQuestionToDjango(surveyId: string) {
      const { djangoAxiosInst } = createAxiosInstances()
      try {
        const res = await djangoAxiosInst.post('survey/list-question', { survey_Id: surveyId })
        const data = res.data
        console.log('질문 리스트: ', data)
        return data
      } catch (error) {
        console.error('requestListSurveyQuestionToDjango() 중 에러 발생')
        throw error
      }
    },

    async requestListSurveySelectionToDjango(questionId: string) {
      const { djangoAxiosInst } = createAxiosInstances()
      try {
        const res = await djangoAxiosInst.post('survey/list-selection', { question_Id: questionId })
        return res.data
      } catch (error) {
        console.error('requestListSurveySelectionToDjango() 중 에러 발생')
        throw error
      }
    },

    async requestListSurveyAnswerToDjango(payload: {
      filter: string,
      survey_Id: number | null,
      question_Id: number | null,
      account_Id: number | null
    }) {
      const { djangoAxiosInst } = createAxiosInstances()
      try {
        const res = await djangoAxiosInst.post('survey/list-answer', payload)
        return res.data
      } catch (error) {
        console.error('requestListSurveySelectionToDjango() 중 에러 발생')
        throw error
      }
    },

    async requestSubmitSurveyAnswerToDjango(payload: { survey_answer: SurveyAnswer[], userToken: string | null }) {
      const { djangoAxiosInst } = createAxiosInstances()
      try {
        const userToken = localStorage.getItem('userToken')
        console.log("userToken : ", userToken)
        const res = await djangoAxiosInst.post('survey/submit-answer', {
          survey_answer: payload.survey_answer,
          userToken: userToken
        })
        return res.data
      } catch (error) {
        console.log('requestSubmitSurveyAnswerToDjango() 중 에러 발생')
        throw error
      }
    }
  }
})