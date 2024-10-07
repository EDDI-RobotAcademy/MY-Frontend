import { ActionContext } from "vuex"
import { SurveyState } from "./states"
import axios, { AxiosResponse } from "axios"
import axiosInst from "@/utility/axiosInstance"

export type SurveyActions = {
    requestCreateSurveyToDjango(context: ActionContext<SurveyState, any>, 
        payload: {title: string, description: string}): Promise<AxiosResponse>
}

const actions: SurveyActions = {
    async requestCreateSurveyToDjango(context: ActionContext<SurveyState, any>, 
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
        }
    }

export default actions;
