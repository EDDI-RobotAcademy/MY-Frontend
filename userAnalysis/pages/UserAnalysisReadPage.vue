<template>
    <div class="request-detail-page">
      <h2>요청 ID: {{ requestId }}의 상세 정보</h2>
  
      <!-- 요청 상세 정보 -->
      <div v-if="userAnalysisStore.selectedRequestDetails && userAnalysisStore.selectedRequestDetails.length">
        <ul>
          <!-- 각 질문과 답변 표시 -->
          <li v-for="(answer, index) in userAnalysisStore.selectedRequestDetails" :key="index">
            <strong>질문:</strong> {{ answer.question_text }}
            <br>
            <strong>응답:</strong>
            <!-- answer_text가 있을 경우 해당 텍스트 출력 -->
            <span v-if="answer.answer_text">{{ answer.answer_text }}</span>
            <!-- user_analysis_custom_selection_text가 있을 경우 해당 텍스트 출력 -->
            <span v-else-if="answer.user_analysis_custom_selection_text">{{ answer.user_analysis_custom_selection_text }}</span>
            <!-- 둘 다 없을 경우 빈 값 -->
            <span v-else>응답 없음</span>
          </li>
        </ul>
      </div>
      <p v-else>요청 상세 정보를 불러오는 중입니다...</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useUserAnalysisStore } from '@/stores/userAnalysisStore';
  
  const userAnalysisStore = useUserAnalysisStore();
  const route = useRoute();
  const requestId = ref(route.params.id);
  
  // 요청의 상세 정보를 가져오기
  const loadRequestDetails = async () => {
    try {
      await userAnalysisStore.readUserAnalysisRequestToDjango(requestId.value);
    } catch (error) {
      console.error('요청 상세 정보 불러오기 실패:', error);
    }
  };
  
  onMounted(() => {
    loadRequestDetails();
  });
  </script>
  
  <style scoped>
  .request-detail-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    margin-top: 70px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    background-color: #e9e9e9;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
  }
  </style>
  