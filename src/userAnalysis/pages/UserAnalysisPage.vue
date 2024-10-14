<template>
  <div class="main-container">
    <div class="content-overlay">
      <div v-if="!showSummary" class="overlay-text">
        <h1>COOING은 인플루언서가 되고 싶은 당신을 위해<br>가장 비슷한 롤 모델을 찾고, 성장 방향을 알려주는 서비스에요.</h1>
        <h3>당신이 어떤 성향인지 알고싶어요. 다음 질문들에 답변해주세요!</h3>
      </div>
      <div v-if="!showSummary && questions.length > 0" class="survey-container">
        <h2>{{ questions[currentQuestionIndex].question_text }}</h2>
        <div v-if="questions[currentQuestionIndex].user_analysis_type === '4'" class="options">
          <label v-for="(option, optionIndex) in currentQuestionOptions" :key="optionIndex" class="option-label">
            <input type="radio" :name="'question-' + currentQuestionIndex" :value="option.custom_text"
              v-model="questions[currentQuestionIndex].answer" @change="answerQuestion(currentQuestionIndex)">
            <span class="radio-button"></span>
            <span class="option-text">{{ option.custom_text }}</span>
          </label>
        </div>
        <div v-else-if="questions[currentQuestionIndex].user_analysis_type === '1'" class="text-input">
          <input @keyup.enter="nextQuestionIfNotEmpty" type="text" v-model="questions[currentQuestionIndex].answer"
            :placeholder="getPlaceholder(currentQuestionIndex)" @input="answerQuestion(currentQuestionIndex)">
          <p v-if="mbtiError" class="error-message">{{ mbtiError }}</p>
        </div>
        <div class="button-container">
          <button @click="prevQuestion" class="prev-button" :disabled="currentQuestionIndex === 0">← 이전</button>
          <button @click="nextQuestion" class="next-button" :disabled="!canProceed">
            다음 →
          </button>
        </div>
      </div>
      <div v-if="!showSummary && questions.length === 0" class="loading">
        질문을 불러오는 중입니다...
      </div>
      <SummaryComponent
        v-if="showSummary"
        :questions="questions"
        @back-to-questions="backToQuestions"
        @submit-survey="submitSurvey"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import SummaryComponent from '../ui/UserAnalysisPage/SummaryComponent.vue';

export default {
  name: 'AnalysisTestPage',
  components: {
    SummaryComponent
  },
  data() {
    return {
      currentQuestionIndex: 0,
      userAnalysisInputId: '1',
      questions: [],
      selections: [],
      mbtiError: '',
      showSummary: false,
      loading: true
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
      if (this.questions.length === 0) return false;
      const currentQuestion = this.questions[this.currentQuestionIndex];
      if (currentQuestion.user_analysis_type === 1) {
        return currentQuestion.answer && currentQuestion.answer.trim() !== '';
      }
      return currentQuestion.answer !== null;
    },
    currentQuestionOptions() {
      if (this.questions.length === 0) return [];
      const currentQuestion = this.questions[this.currentQuestionIndex];
      if (!currentQuestion) return [];
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
        this.loading = true;
        const questions = await this.requestListQuestionToDjango(this.userAnalysisInputId);
        this.questions = questions;
        console.log('성향조사 질문 목록: ', this.questions);

        for (const question of this.questions) {
          console.log(`질문 ID: ${question.id}, user_analysis_type: ${question.user_analysis_type}`);
          const options = await this.requestListSelectionToDjango(question.id)
          this.selections[question.id] = options
          console.log(`질문 ID ${question.id}에 대한 선택지 요청 완료`)
        }

        this.$nextTick(() => {
          const flattenedSelections = Object.values(this.selections)
            .filter(selection => selection !== null && typeof selection === 'object')
            .flat();
          console.log('업데이트된 선택지:', JSON.stringify(flattenedSelections));
        });
      } catch (error) {
        console.error('성향조사 로딩 중 오류 발생:', error);
      } finally {
        this.loading = false;
      }
    },
    nextQuestion() {
      if (this.currentQuestionIndex === 2 && this.mbtiError) {
        return;
      }
      if (!this.isLastQuestion) {
        this.currentQuestionIndex++;
      } else {
        this.showSummary = true;
      }
    },
    prevQuestion() {
      if (!this.isFirstQuestion) {
        this.currentQuestionIndex--;
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
        if (index === 2) {
          this.validateMBTI(question.answer);
        }
      } else {
        question.answered = question.answer !== null;
      }
      this.$forceUpdate();
    },
    getPlaceholder(index) {
      if (this.questions[index].user_analysis_type === '1') {
        const placeholders = {
          2: "ex) INTJ, ISTP, ESFP...",
          3: "ex) 운동, 여행, 패션, 맛집, 요리, 뷰티... ",
          4: "ex) 창의적, 적응력, 긍정적...",
          7: "ex) 김계란, 이사배, 침착맨..."
        }
        return placeholders[index]
      }
    },
    backToQuestions() {
      this.showSummary = false;
      this.currentQuestionIndex = this.questions.length - 1;
    },
    async submitSurvey() {
      const UserAnalysisInputAnswers = this.questions.map(question => ({
        question_id: question.id,
        answer_data: question.answer || ''
      }));

      const userToken = null;

      try {
        const response = await this.requestSubmitAnswerToDjango({ user_analysis_answer: UserAnalysisInputAnswers, userToken: userToken });
        console.log('설문이 제출되었습니다:', response);

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

        this.$router.push({ path: '/user-analysis/result', state: { surveyData } });
      } catch (error) {
        console.error('설문 제출 중 오류 발생: ', error);
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
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("@/assets/images/fixed/chatbot/background_gradient.webp");
  background-size: cover;
}

.main-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 1;
}

.content-overlay {
  position: relative;
  z-index: 2;
}

.overlay-text {
  text-align: center;
  margin-bottom: 20px;
}

.overlay-text h1 {
  font-size: 1.8rem;
  color: #000;
  margin-bottom: 10px;
}

.overlay-text h3 {
  font-size: 1.2rem;
  color: #000;
}

.survey-container {
  background-color: rgba(255, 255, 255, .5);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
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

button:not(:disabled):hover {
  opacity: 0.8;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 5px;
  min-height: 1.2em;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #333;
  margin-top: 20px;
}
</style>