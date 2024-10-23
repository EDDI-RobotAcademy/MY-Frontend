<template>
    <v-container>
      <v-row justify="center">
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
            <v-card-subtitle class="price-text">
              월 {{ formatPrice(subscription.price) }}원
            </v-card-subtitle>
            <v-card-text>
              <p v-if="subscription.brief_description">{{ subscription.brief_description }}</p>
              <p v-else>설명 없음</p>
              <!-- 혜택 리스트 추가 -->
            </v-card-text>
            <v-card-actions>
              <v-btn 
                class="apply-btn" 
                color="white" 
                block 
                @click="goToDetails(subscription.id)"> <!-- 클릭 이벤트 추가 -->
                Show Details
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSubscriptionStore } from '~/stores/subscriptionStore'
  
  const subscriptions = ref([])
  
  // Vue Router 사용 설정
  const router = useRouter()
  const subscriptionStore = useSubscriptionStore()
  
  // 구독권 목록 불러오기
  const loadSubscriptions = async () => {
    try {
      const data = await subscriptionStore.getSubscription()
      subscriptions.value = data
    } catch (error) {
      console.error('구독권 목록을 불러오는 중 오류 발생:', error)
    }
  }
  
  // 구독권 상세 페이지로 이동하는 함수
  const goToDetails = (subscriptionId) => {
    router.push({ name: 'SubscriptionReadPage', params: { subscriptionId } })
  }
  
  // 가격 포맷 함수
  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString()
  }
  
  onMounted(() => {
    loadSubscriptions()
  })
  </script>
  
  <style scoped>
  .subscription-card {
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 16px;
    text-align: center;
    margin-top: 70px;
  }
  
  .price-text {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
  
  .apply-btn {
    background-color: #ffbc86;
    color: white;
  }
  
  .apply-btn:hover {
    background-color: #ff9033;
  }
  
  .subscription-card .v-card-title {
    background-color: #f5f5f5;
    padding: 16px;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .v-card-actions {
    margin-top: 16px;
  }
  
  .v-list-item {
    padding: 4px 0;
  }
  </style>
  