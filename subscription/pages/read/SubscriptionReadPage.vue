<template>
    <v-container>
      <v-row>
        <!-- 왼쪽: 구독권 상세 정보 -->
        <v-col cols="12" md="8">
          <div v-if="subscriptionContent" class="subscription-article">
            <div class="article-header">
              <h2 class="article-title">{{ subscriptionContent.name }}</h2>
              <div class="article-meta">
                <span class="type">{{ subscriptionContent.type }}</span>
              </div>
            </div>
  
            <div class="article-content">
              {{ subscriptionContent.description }}
            </div>
  
            <!-- 목록으로 돌아가는 버튼 -->
            <div class="back-button">
              <button class="btn btn-back" @click="goBackToList">목록으로</button>
            </div>
          </div>
        </v-col>
  
        <!-- 오른쪽: 가격과 구매 버튼, 관리자용 수정/삭제 버튼 -->
        <v-col cols="12" md="4">
          <div v-if="subscriptionContent" class="subscription-sidebar">
            <div class="price-box">
              <h3>가격: {{ formatPrice(subscriptionContent.price) }} 원</h3>
              <button class="btn btn-buy">구매하기</button>
            </div>
  
            <!-- 관리자만 수정/삭제 버튼 표시 -->
            <div v-if="isAdmin" class="admin-actions">
              <router-link :to="{ name: 'SubscriptionModifyPage', params: { subscriptionId } }">
                <button class="btn btn-modify">수정</button>
              </router-link>
              <button class="btn btn-delete" @click="subscriptionDelete">삭제</button>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useSubscriptionStore } from '~/stores/subscriptionStore';
  import { useAuthenticationStore } from '~/authentication/stores/authenticationStore'; // authenticationStore import
  
  const route = useRoute();
  const router = useRouter();
  const subscriptionStore = useSubscriptionStore();
  const authenticationStore = useAuthenticationStore(); // authenticationStore 사용
  
  const subscriptionId = parseInt(route.params.subscriptionId as string);
  const subscriptionContent = ref<any>(null);
  const error = ref<string>('');
  
  // 관리자 권한 가져오기
  const isAdmin = ref(false);
  
  // 구독권 상세 정보 가져오기
  const fetchSubscriptionContent = async () => {
    try {
      const response = await subscriptionStore.readSubscriptionById(subscriptionId);
      subscriptionContent.value = response;
    } catch (err) {
      error.value = '구독권 정보를 불러오는데 실패했습니다.';
      console.error('Error fetching subscription content:', err);
    }
  };
  
  // 목록으로 돌아가는 함수
  const goBackToList = () => {
    router.push({ name: 'SubscriptionListPage' });
  };
  
  // 컴포넌트가 마운트될 때 관리자 권한 및 구독권 정보 가져오기
  onMounted(async () => {
    // 관리자 여부 확인
    isAdmin.value = authenticationStore.isAdmin;
    console.log("isAdmin: ", isAdmin.value)
  
    // 구독권 정보 가져오기
    await fetchSubscriptionContent();
  });
  
  // 구독권 삭제 함수
  const subscriptionDelete = async () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await subscriptionStore.deleteSubscription(subscriptionId);
        router.push("/subscription/list");
      } catch (err) {
        error.value = '구독권 삭제에 실패했습니다.';
        console.error('Error deleting subscription:', err);
      }
    }
  };
  
  // 가격 포맷 함수
  const formatPrice = (price: number) => {
    return parseFloat(price.toString()).toLocaleString();
  };
  </script>
  
  <style scoped>
  .subscription-article {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
    padding: 20px;
    margin-top: 70px
  }
  
  .article-header {
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
  
  .article-title {
    font-size: 1.5em;
    color: #333;
    margin-bottom: 10px;
  }
  
  .article-meta {
    color: #666;
    font-size: 0.9em;
  }
  
  .article-content {
    min-height: 200px;
    line-height: 1.6;
    color: #333;
    white-space: pre-wrap;
  }
  
  .subscription-sidebar {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
    margin-top: 70px
  }
  
  .price-box {
    margin-bottom: 20px;
  }
  
  .price-box h3 {
    font-size: 1.5em;
    color: #333;
    margin-bottom: 10px;
  }
  
  .btn {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    border: none;
    font-weight: 500;
  }
  
  .btn-buy {
    background-color: #4CAF50;
    color: white;
    margin-bottom: 10px;
    width: 100%;
  }
  
  .btn-modify {
    background-color: #2196F3;
    color: white;
    margin-bottom: 10px;
    width: 100%;
  }
  
  .btn-delete {
    background-color: #f44336;
    color: white;
    width: 100%;
  }
  
  .btn-back {
    background-color: #f0f0f0;
    color: #333;
    width: 100%;
    margin-top: 20px;
  }
  
  .admin-actions {
    margin-top: 20px;
  }
  </style>
  