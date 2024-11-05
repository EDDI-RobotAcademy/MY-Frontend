<template>
  <div class="request-detail-page">
    <h2>요청 ID: {{ requestId }}의 상세 정보</h2>

    <div v-if="userAnalysisStore.selectedRequestDetails && userAnalysisStore.selectedRequestDetails.length">
      <ul>
        <li v-for="(answer, index) in userAnalysisStore.selectedRequestDetails" :key="index">
          <p class="question"><strong>질문:</strong> {{ answer.question_text }}</p>
          <p class="answer">
            <strong>응답:</strong>
            <span v-if="answer.answer_text">{{ answer.answer_text }}</span>
            <span v-else-if="answer.user_analysis_custom_selection_text">{{ answer.user_analysis_custom_selection_text }}</span>
            <span v-else>응답 없음</span>
          </p>
        </li>
      </ul>
    </div>
    <p v-else>요청 상세 정보를 불러오는 중입니다...</p>

    <div class="button-container">
      <button @click="viewPastResult" class="view-result-button">결과 보기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserAnalysisStore } from '@/stores/userAnalysisStore';

const userAnalysisStore = useUserAnalysisStore();
const route = useRoute();
const router = useRouter();
const requestId = ref(route.params.id);

const loadRequestDetails = async () => {
  try {
    await userAnalysisStore.readUserAnalysisRequestToDjango(requestId.value);
  } catch (error) {
    console.error('요청 상세 정보 불러오기 실패:', error);
  }
};

const viewPastResult = () => {
  router.push(`/user-analysis/past-result/${requestId.value}`);
};

onMounted(() => {
  loadRequestDetails();
});
</script>

<style scoped>
.request-detail-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff8f0;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-top: 70px;
}

.request-detail-page h2 {
  color: #ff9033;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #ffe8d8;
  border: 1px solid #ff9033;
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 6px;
  transition: background-color 0.3s, box-shadow 0.3s;
}

li:hover {
  background-color: #ffd1b8;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.question {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  margin-bottom: 5px;
}

.answer {
  font-size: 14px;
  color: #555;
}

.answer strong {
  color: #ff9033;
}

p {
  margin: 0;
}

/* 버튼 컨테이너 */
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

/* 결과 보기 버튼 스타일 */
.view-result-button {
  padding: 12px 30px;
  background-color: #ff9033;
  color: white;
  font-weight: bold;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.2s;
}

</style>
