import { MutationTree } from "vuex";
import { SurveyState, Survey, Question, Selection } from "./states";
import { REQUEST_LIST_SURVEY_QUESTION_TO_DJANGO } from "./mutation-types";


export interface SurveyMutations extends MutationTree<SurveyState> {
    [REQUEST_LIST_SURVEY_QUESTION_TO_DJANGO](state: SurveyState, receivedData: Survey): void;
}

const mutations: MutationTree<SurveyState> = {
    [REQUEST_LIST_SURVEY_QUESTION_TO_DJANGO](state: SurveyState, receivedData: Survey): void {
        state.survey = receivedData; // 설문 저장
        console.log('Mutations에서 받은 데이터: ', receivedData)
        state.questions = receivedData.questions; // 질문 목록 저장
    }
};

export default mutations as SurveyMutations;
