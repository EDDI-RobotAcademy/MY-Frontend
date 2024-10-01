<template>
  <div class="survey-container">
    <div class="icon-container">
      <v-img class="survey-icon"></v-img>
    </div>
    <h1>COOING은 인플루언서가 되고 싶은 당신을 위해<br>가장 비슷한 롤 모델을 찾고, 성장 방향을 알려주는 서비스에요.</h1>
    <h3>당신이 어떤 성향인지 알고싶어요. 다음 질문들에 답변해주세요!</h3>
    <div :ref="'question-' + currentQuestionIndex" :class="{ 'answered': questions[currentQuestionIndex].answered }">
      <h2>{{ questions[currentQuestionIndex].text }}</h2>
      <div v-if="questions[currentQuestionIndex].type === 'radio'" class="options">
        <label v-for="(option, optionIndex) in questions[currentQuestionIndex].options" :key="optionIndex"
          class="option-label">
          <input type="radio" :name="'question-' + currentQuestionIndex" :value="option"
            v-model="questions[currentQuestionIndex].answer" @change="answerQuestion(currentQuestionIndex)">
          <span class="radio-button"></span>
          <span class="option-text">{{ option }}</span>
        </label>
      </div>
      <div v-else-if="questions[currentQuestionIndex].type === 'text'" class="text-input">
        <input type="text" v-model="questions[currentQuestionIndex].answer" placeholder="여기에 답변을 입력하세요" @input="answerQuestion(currentQuestionIndex)">
      </div>
      <div v-if="questions[currentQuestionIndex].type === 'radio'" class="labels">
        <span>{{ questions[currentQuestionIndex].labels[0] }}</span>
        <span>{{ questions[currentQuestionIndex].labels[1] }}</span>
      </div>
    </div>
    <div class="submit-button-container" v-if="currentQuestionIndex < questions.length - 1">
      <button @click="nextQuestion" class="next-button" :disabled="!questions[currentQuestionIndex].answered">다음</button>
    </div>
    <div class="submit-button-container" v-if="currentQuestionIndex === questions.length - 1">
      <button @click="submitSurvey" :disabled="!allQuestionsAnswered" class="submit-button">제출하기</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
const surveyInputModule = 'surveyInputModule'

export default {
  data() {
    return {
      currentQuestionIndex: 0,
      questions: [
        {
          text: "당신의 성별을 선택하세요.",
          type: "radio",
          options: ["남성", "여성"],
          labels: ["", ""],
          answer: null,
          answered: false
        },
        {
          text: "당신의 연령을 선택하세요.",
          type: "radio",
          options: ["10대", "20대", "30대", "40대", "50대 이상"],
          labels: ["", ""],
          answer: null,
          answered: false
        },
        {
          text: "당신의 관심사를 알려주세요.",
          type: "radio",
          options: ["운동", "여행", "패션", "맛집", "요리", "뷰티"],
          labels: ["", ""],
          answer: null,
          answered: false
        },
        {
          text: "취미가 있으신가요? 자유롭게 답변해주세요.",
          type: "text",
          answer: "",
          answered: false
        },
        {
          text: "당신이 만약 인플루언서가 된다면, 어느 정도까지 당신을 드러낼 수 있나요?",
          type: "radio",
          options: ["얼굴", "목소리", "아예 드러내고 싶지 않음"],
          labels: ["", ""],
          answer: null,
          answered: false
        },
        {
          text: "당신이 만약 인플루언서가 된다면, 주로 어떤 플랫폼에서 활동하고 싶으신가요?",
          type: "radio",
          options: ["유튜브", "인스타그램", "틱톡", "트위터(X)"],
          labels: ["", ""],
          answer: null,
          answered: false
        },
        {
          text: "좋아하거나 자주 보는 인플루언서나 크리에이터가 있으신가요? 자유롭게 답변해주세요.",
          type: "text",
          answer: "",
          answered: false
        },
        // 추가 질문들
      ]
    };
  },
  computed: {
    allQuestionsAnswered() {
      return this.questions.every(q => q.answered || (q.type === 'text' && q.answer.trim() !== ''));
    }
  },
  methods: {
    ...mapActions(surveyInputModule, ['sendSurveyToFastAPI']),

    answerQuestion(index) {
      const question = this.questions[index];
      if (question.type === 'text') {
        question.answered = question.answer.trim() !== '';
      } else {
        question.answered = question.answer !== null;
      }
      this.$forceUpdate(); // Vue의 반응성을 강제로 업데이트
    },
    nextQuestion() {
      this.currentQuestionIndex++;
    },
    submitSurvey() {
      console.log("Survey submitted:", this.questions);
      // API 호출 등을 통해 서버에 데이터를 전송하는 로직 구현 예정
      this.sendSurveyToFastAPI({"data": this.question})
    }
  }
}

</script>

<style scoped>

@font-face {
    font-family: 'YESMyoungjo-Regular';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_13@1.0/YESMyoungjo-Regular.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

.survey-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px;
  font-family: 'YESMyoungjo-Regular', sans-serif;
}

.icon-container {
  margin-top: 30px;
  text-align: center;
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

h1 {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-top: 30px;
  margin-bottom: 10px;
}

h2 {
  font-family: var(--font-family);
  text-align: center;
}

h3 {
  text-align: center;
  font-size: 1.3rem;
  color: #333;
  margin-top: 10px;
  margin-bottom: 100px;
}

.answered {
  opacity: 0.5;
}

.options {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}

.options label:hover .radio-button {
  border-color: #ff9033;
}

.options label:hover .radio-button::after {
  transform: translate(-50%, -50%) scale(1);
}

.option-label {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.text-input input {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin-bottom: 50px;
}

.labels {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
  margin-bottom: 50px;
}

input[type="radio"] {
  display: none;
}

.radio-button {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 2px solid #ccc;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.radio-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ff9033;
  transition: all 0.3s ease;
}

input[type="radio"]:checked+.radio-button {
  border-color: #ff9033;
}

input[type="radio"]:checked+.radio-button::after {
  transform: translate(-50%, -50%) scale(1);
}

.option-text {
  margin-left: 10px;
  font-size: 16px;
  line-height: 40px;
  /* 라디오 버튼의 높이와 동일하게 설정 */
}

.labels {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
  margin-top: 10px;
  margin-bottom: 50px;
}

.submit-button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 30px;
}

.submit-button {
  background-color: #ff9033;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease, opacity 2s ease;
  border-radius: 30px;
  font-weight: bold;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.next-button {
  background-color: #ff9033;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 30px;
  font-weight: bold;
}

.next-button:disabled {
  background-color: #cccccc; /* 비활성화 시 회색 배경 */
  cursor: not-allowed; /* 커서 모양 변경 */
}
</style>