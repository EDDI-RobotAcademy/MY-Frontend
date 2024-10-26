<template>
  <div class="request-list-page">
    <h2>사용자 요청 목록</h2>
    <p>아래 목록에서 요청을 선택하여 상세 정보를 확인하세요.</p>

    <!-- 요청 목록 -->
    <div v-if="requests.length > 0">
      <ul class="request-list">
        <li v-for="request in requests" :key="request.id" @click="viewRequestDetails(request.id)">
          요청 ID: {{ request.id }} - {{ request.created_at | formatDate }}
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

// 페이지 로드 시 요청 목록 가져오기
const loadRequests = async () => {
  try {
    requests.value = await userAnalysisStore.listAllUserAnalysisRequestToDjango();
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
  background-color: #f9f9f9;
  margin-top: 70px
}

.request-list {
  list-style: none;
  padding: 0;
}

.request-list li {
  cursor: pointer;
  padding: 10px;
  margin: 5px 0;
  background: #f0f0f0;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.request-list li:hover {
  background-color: #e0e0e0;
}
</style>
