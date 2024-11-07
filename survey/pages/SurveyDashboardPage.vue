<template>
  <div class="dashboard-container">
    <div class="title">
      <h2>설문조사 답변 목록</h2>
      <p>선택한 필터를 기반으로 설문조사 답변을 확인할 수 있습니다.</p>
    </div>
  
    <!-- 필터 섹션 -->
    <div class="filter-section">
      <label for="filter">필터 선택:</label>
      <select v-model="filter">
        <option value="">전체 보기</option>
        <option value="survey">설문조사별 필터</option>
        <option value="question">질문별 필터</option>
        <option value="account">사용자별 필터</option>
        <option value="survey and account">설문조사 및 사용자 필터</option>
      </select>

      <!-- 필터에 따라 표시될 추가 입력 필드 -->
      <div v-if="filter === 'survey' || filter === 'survey and account'">
        <label for="surveyId">설문조사 ID:</label>
        <input type="number" v-model="surveyId" placeholder="설문조사 ID 입력" />
      </div>

      <div v-if="filter === 'question'">
        <label for="questionId">질문 ID:</label>
        <input type="number" v-model="questionId" placeholder="질문 ID 입력" />
      </div>

      <div v-if="filter === 'account' || filter === 'survey and account'">
        <label for="accountId">사용자 ID:</label>
        <input type="number" v-model="accountId" placeholder="사용자 ID 입력" />
      </div>

      <!-- 요청 버튼 -->
      <button @click="loadFilteredAnswers" class="request-button">답변 조회</button>
    </div>
  
    <!-- 설문조사 답변 테이블 -->
    <table v-if="answers.length" class="answer-table">
      <thead>
        <tr>
          <th>설문조사 제목</th>
          <th>질문</th>
          <th>답변</th>
          <th>응답 날짜</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(answer, index) in answers" :key="index">
          <td>{{ answer.survey_title }}</td>
          <td>{{ answer.question_text }}</td>
          <td>{{ answer.answer_text || answer.boolean_selection || answer.five_score_selection || answer.survey_custom_selection_text }}</td>
          <td>{{ new Date(answer.created_at).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>설문조사 답변이 없습니다.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSurveyStore } from '../../survey/stores/surveyStore'
import { useAuthenticationStore } from '@/authentication/stores/authenticationStore'

const router = useRouter()
const surveyStore = useSurveyStore()
const authenticationStore = useAuthenticationStore()
const isAdmin = computed(() => authenticationStore.isAdmin)

const filter = ref('')
const answers = ref([])
const surveyId = ref(null)
const questionId = ref(null)
const accountId = ref(null)

const loadFilteredAnswers = async () => {
  if (!isAdmin.value) {
    router.push('/')
    return
  }

  let payload = {
    filter: filter.value,
    survey_Id: surveyId.value || null,
    question_Id: questionId.value || null,
    account_Id: accountId.value || null
  }

  // 특정 필터에 맞게 불필요한 값을 빈 문자열로 처리
  if (filter.value === 'survey') {
    payload.question_Id = ''
    payload.account_Id = ''
  } else if (filter.value === 'question') {
    payload.survey_Id = ''
    payload.account_Id = ''
  } else if (filter.value === 'account') {
    payload.survey_Id = ''
    payload.question_Id = ''
  } else if (filter.value === 'survey and account') {
    payload.question_Id = ''
  }

  try {
    // 필터링된 답변 리스트 요청
    const response = await surveyStore.requestListSurveyAnswerToDjango(payload)
    answers.value = response // 받아온 답변 데이터를 저장
  } catch (error) {
    console.error('설문조사 답변 로드 중 오류 발생:', error)
  }
}

onMounted(() => {
  if (!isAdmin.value) {
    router.push('/')
    return
  }
  // 페이지 로딩 시 전체 답변 로드
})
</script>

<style scoped>
.dashboard-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
}

.title {
  text-align: center;
  margin-bottom: 20px;
  margin-top: 50px;
}

.filter-section {
  margin-bottom: 20px;
}

.answer-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.answer-table th,
.answer-table td {
  padding: 10px;
  border: 1px solid #ddd;
}

.answer-table th {
  background-color: #f4f4f4;
  text-align: left;
}

.request-button {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.request-button:hover {
  background-color: #5a6268;
}
</style>