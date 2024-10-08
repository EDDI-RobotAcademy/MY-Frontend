import { MutationTree } from "vuex";
import { SurveyState, Survey } from "./states";
import { REQUEST_SURVEY_TO_DJANGO } from "./mutation-types";

export interface SurveyMutations extends MutationTree<SurveyState> {
    [REQUEST_SURVEY_TO_DJANGO](state: SurveyState, receivedData: Survey): void
}

const mutations: MutationTree<SurveyState> = {
    [REQUEST_SURVEY_TO_DJANGO](state: SurveyState, receivedData: Survey): void {
        state.survey = receivedData;
    }
}

export default mutations as SurveyMutations;