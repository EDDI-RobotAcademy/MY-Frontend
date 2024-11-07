<template>
  <div class="main-container">
    <div class="title">
      <h2>쿠잉 서비스 사용 경험 피드백</h2>
      <h4>쿠잉 서비스 사용 경험에 대해 피드백을 남겨주시면<br>더 좋은 서비스를 만드는데에 사용하겠습니다.</h4>
    </div>
    <div class="survey-container">
      <div v-for="(question, index) in questions" :key="index" :ref="el => questionRefs[index] = el" class="question-box">
        <v-card>
          <v-card-title>
            <h2>{{ question.question_text }}
              <span v-if="question.isEssential" class="essential">*</span>
            </h2>
          </v-card-title>
          <v-card-text>

          <!-- 선택형 질문 -->
          <div v-if="question.survey_type === '4'" class="custom">
            <div v-for="selection in selections" :key="selection.id" class="option">
              <div v-if="selection.question_id === question.id">
                <input
                  type="radio"
                  :id="`question-${question.id}-${selection.id}`"
                  :name="'question-' + question.id"
                  :value="selection.custom_text"
                  v-model="question.answer"
                  @change="answerQuestion(index)"
                />
                <label :for="`question-${question.id}-${selection.id}`" class="option-text">{{ selection.custom_text }}</label>
              </div>
            </div>
          </div>

          <!-- 점수 선택지 (survey_type === '2') -->
          <div v-if="question.survey_type === '2'" class="options">
            <div v-for="selection in getSelectionsForQuestion(question)" :key="selection.id" class="option">
              <input
                type="radio"
                :id="`question-${question.id}-${selection.id}`"
                :name="'question-' + question.id"
                :value="selection.value || selection.score"
                v-model="question.answer"
                @change="answerQuestion(index)"
              />
              <label :for="`question-${question.id}-${selection.id}`" class="option-text">
                {{ selection.score }}점
                <span v-if="selection.score !== undefined">
                  {{ selection.score === 1 ? '매우 나쁨' : 
                    selection.score === 2 ? '나쁨' : 
                    selection.score === 3 ? '보통' : 
                    selection.score === 4 ? '좋음' : 
                    selection.score === 5 ? '매우 좋음' : '' }}
                </span>
              </label>
            </div>
          </div>

          <!-- 불리언 선택지 (survey_type === '3') -->
          <div v-if="question.survey_type === '3'" class="options">
            <div v-for="selection in getSelectionsForQuestion(question)" :key="selection.id" class="option">
              <input
                type="radio"
                :id="`question-${question.id}-${selection.id}`"
                :name="'question-' + question.id"
                :value="selection.value || selection.is_true"
                v-model="question.answer"
                @change="answerQuestion(index)"
              />
              <label :for="`question-${question.id}-${selection.id}`" class="option-text">
                {{ selection.is_true ? '예' : '아니오' }}
              </label>
            </div>
          </div>

          <!-- 서술형 질문 -->
          <div v-if="question.survey_type === '1'" class="text-input">
            <textarea
              v-model="question.answer"
              @input="answerQuestion(index)"
              placeholder="여기에 답변을 입력하세요"
              rows="3"
            ></textarea>
          </div>
        </v-card-text>
      </v-card>
    <div class="error-message" v-if="errors[index]" v-html="errors[index]"></div>
  </div>
</div>
    <div class="submit-button-container">
      <button @click="submitSurvey" class="submit-button">제출하기</button>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSurveyStore } from '../../survey/stores/surveyStore'

const router = useRouter()
const surveyStore = useSurveyStore()

const surveyId = ref('1')
const questions = ref([])
const selections = ref([])
const errors = ref([])
const questionRefs = ref([])

const loadSurvey = async () => {
  try {
    // 질문 목록 요청
    const loadedQuestions = await surveyStore.requestListSurveyQuestionToDjango(surveyId.value)
    questions.value = loadedQuestions.map(question => ({
      ...question,
      isEssential: question.is_essential,
      answer: null
    }))
    errors.value = new Array(questions.value.length).fill(null)
    

    let allSelections = []

    // 각 질문에 대해 선택지를 로드하여 selections 배열에 추가
    for (const question of questions.value) {
      

      if (question.survey_type === "1") {
        
        continue
      } 

      let options = await surveyStore.requestListSurveySelectionToDjango(question.id)

      // 선택지가 배열이 아닌 경우 빈 배열로 초기화
      if (!Array.isArray(options)) {
        options = []
      }
      
      // 선택지가 있는 경우 각 질문에 대한 선택지들을 하나의 리스트로 합침
      allSelections = [...allSelections, ...options]

      
    }
    selections.value = allSelections
  } catch (error) {
    console.error('설문조사 로딩 중 오류 발생:', error)
  }
}

const answerQuestion = (index) => {
  // 답변 시 에러 메세지 제거
  errors.value[index] = null
}

const submitSurvey = async () => {
  let hasError = false
  let firstErrorIndex = -1

  questions.value.forEach((question, index) => {
    if(question.isEssential && (!question.answer || question.answer.trim === '')) {
      errors.value[index] = '<span class="mdi mdi-alert-circle error-icon"></span> 필수 질문입니다.'
      hasError = true
      if (firstErrorIndex === -1) {
        firstErrorIndex = index
      }
    } else {
      errors.value[index] = null
    }  
  })

  if (hasError) {
  // 첫 번째 에러로 스크롤 (Vue의 $refs 사용)
    if (firstErrorIndex !== -1 && questionRefs.value[firstErrorIndex]) {
      const errorElement = questionRefs.value[firstErrorIndex]
      
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  return  
  }
  
  const surveyAnswers = questions.value.map(question => ({
    question_id: question.id,
    answer_data: question.answer === 'true' ? true : question.answer === 'false' ? false : question.answer || null // 불리언 값으로 변환
  }))

  const userToken = null

  try {
    const response = await surveyStore.requestSubmitSurveyAnswerToDjango({ survey_answer: surveyAnswers, userToken: userToken })
    
  } catch (error) {
    console.error('설문 제출 중 오류 발생: ', error)
  }
  router.push('/')
}

const getSelectionsForQuestion = (question) => {
  if (question.survey_type === '2') {
    return [1, 2, 3, 4, 5].map(score => ({
      id: score,
      question_id: question.id,
      score: score,
      value: score 
    }))
  } else if (question.survey_type === '3') {
    return [
      { id: 1, question_id: question.id, custom_text: '예', value: 'True', is_true: true },
      { id: 2, question_id: question.id, custom_text: '아니오', value: 'False', is_true: false }
    ]
  } else {
    return question.selections || []
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
  box-sizing: border-box;
}

.main-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.title {
  text-align: center;
  margin-bottom: 40px;
}

.title h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
  margin-top: 60px;
}

.title h4 {
  font-size: 16px;
  color: #666;
  font-weight: normal;
  line-height: 1.5;
}

.survey-container {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.question-box {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.essential {
  color: red;
  font-size: 0.75em;
  position: relative;
}

.question-box h2 {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
}

.customs {
  display: flex;
  flex-direction: column;
}

.option {
  margin-bottom: 10px;
}

.option-container input[type="radio"] {
  margin-right: 20px; /* 라디오 버튼과 텍스트 사이의 간격 */
}

.option-text {
  margin-left: 10px; /* 추가적인 왼쪽 마진 */
  position: relative;
  top: -0.5px
}

.text-input textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.error-message {
  color: red;
  margin-top: 5px;
  font-size: 14px;
}

.submit-button-container {
  text-align: center;
  margin-top: 30px;
}

.submit-button {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #ff9033;
}

</style>