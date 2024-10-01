import actions, { SurveyInputActions } from "./actions"
import mutations, { SurveyInputMutations } from "./mutations"
import state, { SurveyInputState } from "./states"


export interface SurveyInputModule {
    namespaced: true,
    state: SurveyInputState,
    actions: SurveyInputActions,
    mutations: SurveyInputMutations,
}

const surveyInputModule: SurveyInputModule = {
    namespaced: true,
    state,
    actions,
    mutations
}

export default surveyInputModule