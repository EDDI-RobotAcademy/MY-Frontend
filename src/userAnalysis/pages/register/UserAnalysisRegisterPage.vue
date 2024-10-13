<template>
    <div class="user-analysis-form">
      <h2>사용자 분석 등록</h2>
      <form @submit.prevent="createUserAnalysis">
        <div>
          <label for="userAnalysisTitle">제목:</label>
          <input id="userAnalysisTitle" v-model="UserAnalysisSurvey.title" required />
        </div>
        <div>
          <label for="userAnalysisDescription">설명:</label>
          <textarea id="userAnalysisDescription" v-model="UserAnalysisSurvey.description" required></textarea>
        </div>
        <v-btn type="submit">사용자 성향분석 생성</v-btn>
      </form>
    </div>

    <div v-if="userAnalysisId" class="user-anlysis-question-form">
      <form @submit.prevent="addQuestion">
        <div>
          <label for="question">질문:</label>
          <input id="question" v-model="question.questionText" type="text" required />
        </div>
        <div>
          <label for="userAnalysisType">질문 타입:</label>
          <select v-model="question.userAnalysisType" id="userAnalysisType" @change="handleUserAnalysisTypeChange">
            <option :value="1">서술형</option>
            <option :value="2">5점(Five-score)</option>
            <option :value="3">Boolean</option>
            <option :value="4">선택형(Custom)</option>
          </select>
        </div>
        <v-btn type="submit">질문 추가</v-btn>
        </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
  
const userAnalysisInputModule = 'userAnalysisInputModule';
  
export default {
    data() {
      return {
        UserAnalysisSurvey: {
          title: '',
          description: ''
        },
        userAnalysisId: null,
        question: {
          questionText: '',
          userAnalysisType: 1 // 기본값을 서술형으로 설정
        },
        questions: [],
        questionId: null
    }},
    methods: {
      ...mapActions(userAnalysisInputModule, ['requestCreateUserAnalysisToDjango', 'requestCreateUserAnalysisQuestionToDjango']),
      
      async createUserAnalysis() {
        try {
          const response = await this.requestCreateUserAnalysisToDjango(this.UserAnalysisSurvey);
          this.userAnalysisId = response.title;
          console.log('사용자 성향조사 생성 성공!', this.userAnalysisId);
        } catch (error) {
          console.error('사용자 성향조사 생성 중 에러 발생: ', error);
        }
      },
      async addQuestion() {
        if (!this.userAnalysisId) {
          console.error('설문조사가 먼저 생성되어야 합니다.');
          return;
        }
        try {
          const payload = {
            user_analysis: this.userAnalysisId,
            question: this.question.questionText,
            user_analysis_type: this.question.userAnalysisType 
          };
          const response = await this.requestCreateUserAnalysisQuestionToDjango(payload);
          this.questionId = response.questionId; // 질문 ID 저장
        } catch (error) {
          console.error('성향조사 질문 등록 중 에러 발생: ', error);
        }
      },
    }
}
</script>

<style>
  .user-analysis-form {
    max-width: 600px;
    margin: 100px 200px;
  }
</style>