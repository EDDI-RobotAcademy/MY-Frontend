<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <div class="subscription-register">
            <div class="register-header">
              <h2>구독권 등록</h2>
            </div>
  
            <v-form ref="registerForm" v-model="formValid">
              <v-text-field
                v-model="formData.name"
                label="구독권 이름"
                :rules="[v => !!v || '이름을 입력하세요']"
              ></v-text-field>
  
              <v-text-field
                v-model="formData.type"
                label="구독권 유형"
                :rules="[v => !!v || '유형을 입력하세요']"
              ></v-text-field>
  
              <v-textarea
                v-model="formData.brief_description"
                label="간략 설명"
                :rules="[v => !!v || '간략 설명을 입력하세요']"
              ></v-textarea>
  
              <v-textarea
                v-model="formData.description"
                label="구독권 설명"
                :rules="[v => !!v || '설명을 입력하세요']"
              ></v-textarea>
  
              <v-text-field
                v-model="formData.price"
                label="가격"
                type="number"
                :rules="[v => !!v || '가격을 입력하세요']"
              ></v-text-field>
  
              <v-btn :disabled="!formValid" @click="submitSubscription">
                등록
              </v-btn>
            </v-form>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSubscriptionStore } from '~/stores/subscriptionStore'
  import { useAuthenticationStore } from '~/authentication/stores/authenticationStore';
  
  const router = useRouter()
  const subscriptionStore = useSubscriptionStore()
  const authenticationStore = useAuthenticationStore()
  
  const formData = ref({
    name: '',
    type: '',
    brief_description: '',
    description: '',
    price: null
  })
  const formValid = ref(false)
  const error = ref('')
  
  // 구독권 등록 함수
  const submitSubscription = async () => {
    if (!formValid.value) return
  
    try {
      await subscriptionStore.registerSubscription(formData.value)
      alert('구독권이 성공적으로 등록되었습니다.')
      router.push('/subscription/list')
    } catch (err) {
      error.value = '구독권 등록에 실패했습니다.'
      console.error('Error registering subscription:', err)
    }
  }

  onMounted(async () => {
    if (!authenticationStore.isAdmin) {
        router.push("/subscription/list")
    }
  });
  </script>
  
  <style scoped>
  .subscription-register {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
    padding: 20px;
    margin-top: 70px;
  }
  
  .register-header {
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
  
  .register-header h2 {
    font-size: 1.5em;
    color: #333;
    margin-bottom: 10px;
  }
  </style>
  