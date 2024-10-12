import { MutationTree } from "vuex";
import { UserAnalysisInputState, UserAnalysisSurvey, Question, Selection } from "./states";
import { REQUEST_USER_ANALYSIS_INPUT_TO_FASTAPI, REQUEST_LIST_QUESTION_TO_DJANGO } from "./mutation-types";

export interface UserAnalysisInputMutations extends MutationTree<UserAnalysisInputState> {
    [REQUEST_USER_ANALYSIS_INPUT_TO_FASTAPI](state: UserAnalysisInputState, settingValue: string): void
    [REQUEST_LIST_QUESTION_TO_DJANGO](state: UserAnalysisInputState, receivedData: UserAnalysisSurvey): void
}

const mutations: MutationTree<UserAnalysisInputState> = {
    [REQUEST_USER_ANALYSIS_INPUT_TO_FASTAPI](state: UserAnalysisInputState, settingValue: string): void {
        state.userAnalysisInput = settingValue
    },
    [REQUEST_LIST_QUESTION_TO_DJANGO](state: UserAnalysisInputState, receivedData: UserAnalysisSurvey): void {
        state.userAnalysisSurvey = receivedData
        state.questions = receivedData.questions; // 질문 목록 저장
    },
}

export default mutations as UserAnalysisInputMutations