export interface UserAnalysisInputState {
    userAnalysisInput: string
    userAnalysisSurveys: UserAnalysisSurvey[];
    userAnalysisSurvey: UserAnalysisSurvey | null;
    selections: Selection[]; // 선택지 배열
    questions: Question[]; // 질문 배열
}

export interface UserAnalysisSurvey {
    id: number;
    title: string;
    description: string;
    questions: Question[]; // 질문 배열
}

export interface Question {
    id: number;
    question_text: string;
    user_analysis_type: number; // 질문 유형
    answer?: string | null; // 사용자 입력 답변
    answered?: boolean; // 질문이 답변되었는지
    selections?: Selection[]; // 선택지가 있을 경우
}


const state: UserAnalysisInputState = {
    userAnalysisInput: "",
    userAnalysisSurveys: [],
    userAnalysisSurvey: null,
    questions: [],
    selections: [],
}

export default state