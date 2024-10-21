import { ActionContext } from "vuex";
import { AxiosResponse } from "axios";
import axiosInst from "@/utility/axiosInstance";
import { UserAnalysisInputState, UserAnalysisInputAnswer } from "./states";
import { 
    REQUEST_USER_ANALYSIS_INPUT_TO_FASTAPI, REQUEST_LIST_QUESTION_TO_DJANGO, REQUEST_LIST_SELECTION_TO_DJANGO 
} from "./mutation-types";


export type UserAnalysisInputActions = {
    sendUserAnalysisToFastAPI(
        context: ActionContext<UserAnalysisInputState, any>,
        payload: {
            gender: string,
            age_group: string,
            mbti: string,
            topic: string,
            strength: string,
            reveal: string,
            platform: string,
            interested_influencer: string
        }): Promise<any>,
    requestListQuestionToDjango(context: ActionContext<UserAnalysisInputState,any>,
        userAnalysisId: string
    ): Promise<void>,
    requestListSelectionToDjango(context: ActionContext<UserAnalysisInputState, any>,
        questionId: string
    ): Promise<void>,
    requestSubmitAnswerToDjango(context: ActionContext<UserAnalysisInputState, any>,
        payload: { user_analysis_answer: UserAnalysisInputAnswer[], userToken: string | null }
    ): Promise<AxiosResponse>,
    requestCreateUserAnalysisToDjango(context: ActionContext<UserAnalysisInputState, any>, 
        payload: {title: string, description: string}): Promise<AxiosResponse>,
    requestCreateUserAnalysisQuestionToDjango(
        context: ActionContext<UserAnalysisInputState, any>, 
        payload: { user_analysis: number, question: string, user_analysis_type: number }
    ): Promise<AxiosResponse>,
    requestListUserAnalysisAnswerToDjango(context: ActionContext<UserAnalysisInputState, any>,
        payload: {
            filter: string,
            user_analysis_Id: number | null,
            question_Id: number | null,
            account_Id: number | null
        }
    ): Promise<void>,
    requestCreateUserAnalysisSelectionToDjango(
        constext: ActionContext<UserAnalysisInputState, any>,
        payload: { question_id: number, custom_text: string }
    ): Promise<AxiosResponse>,

}

const actions: UserAnalysisInputActions = {
    async sendUserAnalysisToFastAPI(
        context: ActionContext<UserAnalysisInputState, any>,
        payload: {
            gender: string,
            age_group: string,
            mbti: string,
            topic: string,
            strength: string,
            reveal: string,
            platform: string,
            interested_influencer: string
        }): Promise<any> {
        try {
            console.log('sendUserAnalysisToFastAPI()');
            const command = 7
            // Payload 구조에 맞게 데이터를 준비
            const response = await axiosInst.fastapiAxiosInst.post(
                '/request-ai-command', { "command" : command,
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
            );
            
            return response.data;
        } catch (error) {
            console.log('sendUserAnalysisToFastAPI() 중 문제 발생:', error);
            throw error;
        }
    },
    async requestListQuestionToDjango(context: ActionContext<UserAnalysisInputState,any>,
        userAnalysisId: string
    ): Promise<void> {
        try {
            const res: AxiosResponse<any, any> = await axiosInst.djangoAxiosInst.post('user_analysis/list-question',
                { user_analysis_Id: userAnalysisId }
            )
            const data = res.data
            console.log('질문 리스트: ', data)
            return data
        } catch (error) {
            console.error('requestListQuestionToDjango() 중 에러 발생')
            throw error
        }
    },
    async requestListSelectionToDjango(
        context: ActionContext<UserAnalysisInputState, any>,
        questionId: string
    ): Promise<void> {
        try {
          const res: AxiosResponse<any, any> = await axiosInst.djangoAxiosInst.post('user_analysis/list-selection', {
            question_Id: questionId 
          });
          
          const data = res.data;
        //   context.commit(REQUEST_LIST_SURVEY_SELECTION_TO_DJANGO, data);
          return data
        } catch (error) {
            console.error('requestListSelectionToDjango() 중 에러 발생')
            throw error
        }
    },
    async requestSubmitAnswerToDjango(context: ActionContext<UserAnalysisInputState, any>,
        payload: { user_analysis_answer: UserAnalysisInputAnswer[], userToken: string | null }
    ): Promise<AxiosResponse> {
        const { user_analysis_answer, userToken } = payload
        try {
            const userToken = localStorage.getItem('userToken')
            console.log("userToken: ", userToken)
            const res: AxiosResponse = await axiosInst.djangoAxiosInst.post('user_analysis/submit-answer', {
                user_analysis_answer, userToken
            })
            return res.data
        } catch (error) {
            console.log('requestSubmitAnswerToDjango() 중 에러 발생')
            throw error
        }
    },
    async requestCreateUserAnalysisToDjango(context: ActionContext<UserAnalysisInputState, any>, 
        payload: {
            title: string, 
            description: string
    }): Promise<AxiosResponse> {
        const { title, description } = payload
        try {
            const res: AxiosResponse = await axiosInst.djangoAxiosInst.post('/user_analysis/create', payload)
            return res.data
        } catch (error) {
            console.log('requestCreateUserAnalysisToDjango() 중 에러 발생')
            throw error
        } 
    },
    async requestCreateUserAnalysisQuestionToDjango(
        context: ActionContext<UserAnalysisInputState, any>, 
        payload: { user_analysis: number, question: string, user_analysis_type: number }
    ): Promise<AxiosResponse> {
        const { user_analysis, question, user_analysis_type } = payload
        try {
            const res: AxiosResponse = await axiosInst.djangoAxiosInst.post('user_analysis/create-question', {
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
    async requestListUserAnalysisAnswerToDjango(
        context: ActionContext<UserAnalysisInputState, any>,
        payload: {
            filter: string,
            user_analysis_Id: number | null,
            question_Id: number | null,
            account_Id: number | null
        }
    ): Promise<void> {
        const { filter, user_analysis_Id, question_Id, account_Id  } = payload
        try {
          const res: AxiosResponse<any, any> = await axiosInst.djangoAxiosInst.post('user_analysis/list-answer', {
            filter, user_analysis_Id, question_Id, account_Id
          });
          
          const data = res.data;
          return data
        } catch (error) {
            console.error('requestListUserAnalysisAnswerToDjango() 중 에러 발생')
            throw error
        }
    },
    async requestCreateUserAnalysisSelectionToDjango(
        constext: ActionContext<UserAnalysisInputState, any>,
        payload: { question_id: number, custom_text: string }
    ): Promise<AxiosResponse> {
        const { question_id, custom_text } = payload
        try {
            console.log(payload)
            const res: AxiosResponse = await axiosInst.djangoAxiosInst.post('user_analysis/create-user-analysis-selection', {
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

export default actions;
