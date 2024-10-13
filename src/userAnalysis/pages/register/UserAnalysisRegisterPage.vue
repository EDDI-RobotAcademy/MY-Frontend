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
          <textarea id="userAnalysisDescription" v-model="UserAnalysisSurvey.description"></textarea>
        </div>
        <v-btn type="submit">사용자 성향분석 생성</v-btn>
      </form>
    </div>
    
    <div v-if="userAnalysisId" class="user-analysis-question-form">
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
        <!-- 선택지 입력 부분 -->
        <div v-if="questionId && question.userAnalysisType === 4">
          <h3>선택지 추가</h3>
          <div v-for="(custom, index) in customSelections" :key="index">
            <input v-model="customSelections[index]" type="text" placeholder="선택지 입력" />
            <v-btn @click="removeSelection(index)">삭제</v-btn>
          </div>
          <v-btn @click="addSelection">선택지 추가</v-btn>
          <v-btn @click="submitSelections">선택지 등록</v-btn>
        </div> 
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
        questionId: null,
        customSelections: ['']
    }},
    methods: {
      ...mapActions(userAnalysisInputModule, ['requestCreateUserAnalysisToDjango', 'requestCreateUserAnalysisQuestionToDjango', 'requestCreateUserAnalysisSelectionToDjango']),
      
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

          // 질문 목록에 추가
          this.questions.push({
            question: this.question.questionText,
            userAnalysisType: this.question.userAnalysisType
          });
  
          // 사용자 지정 유형이 아닐 경우 폼 초기화
          if (this.question.userAnalysisType !== 4) {
            this.resetQuestionForm();
          }
        } catch (error) {
          console.error('성향조사 질문 등록 중 에러 발생: ', error);
        }
      },
      async addSelection() {
            this.customSelections.push(''); // 선택 항목 추가
        },
  
      removeSelection(index) {
        this.customSelections.splice(index, 1); // 선택 항목 삭제
      },
  
      handleuserAnalysisTypeChange() {
        if (this.question.userAnalysisType !== 4) {
          this.customSelections = ['']; // 질문 유형이 일반일 경우 선택 항목 초기화
        }
      },
      resetQuestionForm() {
        this.question.questionText = ''; // 질문 텍스트 초기화
        this.question.userAnalysisType = 1; // 질문 유형 초기화
        this.customSelections = ['']; // 선택 항목 초기화
        this.questionId = null;
      },
  
      async submitSelections() {
        if (this.customSelections.length > 0) {
          for (const selectionText of this.customSelections) {
            if (selectionText.trim() !== '') {
              const payload = {
                question_id: this.questionId,
                custom_text: selectionText
              };
              try {
                await this.requestCreateUserAnalysisSelectionToDjango(payload);
                console.log('성향조사 선택지 등록 성공:', selectionText);
              } catch (error) {
                console.error('성향조사 선택지 등록 중 에러 발생: ', error);
              }
            }
          }
          // 선택지 등록 후 현재 질문의 options 업데이트
          const currentQuestion = this.questions.find(q => q.id === this.questionId);
          if (currentQuestion) {
            currentQuestion.options = [...this.customSelections];
          }
          this.resetQuestionForm();
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

  .user-analysis-question-form {
    max-width: 600px;
    margin: 100px 200px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>