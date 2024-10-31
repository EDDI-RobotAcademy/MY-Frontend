<template>
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <div v-if="subscriptionContent" class="subscription-article">
            <div class="article-header">
              <h2 class="article-title">구독권 수정</h2>
            </div>
  
            <v-form ref="subscriptionForm" v-model="formValid">
              <v-text-field
                v-model="subscriptionContent.name"
                label="구독권 이름"
                :rules="[v => !!v || '이름을 입력하세요']"
              ></v-text-field>
  
              <v-text-field
                v-model="subscriptionContent.type"
                label="구독권 유형"
                :rules="[v => !!v || '유형을 입력하세요']"
              ></v-text-field>
  
              <v-textarea
                v-model="subscriptionContent.brief_description"
                label="간략 설명"
                :rules="[v => !!v || '간략 설명을 입력하세요']"
              ></v-textarea>
  
              <v-textarea
                v-model="subscriptionContent.description"
                label="구독권 설명"
                :rules="[v => !!v || '설명을 입력하세요']"
              ></v-textarea>
  
              <v-text-field
                v-model="subscriptionContent.price"
                label="가격"
                type="number"
                :rules="[v => !!v || '가격을 입력하세요']"
              ></v-text-field>
  
              <!-- 수정 버튼 -->
              <v-btn :disabled="!formValid" @click="submitSubscription">
                수정
              </v-btn>
            </v-form>
          </div>
  
          <!-- 출력 문제 해결을 위한 메시지 출력 -->
          <div v-else>
            <p>구독권 정보를 불러오고 있습니다...</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useSubscriptionStore } from '~/stores/subscriptionStore';
  import { useAuthenticationStore } from '~/authentication/stores/authenticationStore';
  
  const route = useRoute();
  const router = useRouter();
  const subscriptionStore = useSubscriptionStore();
  const authenticationStore = useAuthenticationStore();
  
  const subscriptionId = parseInt(route.params.subscriptionId as string);
  const subscriptionContent = ref<any>(null);
  const formValid = ref(false);  // 폼 유효성
  const error = ref<string>('');
  
  // 구독권 상세 정보 가져오기
  const fetchSubscriptionContent = async () => {
    try {
      const response = await subscriptionStore.readSubscriptionById(subscriptionId);
        // 확인용 로그 출력
      subscriptionContent.value = response;
    } catch (err) {
      error.value = '구독권 정보를 불러오는데 실패했습니다.';
      console.error('Error fetching subscription content:', err);
    }
  };
  
  // 수정된 구독권 데이터를 전송하는 함수
  const submitSubscription = async () => {
    if (!formValid.value) return; // 폼 유효성 검사 실패 시 처리 중단
  
    try {
      await subscriptionStore.modifySubscription(subscriptionId, subscriptionContent.value);
      alert('구독권이 성공적으로 수정되었습니다.');
      router.push("/subscription/list"); // 수정 완료 후 목록 페이지로 이동
    } catch (err) {
      error.value = '구독권 수정에 실패했습니다.';
      console.error('Error updating subscription:', err);
    }
  };
  

  onMounted(async () => {
    if (!authenticationStore.isAdmin) {
        router.push("/subscription/list")
    }
    await fetchSubscriptionContent();  // 컴포넌트가 마운트될 때 구독권 정보 가져오기
  });
  </script>
  
  <style scoped>
  .subscription-article {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
    padding: 20px;
    margin-top: 70px;
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
  
  .btn {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    border: none;
    font-weight: 500;
  }
  
  .btn-modify {
    background-color: #2196F3;
    color: white;
    margin-bottom: 10px;
    width: 100%;
  }
  </style>
  