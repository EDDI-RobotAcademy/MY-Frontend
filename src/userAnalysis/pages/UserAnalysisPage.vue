<template>
  <div class="main-container">
    <!-- <video ref="videoPlayer" class="fullscreen-video" :src="videoSource" autoplay muted loop playsinline
      @error="handleError"></video> -->
    <div class="content-overlay">
      <div class="survey-icon">
        <v-img alt="Survey Icon"></v-img>
      </div>
      <div class="overlay-text">
        <h1>COOING은 인플루언서가 되고 싶은 당신을 위해<br>가장 비슷한 롤 모델을 찾고, 성장 방향을 알려주는 서비스에요.</h1>
        <h3>당신이 어떤 성향인지 알고싶어요. 다음 질문들에 답변해주세요!</h3>
      </div>
      <div class="survey-container">
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
          <input @keyup.enter="nextQuestionIfNotEmpty" type="text" v-model="questions[currentQuestionIndex].answer"
            :placeholder="questions[currentQuestionIndex].placeholder" @input="answerQuestion(currentQuestionIndex)">
        </div>
        <button @click="nextQuestion" class="next-button" :class="{ 'submit-button': isLastQuestion }"
          :disabled="!questions[currentQuestionIndex].answered">
          {{ isLastQuestion ? '제출' : '다음' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'IntegratedComponent',
  data() {
    return {
      // videoSource: '/videos/survey-background.mp4',
      // videoPlayer: null,
      currentQuestionIndex: 0,
      questions: [
        {
          text: "당신의 성별을 선택하세요.",
          type: "radio",
          options: ["남성", "여성"],
          answer: null,
          answered: false
        },
        {
          text: "당신의 연령을 선택하세요.",
          type: "radio",
          options: ["10대", "20대", "30대", "40대", "50대 이상"],
          answer: null,
          answered: false
        },
        {
          text: "당신의 MBTI를 알려주세요.",
          type: "text",
          answer: "",
          answered: false,
          placeholder: "ex) INTJ, ISTP, ESFP..."
        },
        {
          text: "당신의 취미 또는 관심사를 알려주세요.",
          type: "text",
          answer: "",
          answered: false,
          placeholder: "ex) 운동, 여행, 패션, 맛집, 요리, 뷰티..."
        },
        {
          text: "당신의 장점을 알려주세요.",
          type: "text",
          answer: "",
          answered: false,
          placeholder: "ex) 창의적, 적응력, 긍정적..."
        },
        {
          text: "당신이 만약 인플루언서가 된다면, 어느 정도까지 당신을 드러낼 수 있나요?",
          type: "radio",
          options: ["얼굴", "목소리", "아예 드러내고 싶지 않음"],
          answer: null,
          answered: false
        },
        {
          text: "당신이 만약 인플루언서가 된다면, 주로 어떤 플랫폼에서 활동하고 싶으신가요?",
          type: "radio",
          options: ["유튜브", "인스타그램", "틱톡", "트위터(X)"],
          answer: null,
          answered: false
        },
        {
          text: "좋아하거나 자주 보는 인플루언서/크리에이터가 있으신가요?",
          type: "text",
          answer: "",
          answered: false,
          placeholder: "ex) 김계란, 이사배, 침착맨... "
        },
      ]
    };
  },
  computed: {
    isLastQuestion() {
      return this.currentQuestionIndex === this.questions.length - 1;
    }
  },
  methods: {
    handleError(event) {
      console.error('Video playback error:', event);
    },
    answerQuestion(index) {
      const question = this.questions[index];
      if (question.type === 'text') {
        question.answered = question.answer.trim() !== '';
      } else {
        question.answered = question.answer !== null;
      }
      this.$forceUpdate();
    },
    nextQuestionIfNotEmpty() {
      if (this.questions[this.currentQuestionIndex].answer.trim() !== '') {
        this.nextQuestion();
      }
    },
    nextQuestion() {
      if (!this.isLastQuestion) {
        this.currentQuestionIndex++;
      } else {
        this.submitSurvey();
      }
    },
    submitSurvey() {
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

      console.log("Survey submitted:", surveyData);
      this.$router.push({
        path: '/chatbot',
        state: { surveyData }
      });
    }
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

/* .fullscreen-video {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
} */

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

.text-input input {
  width: 70%;
  padding: 10px;
  border: 1px solid #000;
  border-radius: 5px;
  font-size: 16px;
  margin-bottom: 12px;
}

.next-button {
  padding: 12px 30px;
  border-radius: 10px;
  border: 0;
  background-color: #ff9033;
  letter-spacing: 1.5px;
  font-size: 15px;
  transition: all 0.3s ease;
  color: hsl(0, 0%, 100%);
  cursor: pointer;
}


.next-button:active {
  background-color: #af682d;
  transition: 200ms;
}

.next-button:disabled {
  cursor: not-allowed;
}

.next-button:disabled:active {
  transform: none;
}

.submit-button {
  padding: 17px 30px;
  border-radius: 10px;
  border: 0;
  background-color: #4CAF50;
  letter-spacing: 1.5px;
  font-size: 15px;
  transition: all 0.3s ease;
  color: hsl(0, 0%, 100%);
  cursor: pointer;
}


.submit-button:active {
  background-color: #2f6a31;
  transition: 200ms;
}

.submit-button:disabled {
  background-color: rgb(69, 69, 69);
  cursor: not-allowed;
}

.submit-button:disabled:active {
  transform: none;
}
</style>