<template>
    <div class="user-analysis-form">
      <h2>사용자 성향분석 등록</h2>
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

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserAnalysisStore } from '../../userAnalysis/stores/userAnalysisStore'

const router = useRouter()
const userAnalysisStore = useUserAnalysisStore()

const UserAnalysisSurvey = reactive({
  title: '',
  description: ''
})

const userAnalysisId = ref(null)
const question = reactive({
  questionText: '',
  userAnalysisType: 1 // 기본값을 서술형으로 설정
})
const questions = ref([])
const questionId = ref(null)
const customSelections = ref([''])

const createUserAnalysis = async () => {
  try {
    const response = await userAnalysisStore.requestCreateUserAnalysisToDjango(UserAnalysisSurvey)
    userAnalysisId.value = response.title
    
  } catch (error) {
    console.error('사용자 성향조사 생성 중 에러 발생: ', error)
  }
}

const addQuestion = async () => {
  if (!userAnalysisId.value) {
    console.error('설문조사가 먼저 생성되어야 합니다.')
    return
  }
  try {
    const payload = {
      user_analysis: userAnalysisId.value,
      question: question.questionText,
      user_analysis_type: question.userAnalysisType 
    }
    const response = await userAnalysisStore.requestCreateUserAnalysisQuestionToDjango(payload)
    questionId.value = response.questionId

    questions.value.push({
      question: question.questionText,
      userAnalysisType: question.userAnalysisType
    })

    if (question.userAnalysisType !== 4) {
      resetQuestionForm()
    }
  } catch (error) {
    console.error('성향조사 질문 등록 중 에러 발생: ', error)
  }
}

const addSelection = () => {
  customSelections.value.push('')
}

const removeSelection = (index) => {
  customSelections.value.splice(index, 1)
}

const handleuserAnalysisTypeChange = () => {
  if (question.userAnalysisType !== 4) {
    customSelections.value = ['']
  }
}

const resetQuestionForm = () => {
  question.questionText = ''
  question.userAnalysisType = 1
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
          await userAnalysisStore.requestCreateUserAnalysisSelectionToDjango(payload)
          
        } catch (error) {
          console.error('성향조사 선택지 등록 중 에러 발생: ', error)
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