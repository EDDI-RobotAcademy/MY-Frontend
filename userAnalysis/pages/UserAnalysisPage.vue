<template>
  <div class="main-container">
    <div class="content-overlay">
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserAnalysisStore } from '../../userAnalysis/stores/userAnalysisStore'

const router = useRouter()
const userAnalysisStore = useUserAnalysisStore()

const currentQuestionIndex = ref(0)
const userAnalysisInputId = ref('1')
const questions = ref([])
const selections = ref({})

// Computed Properties
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1)

const canProceed = computed(() => {
  const currentQuestion = questions.value[currentQuestionIndex.value]
  if (!currentQuestion) return false

  // 텍스트 입력 타입 (user_analysis_type === '1')인 경우
  if (currentQuestion.user_analysis_type === '1') {
    return currentQuestion.answer && currentQuestion.answer.trim() !== ''
  }
  // 라디오 버튼 타입 (user_analysis_type === '4')인 경우
  else if (currentQuestion.user_analysis_type === '4') {
    return currentQuestion.answer !== undefined && currentQuestion.answer !== null
  }

  return false
})

const currentQuestionOptions = computed(() => {
  const currentQuestion = questions.value[currentQuestionIndex.value]
  return currentQuestion ? selections.value[currentQuestion.id] || [] : []
})

// Methods
const loadSurvey = async () => {
  try {
    const fetchedQuestions = await userAnalysisStore.requestListQuestionToDjango(userAnalysisInputId.value)
    questions.value = fetchedQuestions.map(question => ({
      ...question,
      answer: null // 초기 답변 상태를 null로 설정
    }))

    for (const question of questions.value) {
      const options = await userAnalysisStore.requestListSelectionToDjango(question.id)
      selections.value[question.id] = options
    }
  } catch (error) {
    console.error('성향조사 로딩 중 오류 발생:', error)
  }
}

const nextQuestion = () => {
  if (!canProceed.value) return // 답변이 없으면 진행 불가

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

const getPlaceholder = (index: number) => {
  const placeholders: { [key: number]: string } = {
    2: "ex) 운동, 영화, 맛집, 연애, 게임...",
    7: "ex) 김계란, 침착맨, 이사배..."
  }
  return questions.value[index]?.user_analysis_type === '1' ? placeholders[index] || '' : ''
}

const submitSurvey = async () => {
  // 모든 질문에 답변이 있는지 확인
  const allQuestionsAnswered = questions.value.every(question => {
    if (question.user_analysis_type === '1') {
      return question.answer && question.answer.trim() !== ''
    } else {
      return question.answer !== null && question.answer !== undefined
    }
  })

  if (!allQuestionsAnswered) {
    console.error('모든 질문에 답변해주세요.')
    return
  }

  const userAnalysisAnswer = questions.value.reduce((acc, question, index) => {
    acc[String(index + 1)] = question.answer || '';
    return acc;
  }, {} as { [key: string]: string });

  try {
    const response = await userAnalysisStore.requestSubmitAnswerToDjango({
      user_analysis: Number(userAnalysisInputId.value),
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

    // store에 데이터 저장
    userAnalysisStore.setSurveyDataAndRequest(surveyData, response.id)

    // 결과 페이지로 이동
    router.push('/user-analysis/result')
  } catch (error) {
    if (error.response && error.response.status === 403) {
      // 서버에서 403 상태 코드가 반환된 경우 (비회원 중복 요청)
      alert("비회원은 최초 1회만 요청이 가능합니다.");
    } else {
      console.error('설문 제출 중 오류 발생: ', error);
    }
  }
}

onMounted(() => {
  loadSurvey()
})
</script>

<style scoped>
.main-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #111;
  color: #fff;
}

.survey-icon {
  background-image: url("@/assets/fixed/survey/icon_survey.png");
  filter: brightness(0) saturate(100%) invert(100%);
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
  background-color: rgba(0, 0, 0, 0.8);
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
  color: #fff;
  margin-bottom: 20px;
  text-align: center;
}

.overlay-text h3 {
  font-size: 1.2rem;
  color: #ccc;
  margin-bottom: 20px;
  text-align: center;
}

.survey-container {
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  background-color: rgba(30, 30, 30, 0.9);
  justify-content: center;
  align-items: center;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.survey-container h2 {
  font-size: 1.4rem;
  color: #fff;
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
  color: #fff;
  text-align: center;
}

input[type="radio"] {
  display: none;
}

.radio-button {
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
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
  border: 1px solid #444;
  border-radius: 5px;
  font-size: 16px;
  margin-bottom: 12px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
}

.text-input input::placeholder {
  color: #888;
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
  transition: all 0.3s ease;
}

button:disabled {
  background-color: #333;
  cursor: not-allowed;
  color: #666;
}

button.next-button:not(:disabled) {
  background-color: #ff9033;
  color: white;
}

button.prev-button:not(:disabled) {
  background-color: #444;
  color: white;
}

button:not(:disabled):hover {
  opacity: 0.8;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(255, 144, 51, 0.2);
}
</style>