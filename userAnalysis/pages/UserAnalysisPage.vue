<template>
  <div class="main-container">
    <div class="content-overlay">
      <div class="survey-icon">
        <v-img alt="Survey Icon"></v-img>
      </div>
      <div class="overlay-text">
        <h1>COOING은 인플루언서를 꿈꾸는 당신의 든든한 성장 파트너예요!</h1>
        <h3>맞춤형 성장 전략을 제안해드리기 위해 간단한 질문들을 준비했어요.<br>당신을 더 잘 이해할 수 있도록, 아래 질문들에 솔직하게 답변해 주세요✨</h3>
      </div>
      <div class="survey-container" v-if="questions.length > 0">
        <h2>{{ questions[currentQuestionIndex].question_text }}</h2>
        <div v-if="questions[currentQuestionIndex].user_analysis_type === '4'" class="options">
          <label v-for="(option, optionIndex) in currentQuestionOptions" :key="optionIndex" class="option-label">
            <input type="radio" :name="'question-' + currentQuestionIndex" :value="option.custom_text"
              v-model="questions[currentQuestionIndex].answer">
            <span class="radio-button"></span>
            <span class="option-text">{{ option.custom_text }}</span>
          </label>
        </div>
        <div v-else-if="questions[currentQuestionIndex].user_analysis_type === '1'" class="text-input">
          <input @keyup.enter="nextQuestionIfNotEmpty" type="text" v-model="questions[currentQuestionIndex].answer"
            :placeholder="getPlaceholder(currentQuestionIndex)">
        </div>
        <div class="button-container">
          <button @click="prevQuestion" class="prev-button" :disabled="currentQuestionIndex === 0">← 이전</button>
          <button @click="nextQuestion" class="next-button" :disabled="!canProceed">
            {{ isLastQuestion ? '제출' : '다음 →' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserAnalysisStore } from '../../userAnalysis/stores/userAnalysisStore'

const router = useRouter()
const userAnalysisStore = useUserAnalysisStore()

const currentQuestionIndex = ref(0)
const userAnalysisInputId = ref('1')
const questions = ref([])
const selections = ref({})

const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1)
const canProceed = computed(() => {
  const currentQuestion = questions.value[currentQuestionIndex.value]
  return currentQuestion.user_analysis_type === '1' 
    ? currentQuestion.answer?.trim() !== ''
    : currentQuestion.answer !== null
})

const currentQuestionOptions = computed(() => {
  const currentQuestion = questions.value[currentQuestionIndex.value]
  return currentQuestion ? selections.value[currentQuestion.id] || [] : []
})

const loadSurvey = async () => {
  try {
    const fetchedQuestions = await userAnalysisStore.requestListQuestionToDjango(userAnalysisInputId.value)
    questions.value = fetchedQuestions

    for (const question of questions.value) {
      const options = await userAnalysisStore.requestListSelectionToDjango(question.id)
      selections.value[question.id] = options
    }
  } catch (error) {
    console.error('성향조사 로딩 중 오류 발생:', error)
  }
}

const nextQuestion = () => {
  if (!isLastQuestion.value) {
    currentQuestionIndex.value++
  } else {
    submitSurvey()
  }
}

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const nextQuestionIfNotEmpty = () => {
  if (canProceed.value) {
    nextQuestion()
  }
}

const getPlaceholder = (index) => {
  const placeholders = {
    3: "ex) 음악, 여행, 패션, 맛집 탐방, 요리, 뷰티... ",
    8: "ex) 침착맨, 김계란, 이사배...",
  }
  return questions.value[index].user_analysis_type === '1' ? placeholders[index] : ''
}

const submitSurvey = async () => {
  const userAnalysisAnswer = questions.value.reduce((acc, question, index) => {
    acc[String(index + 1)] = question.answer || '';
    return acc;
  }, {});

  try {
    const response = await userAnalysisStore.requestSubmitAnswerToDjango({ 
      user_analysis: userAnalysisInputId.value,
      user_analysis_answer: userAnalysisAnswer
    })

    const surveyData = {
      ages: questions.value[0].answer,
      gender: questions.value[1].answer,
      content_categories: questions.value[2].answer,
      visibility: questions.value[3].answer,
      platforms: questions.value[4].answer,
      investment_amount: questions.value[5].answer,
      upload_frequency: questions.value[6].answer,
      interested_influencer: questions.value[7].answer,
    }

    router.push({
      path: '/user-analysis/result',
      query: { 
        surveyData: JSON.stringify(surveyData),
        userAnalysisRequest: response.id
      }
    })
  } catch (error) {
    console.error('설문 제출 중 오류 발생: ', error)
  }
}

onMounted(() => {
  loadSurvey()
})
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
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  background-image: url("@/assets/fixed/chatbot/background_gradient.png");
  background-size: cover;
  background-blend-mode: darken;
}

.survey-icon {
  background-image: url("@/assets/fixed/survey/icon_survey.png");
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
  max-width: 800px;
  width: 100%;
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
</style>