import { ActionContext } from "vuex"
import { AxiosResponse } from "axios"
import axiosInst from "@/utility/axiosInstance"
import { SurveyInputState } from "./states"

export type SurveyInputActions = {
    sendSurveyToFastAPI(
        context: ActionContext<SurveyInputState, any>,
        payload: { data: any }): Promise<any>
    }

const actions: SurveyInputActions = {
    async sendSurveyToFastAPI(
        context: ActionContext<SurveyInputState, any>,
        payload: { data: any }): Promise<any> {
        try {
            console.log('sendSurveyToFastAPI()')
            const { data } = payload

            const response = await axiosInst.fastapiAxiosInst.post(
                '/request-analysis', { "data": data })
            return response.data
        } catch (error) {
            // Axios time out 나는 이슈 발생 (2500ms) 수정하기
            console.log('sendSurveyToFastAPI() 중 문제 발생:', error)
            throw error
        }
    },
}

export default actions