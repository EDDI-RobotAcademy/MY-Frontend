<template>
  <div class="survey-form">
    <h2>피드백 설문조사 등록</h2>
    <form @submit.prevent="createSurvey">
      <div>
        <label for="title">제목:</label>
        <input id="title" v-model="survey.title" required />
      </div>
      <div>
        <label for="description">설명:</label>
        <textarea id="description" v-model="survey.description" required></textarea>
      </div>
      <v-btn type="submit">설문조사 생성</v-btn>
    </form>
  </div>

  <div v-if="surveyId" class="survey-form">
    <form @submit.prevent="addQuestion">
      <div>
        <label for="question">질문:</label>
        <input id="question" v-model="question.questionText" type="text" required />
        <input type="checkbox" v-model="question.isEssential">필수 질문
      </div>
      <div>
        <label for="surveyType">질문 타입:</label>
        <select v-model="question.surveyType" id="surveyType" @change="handleSurveyTypeChange">
          <option :value="1">서술형</option>
          <option :value="2">5점(Five-score)</option>
          <option :value="3">Boolean</option>
          <option :value="4">선택형(Custom)</option>
        </select>
      </div>
      <v-btn type="submit">질문 추가</v-btn>
      <div v-if="questionId && question.surveyType === 4">
        <h3>선택지 추가</h3>
        <div v-for="(custom, index) in customSelections" :key="index">
          <input v-model="customSelections[index]" type="text" placeholder="선택지 입력" />
          <v-btn @click="removeSelection(index)">삭제</v-btn>
        </div>
        <v-btn @click="addSelection">선택지 추가</v-btn>
        <v-btn @click="submitSelections">선택지 등록</v-btn>
      </div> 
    </form>

    <h3>미리보기</h3>
    <div class="preview">
      <h4>{{ survey.title }}</h4>
      <p>{{ survey.description }}</p>
      <h5>질문 목록:</h5>
      <ul>
        <li v-for="(question, index) in questions" :key="index">{{ question.questionText }} (유형: {{ getSurveyTypeLabel(question.surveyType) }})</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSurveyStore } from '../../survey/stores/surveyStore'
import { useAuthenticationStore } from '@/authentication/stores/authenticationStore'

const router = useRouter()
const authenticationStore = useAuthenticationStore()
const isAdmin = computed(() => authenticationStore.isAdmin)

onMounted(() => {
  if (!isAdmin.value) {
    router.push('/')
  }
})

const surveyStore = useSurveyStore()

const survey = reactive({
  title: '',
  description: ''
})

const surveyId = ref(null)
const question = reactive({
  questionText: '',
  surveyType: 1,
  isEssential: true
})
const questions = ref([])
const customSelections = ref([''])
const questionId = ref(null)

const createSurvey = async () => {
  try {
    const response = await surveyStore.requestCreateSurveyToDjango(survey)
    surveyId.value = response.title
    
  } catch (error) {
    console.error('설문 조사 생성 중 에러 발생: ', error)
  }
}

const addQuestion = async () => {
  if (!surveyId.value) {
    console.error('설문조사가 먼저 생성되어야 합니다.')
    return
  }
  try {
    const payload = {
      survey: surveyId.value,
      question: question.questionText,
      survey_type: question.surveyType,
      is_essential: question.isEssential
    }
    const response = await surveyStore.requestCreateSurveyQuestionToDjango(payload)
    questionId.value = response.questionId

    questions.value.push({
      question: question.questionText,
      surveyType: question.surveyType,
      isEssential: question.isEssential
    })

    if (question.surveyType !== 4) {
      resetQuestionForm()
    }
  } catch (error) {
    console.error('질문 또는 선택지 등록 중 에러 발생: ', error)
  }
}

const addSelection = () => {
  customSelections.value.push('')
}

const removeSelection = (index) => {
  customSelections.value.splice(index, 1)
}

const handleSurveyTypeChange = () => {
  if (question.surveyType !== 4) {
    customSelections.value = ['']
  }
}

const getSurveyTypeLabel = (type) => {
  const types = {
    1: '서술형',
    2: '5점',
    3: '예/아니요',
    4: '선택형'
  }
  return types[type] || '알 수 없음'
}

const resetQuestionForm = () => {
  question.questionText = ''
  question.surveyType = 1
  customSelections.value = ['']
  questionId.value = null
}

const submitSelections = async () => {
  if (customSelections.value.length > 0) {
    for (const selectionText of customSelections.value) {
      if (selectionText.trim() !== '') {
        const payload = {
          question_id: questionId.value,
          custom_text: selectionText
        }
        try {
          await surveyStore.requestCreateSurveySelectionToDjango(payload)
          
        } catch (error) {
          console.error('선택지 등록 중 에러 발생: ', error)
        }
      }
    }
    const currentQuestion = questions.value.find(q => q.id === questionId.value)
    if (currentQuestion) {
      currentQuestion.options = [...customSelections.value]
    }
    resetQuestionForm()
  }
}
</script>

<style>
.survey-form {
  max-width: 600px;
  margin: 100px 200px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.preview {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}
</style>