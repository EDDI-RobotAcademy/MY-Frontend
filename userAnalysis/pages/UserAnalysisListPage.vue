<template>
  <div class="request-list-page">
    <h2>사용자 요청 목록</h2>
    <p>아래 목록에서 요청을 선택하여 상세 정보를 확인하세요.</p>

    <!-- 요청 목록 -->
    <div v-if="paginatedRequests.length > 0">
      <ul class="request-list">
        <li v-for="request in paginatedRequests" :key="request.id" @click="viewRequestDetails(request.id)">
          <span class="request-id">NO. {{ request.id }}</span>
          <span class="request-title">{{ request.user_analysis_title }}</span>
          <span class="request-nickname">{{ request.profile_nickname }}</span>
          <span class="created-at">{{ formatDate(request.created_at) }}</span>
        </li>
      </ul>
    </div>
    <p v-else>요청 목록이 없습니다.</p>

    <!-- 페이지 네비게이션 -->
    <div class="pagination" v-if="totalPages > 1">
      <button 
        :disabled="currentPage === 1" 
        @click="currentPage--"
        class="pagination-button"
      >
        이전
      </button>
      <span v-for="page in totalPages" :key="page">
        <button 
          @click="currentPage = page"
          :class="['page-number', { active: currentPage === page }]"
        >
          {{ page }}
        </button>
      </span>
      <button 
        :disabled="currentPage === totalPages" 
        @click="currentPage++"
        class="pagination-button"
      >
        다음
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserAnalysisStore } from '@/stores/userAnalysisStore';

const userAnalysisStore = useUserAnalysisStore();
const router = useRouter();
const requests = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10; // 페이지당 표시할 항목 수

// 날짜 포맷팅 함수
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

// 페이지 당 요청 목록을 나누기
const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return requests.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(requests.value.length / itemsPerPage));

// 페이지 로드 시 요청 목록 가져오기
const loadRequests = async () => {
  try {
    const fetchedRequests = await userAnalysisStore.listOwnUserAnalysisRequestToDjango();
    requests.value = fetchedRequests.reverse(); // 역순으로 정렬하여 최신 요청일이 먼저 나오도록 함
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
  background-color: #fff8f0;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-top: 70px;
}

.request-list-page h2 {
  color: #ff9033;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
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
  justify-content: space-between;
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
  margin-right: 30px;
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

/* 페이지 네비게이션 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
}

.pagination-button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  border-radius: 4px;
}

.pagination-button:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.page-number {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  border-radius: 4px;
}

.page-number.active {
  background-color: #ff9033;
  color: white;
  border-color: #ff9033;
}

.pagination button:hover:not(:disabled) {
  background-color: #f5f5f5;
}
</style>
