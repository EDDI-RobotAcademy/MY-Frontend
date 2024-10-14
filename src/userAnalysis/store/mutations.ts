import { MutationTree } from "vuex";
import { UserAnalysisInputState, UserAnalysisSurvey, Question, Selection, Answer } from "./states";
import { 
    REQUEST_USER_ANALYSIS_INPUT_TO_FASTAPI, 
    REQUEST_LIST_QUESTION_TO_DJANGO, 
    REQUEST_LIST_SELECTION_TO_DJANGO,
    REQUEST_LIST_USER_ANALYSIS_ANSWER_TO_DJANGO 
} from "./mutation-types";

export interface UserAnalysisInputMutations extends MutationTree<UserAnalysisInputState> {
    [REQUEST_USER_ANALYSIS_INPUT_TO_FASTAPI](state: UserAnalysisInputState, settingValue: string): void
    [REQUEST_LIST_QUESTION_TO_DJANGO](state: UserAnalysisInputState, receivedData: UserAnalysisSurvey): void
    [REQUEST_LIST_SELECTION_TO_DJANGO](state: UserAnalysisInputState, selections: Selection[]): void 
    [REQUEST_LIST_USER_ANALYSIS_ANSWER_TO_DJANGO](state: UserAnalysisInputState, answers: Answer[]): void
}

const mutations: MutationTree<UserAnalysisInputState> = {
    [REQUEST_USER_ANALYSIS_INPUT_TO_FASTAPI](state: UserAnalysisInputState, settingValue: string): void {
        state.userAnalysisInput = settingValue
    },
    [REQUEST_LIST_QUESTION_TO_DJANGO](state: UserAnalysisInputState, receivedData: UserAnalysisSurvey): void {
        state.userAnalysisSurvey = receivedData
        state.questions = receivedData.questions; // 질문 목록 저장
    },
    [REQUEST_LIST_SELECTION_TO_DJANGO](state: UserAnalysisInputState, selections: Selection[]): void {
        state.selections = selections; // 선택지 저장
    },
    [REQUEST_LIST_USER_ANALYSIS_ANSWER_TO_DJANGO](state: UserAnalysisInputState, answers: Answer[]): void {
        console.log('Mutations에서 받은 답변: ', answers)
        state.answers = answers;
    }
}

export default mutations as UserAnalysisInputMutations