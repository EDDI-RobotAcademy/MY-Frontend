export interface SurveyState {
    surveys: Survey[];
    survey: Survey | null;
}

export interface Survey {
    id: number;
    title: string;
    description: string;
    questions: Question[]; // 질문 배열
}

export interface Question {
    id: number;
    text: string;
    type: number;
    selections?: Selection[]; // 선택지를 가질 수 있는 질문
}

export interface Selection {
    id: number;
    text: string;
}

const state: SurveyState = {
    surveys: [],
    survey: null,
};

export default state;
