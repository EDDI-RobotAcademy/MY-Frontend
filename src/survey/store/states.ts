export interface SurveyState {
    surveys: Survey[]
    survey: Survey | null
    
}

export interface Survey {
    surveyId: number
    surveyTitle: string
    surveyDescription: string
}

const state: SurveyState = {
    surveys: [],
    survey: null,
}

export default state
