import { ActionContext } from "vuex";
import { AxiosResponse } from "axios";
import axiosInst from "@/utility/axiosInstance";
import { SurveyInputState } from "./states";

export type SurveyInputActions = {
    sendSurveyToFastAPI(
        context: ActionContext<SurveyInputState, any>,
        payload: {
            age_group: string,
            gender: string,
            mbti: string,
            topic: string,
            platform: string,
            target_audience: string,
            content_style: string,
            post_frequency: string
        }): Promise<any>
}

const actions: SurveyInputActions = {
    async sendSurveyToFastAPI(
        context: ActionContext<SurveyInputState, any>,
        payload: {
            age_group: string,
            gender: string,
            mbti: string,
            topic: string,
            platform: string,
            target_audience: string,
            content_style: string,
            post_frequency: string
        }): Promise<any> {
        try {
            console.log('sendSurveyToFastAPI()');
            
            // Payload 구조에 맞게 데이터를 준비
            const response = await axiosInst.fastapiAxiosInst.post(
                '/growth-strategy', {
                    age_group: payload.age_group,
                    gender: payload.gender,
                    mbti: payload.mbti,
                    topic: payload.topic,
                    platform: payload.platform,
                    target_audience: payload.target_audience,
                    content_style: payload.content_style,
                    post_frequency: payload.post_frequency
                }
            );
            
            return response.data;
        } catch (error) {
            console.log('sendSurveyToFastAPI() 중 문제 발생:', error);
            throw error;
        }
    },
}

export default actions;
