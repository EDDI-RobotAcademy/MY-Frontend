<template>
    <v-container>
      <!-- 구독권이 없을 때 메시지 표시 -->
      <v-row v-if="subscriptions.length === 0" justify="center">
        <v-col cols="12" class="text-center empty-message">
          <p>등록된 구독권이 없습니다.</p>
        </v-col>
      </v-row>
      <v-row else justify="center">
        <!-- 구독권 카드 반복 -->
        <v-col
          v-for="(subscription, index) in subscriptions"
          :key="index"
          cols="12"
          md="4"
        >
          <v-card class="subscription-card">
            <v-card-title class="text-h5 font-weight-bold">
              {{ subscription.name }}
            </v-card-title>
            <v-card-text class="description-text">
              <p v-if="subscription.brief_description">{{ subscription.brief_description }}</p>
              <p v-else>설명 없음</p>
            </v-card-text>
            <v-card-subtitle class="price-text">
              월 {{ formatPrice(subscription.price) }}원
            </v-card-subtitle>
            <v-card-actions>
              <v-btn 
                class="apply-btn" 
                color="white" 
                block 
                @click="goToDetails(subscription.id)"> <!-- 클릭 이벤트 추가 -->
                자세히 알아보기
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- 관리자만 구독권 등록 버튼 표시 -->
      <v-row justify="end" v-if="isAdmin">
        <v-btn @click="goToRegisterPage()" class="admin-btn">
          구독권 등록
        </v-btn>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSubscriptionStore } from '~/stores/subscriptionStore'
  import { useAuthenticationStore } from '~/authentication/stores/authenticationStore'

  const subscriptions = ref([])

  const router = useRouter()
  const subscriptionStore = useSubscriptionStore()
  const authenticationStore = useAuthenticationStore()

  const isAdmin = computed(() => authenticationStore.isAdmin)
  
  const loadSubscriptions = async () => {
    try {
      const data = await subscriptionStore.getSubscription()
      subscriptions.value = data
    } catch (error) {
      console.error('구독권 목록을 불러오는 중 오류 발생:', error)
    }
  }

  const goToRegisterPage = () => {
    router.push({ name: 'SubscriptionRegisterPage' })
  }

  const goToDetails = (subscriptionId) => {
    router.push({ name: 'SubscriptionReadPage', params: { subscriptionId } })
  }

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString()
  }

  onMounted(() => {
    loadSubscriptions()
  })
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');

  * {
    font-family: 'Noto Sans KR', sans-serif;
  }

  .subscription-card {
    background-color: rgb(255, 255, 255, 0.8);
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    margin: 150px 50px 0px 50px;
    height: 500px;
    min-width: 300px;
    transition: transform 0.3s ease;
  }

  .subscription-card:hover {
    transform: translateY(-5px); 
  }
  
  .price-text {
    font-size: 24px;
    font-weight: bold;
    color: #000000;
    margin-top: 50px;
  }
  
  .description-text {
    font-size: 18px;
    color: #000000;
    margin-top: 40px;
  }

  .apply-btn {
    margin-top: 30px;
    background-color: #ff9033;
    color: white;
  }
  
  .apply-btn:hover {
    background-color: #cf7022;
  }
  
  .subscription-card .v-card-title {
    background-color: #f4f4f4;
    padding: 16px;
    border-radius: 10px;
  }
  
  .v-card-actions {
    margin-top: 30px;
  }
  
  .v-list-item {
    padding: 4px 0;
  }

  .empty-message {
  margin-top: 200px; 
  font-size: 1.2em;  
}

.admin-btn {
  margin-top: 50px !important; 
  background-color: #ff9033 !important;
  color: white !important;
}
  </style>
