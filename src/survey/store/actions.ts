import { ActionContext } from "vuex"
import { SurveyState } from "./states"
import axios, { AxiosResponse } from "axios"
import axiosInst from "@/utility/axiosInstance"

export type SurveyActions = {
    requestCreateSurveyToDjango(context: ActionContext<SurveyState, any>, 
        payload: {title: string, description: string}): Promise<AxiosResponse>,
    requestCreateSurveyQuestionToDjango(
        context: ActionContext<SurveyState, any>, 
        payload: { survey: number, question: string, survey_type: number }
    ): Promise<AxiosResponse>,

}

const actions: SurveyActions = {
    async requestCreateSurveyToDjango(context: ActionContext<any, any>, 
        payload: {
            title: string, 
            description: string
        }): Promise<AxiosResponse> {
            const { title, description } = payload
            try {
                const res: AxiosResponse = await axiosInst.djangoAxiosInst.post('/survey/create', payload)
                return res.data
            } catch (error) {
                console.log('requestCreateToDjango() 중 에러 발생')
                throw error
            } 
        },
    async requestCreateSurveyQuestionToDjango(context: ActionContext<any, any>, 
        payload: {
            survey: number, 
            question: string, 
            survey_type: number 
    }): Promise<AxiosResponse> {
        const { survey, question, survey_type } = payload
        try {
            const res: AxiosResponse = await axiosInst.djangoAxiosInst.post('survey/create-question', {
                survey,
                question,
                survey_type
            })
            console.log(res.data)
            return res.data
        } catch (error) {
            console.log('requestCreateSurveyQuestionToDjango() 중 에러 발생')
            throw error
        }
    },
}

export default actions;
