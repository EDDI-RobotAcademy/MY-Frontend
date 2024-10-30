<template>
  <div class="request-list-page">
    <h2>사용자 요청 목록</h2>
    <p>아래 목록에서 요청을 선택하여 상세 정보를 확인하세요.</p>

    <!-- 요청 목록 -->
    <div v-if="requests.length > 0">
      <ul class="request-list">
        <li v-for="request in requests" :key="request.id" @click="viewRequestDetails(request.id)">
          <span class="request-id">NO. {{ request.id }}</span>
          <span class="request-title">{{ request.user_analysis_title }}</span>
          <span class="request-nickname">{{ request.profile_nickname }}</span>
          <span class="created-at">{{ formatDate(request.created_at) }}</span>
        </li>
      </ul>
    </div>
    <p v-else>요청 목록이 없습니다.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserAnalysisStore } from '@/stores/userAnalysisStore';

const userAnalysisStore = useUserAnalysisStore();
const router = useRouter();
const requests = ref([]);

// 날짜를 0000년 00월 00일 00시 00분 00초 형식으로 변환하는 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분 ${seconds}초`;
};

// 페이지 로드 시 요청 목록 가져오기
const loadRequests = async () => {
  try {
    requests.value = await userAnalysisStore.listOwnUserAnalysisRequestToDjango();
  } catch (error) {
    console.error('요청 목록 불러오기 실패:', error);
  }
};

// 특정 요청의 상세 정보 페이지로 이동
const viewRequestDetails = (requestId) => {
  router.push(`/user-analysis/read/${requestId}`);
};

onMounted(() => {
  loadRequests();
});
</script>

<style scoped>
.request-list-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff8f0; /* 밝은 배경색 */
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-top: 70px;
}

.request-list-page h2 {
  color: #ff9033;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.request-list-page p {
  color: #555;
  margin-bottom: 20px;
}

.request-list {
  list-style: none;
  padding: 0;
}

.request-list li {
  display: flex;
  justify-content: space-between; /* 왼쪽 ID와 오른쪽 날짜 시간 정렬 */
  cursor: pointer;
  padding: 12px;
  margin: 8px 0;
  background: #ffe8d8;
  border-radius: 6px;
  border: 1px solid #ff9033;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.request-list li:hover {
  background-color: #ffd1b8;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.request-list li span {
  font-size: 14px;
  color: #333;
}

.request-list li .request-id,
.request-list li .request-title,
.request-list li .request-nickname,
.request-list li .created-at {
  margin-right: 30px; /* 각 요소 사이 간격 추가 */
}

.request-id {
  font-weight: bold;
  color: #ff9033;
}

.request-title {
  flex: 1;
  margin-left: 10px;
  font-weight: 500;
}

.request-nickname {
  font-style: italic;
  color: #777;
}

.created-at {
  font-size: 12px;
  color: #666;
}

</style>
