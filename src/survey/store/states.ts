export interface SurveyState {
    surveys: Survey[];
    survey: Survey | null;
    selections: Selection[]; // 선택지 배열
    questions: Question[]; // 질문 배열
    answers: Answer[];
}

export interface Survey {
    id: number;
    title: string;
    description: string;
    questions: Question[]; // 질문 배열
}

export interface Question {
    id: number;
    question_text: string;
    survey_type: number; // 질문 유형
    answer?: string | null; // 사용자 입력 답변
    answered?: boolean; // 질문이 답변되었는지
    selections?: Selection[]; // 선택지가 있을 경우
}

export interface Selection {
    id: number;
    question_id: number;
    custom_text: string;
    value: string | boolean | number; // 선택지 값 추가
}

export interface SurveyAnswer {
    question_id: number;
    answer_data: string | number | boolean;
}

export interface Answer {
    id: number;
    survey_title: string;
    profile_nickname: string;
    question_text: string;
    survey_custom_selection_text: string;
    answer_text: string;
    boolean_selection: string;
    five_score_selection: number;
    response_order: number;
    created_at: string
}

const state: SurveyState = {
    surveys: [],
    survey: null,
    selections: [],
    questions: [],
    answers: []
};

export default state;


