import { MutationTree } from "vuex";
import { SurveyInputState } from "./states";
import { REQUEST_SURVEY_INPUT_TO_FASTAPI } from "./mutation-types";

export interface SurveyInputMutations extends MutationTree<SurveyInputState> {
    [REQUEST_SURVEY_INPUT_TO_FASTAPI](state: SurveyInputState, settingValue: string): void
}

const mutations: MutationTree<SurveyInputState> = {
    [REQUEST_SURVEY_INPUT_TO_FASTAPI](state: SurveyInputState, settingValue: string): void {
        state.surveyInput = settingValue
    }
}

export default mutations as SurveyInputMutations