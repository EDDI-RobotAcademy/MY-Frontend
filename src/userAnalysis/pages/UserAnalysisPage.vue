<template>
  <div class="main-container">
    <div class="content-overlay">
      <div class="survey-icon">
        <v-img alt="Survey Icon"></v-img>
      </div>
      <div class="overlay-text">
        <h1>COOING은 인플루언서가 되고 싶은 당신을 위해<br>가장 비슷한 롤 모델을 찾고, 성장 방향을 알려주는 서비스에요.</h1>
        <h3>당신이 어떤 성향인지 알고싶어요. 다음 질문들에 답변해주세요!</h3>
      </div>
      <div class="survey-container" v-if="questions.length > 0">
        <h2>{{ questions[currentQuestionIndex].question_text }}</h2>
        <!-- 선택형 질문 -->
        <div v-if="questions[currentQuestionIndex].user_analysis_type === '4'" class="options">
          <label v-for="(option, optionIndex) in currentQuestionOptions" :key="optionIndex"
            class="option-label">
            <input type="radio" :name="'question-' + currentQuestionIndex" :value="option.custom_text"
              v-model="questions[currentQuestionIndex].answer" @change="answerQuestion(currentQuestionIndex)">
            <span class="radio-button"></span>
            <span class="option-text">{{ option.custom_text }}</span>
          </label>
        </div>
        <!-- 텍스트 입력 질문 -->
        <div v-else-if="questions[currentQuestionIndex].user_analysis_type === '1'" class="text-input">
          <input @keyup.enter="nextQuestionIfNotEmpty" type="text" v-model="questions[currentQuestionIndex].answer"
            placeholder="답변을 입력해주세요." @input="answerQuestion(currentQuestionIndex)">
          <p v-if="mbtiError" class="error-message">{{ mbtiError }}</p>
        </div>
        <div class="button-container">
          <button @click="prevQuestion" class="prev-button" :disabled="currentQuestionIndex === 0">←  이전</button>
          <button @click="nextQuestion" class="next-button" :disabled="!canProceed">
            {{ isLastQuestion ? '제출' : '다음  →' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'AnalysisTestPage',
  data() {
    return {
      currentQuestionIndex: 0,
      userAnalysisInputId: '1', // 실제 설문 ID
      questions: [],
      selections: [],
      mbtiError: ''
    };
  },
  computed: {
    ...mapState('userAnalysisInputModule', ['questions', 'selections']),
    isLastQuestion() {
      return this.currentQuestionIndex === this.questions.length - 1;
    },
    isFirstQuestion() {
      return this.currentQuestionIndex === 0;
    },
    canProceed() {
      const currentQuestion = this.questions[this.currentQuestionIndex];
      if (currentQuestion.user_analysis_type === 1) {
        return currentQuestion.answer && currentQuestion.answer.trim() !== '';
      }
      return currentQuestion.answer !== null;
    },
    currentQuestionOptions() {
      const currentQuestion = this.questions[this.currentQuestionIndex];
      if (!currentQuestion) return []; // 현재 질문이 없을 경우 빈 배열 반환
      console.log(`현재 질문 ID: ${currentQuestion.id}`);
      const options = this.selections[currentQuestion.id] || [];
      console.log(`질문 ID ${currentQuestion.id}의 선택지:`, options);
      return options;
    },
  },
  methods: {
    ...mapActions('userAnalysisInputModule', ['requestListQuestionToDjango', 'requestListSelectionToDjango', 'requestSubmitAnswerToDjango']),
    async loadSurvey() {
      try {
        const questions = await this.requestListQuestionToDjango(this.userAnalysisInputId);
        this.questions = questions
        console.log('성향조사 질문 목록: ', this.questions);

        for (const question of this.questions) {
          console.log(`질문 ID: ${question.id}, user_analysis_type: ${question.user_analysis_type}`);
          const options = await this.requestListSelectionToDjango(question.id)
          this.selections[question.id] = options
          console.log(`질문 ID ${question.id}에 대한 선택지 요청 완료`)
        }

        this.$nextTick(() => {
          const flattenedSelections = Object.values(this.selections)
            .filter(selection => selection !== null && typeof selection === 'object') // null 및 비객체 필터링
            .flat(); // 리스트를 하나로 합침
          console.log('업데이트된 선택지:', JSON.stringify(flattenedSelections));
        });

      } catch (error) {
        console.error('성향조사 로딩 중 오류 발생:', error);
      }
    },
    getQuestionType(user_analysis_type) {
      switch (user_analysis_type) {
        case 1: return 'text';
        case 2: case 3: case 4: return 'radio';
        default: return 'text';
      }
    },
    getOptionText(option) {
      return option.custom_text; // 선택지 텍스트 가져오기
    },
    handleError(event) {
      console.error('Video playback error:', event);
    },
    nextQuestion() {
      if (this.currentQuestionIndex === 2 && this.mbtiError) {
        return; // MBTI 오류가 있으면 다음 질문으로 넘어가지 않음
      }
      if (!this.isLastQuestion) {
        this.currentQuestionIndex++;
      } else {
        this.submitSurvey();
      }
    },
    prevQuestion() {
      if (!this.isFirstQuestion) {
        this.currentQuestionIndex--;
        // 이전 질문의 답변 상태 확인
        this.checkAnswerStatus(this.currentQuestionIndex);
      }
    },
    answerQuestion(index) {
      const question = this.questions[index];
      if (question.user_analysis_type === '1') {
        question.answer = question.answer || ''
        question.answered = question.answer.trim() !== '';
        if (index === 2) {
          this.validateMBTI(question.answer);
        }
      } else {
        question.answered = question.answer !== null;
      }
      this.$forceUpdate();
    },
    validateMBTI(mbti) {
      const mbtiRegex = /^[EI][NS][FT][JP]$/;
      if (mbtiRegex.test(mbti.toUpperCase())) {
        this.mbtiError = '';
        this.questions[2].answered = true;
      } else {
        this.mbtiError = 'MBTI 형식이 올바르지 않습니다.';
        this.questions[2].answered = false;
      }
    },
    nextQuestionIfNotEmpty() {
      if (this.canProceed) {
        this.nextQuestion();
      }
    },
    checkAnswerStatus(index) {
      const question = this.questions[index];
      if (question.user_analysis_type === '1') {
        question.answered = question.answer.trim() !== '';
        if (index === 2) { // MBTI 질문
          this.validateMBTI(question.answer);
        }
      } else {
        question.answered = question.answer !== null;
      }
      this.$forceUpdate();
    },
    async submitSurvey() {
        const UserAnalysisInputAnswers = this.questions.map(question => ({
          question_id: question.id,
          answer_data: question.answer || '' // 답변이 없을 경우 빈 문자열로 설정
        }))
        console.log("Survey submitted:", JSON.stringify(this.questions));


        const accountId = null

        try {
            const response = await this.requestSubmitAnswerToDjango({ user_analysis_answer: UserAnalysisInputAnswers, account_id: accountId })
            console.log('설문이 제출되었습니다:', response)
            
            // FastAPI로 추가 요청 보내기
            const surveyData = {
              gender: this.questions[0].answer,
              age_group: this.questions[1].answer,
              mbti: this.questions[2].answer,
              topic: this.questions[3].answer,
              strength: this.questions[4].answer,
              reveal: this.questions[5].answer,
              platform: this.questions[6].answer,
              interested_influencer: this.questions[7].answer,
            };

            // UserAnalysisResultPage로 라우터 푸시
            this.$router.push({ path: '/user-analysis/result', state: { surveyData } });
        } catch (error) {
          console.error('설문 제출 중 오류 발생: ', error)
        }
      },
   },
  created() {
    this.loadSurvey();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');

* {
  font-family: 'Noto Sans KR', sans-serif;
}

.main-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display:flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  background-image: url("@/assets/images/fixed/chatbot/background_gradient.png");
  background-size: cover;
  background-blend-mode: darken;
}

.survey-icon {
  background-image: url("@/assets/images/fixed/survey/icon_survey.png");
  filter: brightness(0) saturate(100%) invert(56%) sepia(75%) saturate(1605%) hue-rotate(346deg) brightness(100%) contrast(104%);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  height: 120px;
  width: 120px;
  margin: auto;
}

.content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.6);
}

.survey-container {
  padding: 20px;
  border-radius: 10px;
  margin: 10px 0;
  max-width: 800px;
  width: 100%;
}

.overlay-text {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin: 10px 0;
  max-width: 800px;
  width: 100%;
}

.overlay-text h1 {
  font-size: 1.8rem;
  color: #000;
  margin-bottom: 20px;
  text-align: center;
}

.overlay-text h3 {
  font-size: 1.2rem;
  color: #000;
  margin-bottom: 20px;
  text-align: center;
}

.survey-container {
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, .5);
  justify-content: center;
  align-items: center;
}

.survey-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
}

.survey-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.survey-container h2 {
  font-size: 1.4rem;
  color: #000;
  margin-bottom: 20px;
}

.options {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.option-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.option-text {
  font-size: 1.3rem;
  color: #000;
  text-align: center;
}

input[type="radio"] {
  display: none;
}

.radio-button {
  width: 20px;
  height: 20px;
  border: 2px solid #000;
  border-radius: 50%;
  margin-right: 10px;
  position: relative;
  display: inline-block;
  vertical-align: middle;
}

input[type="radio"]:checked+.radio-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background-color: #ff9033;
  border-radius: 50%;
}

.text-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.text-input input {
  width: 70%;
  padding: 10px;
  border: 1px solid #000;
  border-radius: 5px;
  font-size: 16px;
  margin-bottom: 12px;
  text-align: center;
}

.button-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

button {
  margin: 0 20px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

button:disabled {
  background-color: #cecece;
  cursor: not-allowed;
  color: white;
}

button.next-button:not(:disabled) {
  background-color: #ff9033;
  color: white;
}

button.prev-button:not(:disabled) {
  background-color: rgb(69, 69, 69);
  color: white;
}

/* 호버 효과 */
button:not(:disabled):hover {
  opacity: 0.8;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 5px;
  min-height: 1.2em; /* 에러 메시지 영역의 최소 높이 설정 */
}

.text-input {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
</style>