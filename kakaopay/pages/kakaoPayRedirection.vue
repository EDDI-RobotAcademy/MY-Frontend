<template>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createAxiosInstances } from '~/utility/axiosInstance'

const amount = ref('10000')

const requestReadyKakaoPayRedirection = async (
  readyInfo: {
    amount: string;
  }
): Promise<any> => {
  const { djangoAxiosInst } = createAxiosInstances()
  try {
    const response = await djangoAxiosInst.post(
      "/kakao_pay/readyKakaoPay",
      readyInfo
    )
    console.log("결과 출력",response)
  } catch (error) {
    console.error("requestReadyKakaoPayRedirection() 오류 발생", error)
    throw error
  }
}

onMounted(async () => {
  try {
    const response = await requestReadyKakaoPayRedirection({
      amount: amount.value,
    })
    
    if (response.data.next_redirect_pc_url) {
      window.location.href = response.data.next_redirect_pc_url
    }
  } catch (error) {
    console.error('카카오페이 결제 요청 실패:', error)
  }
})
</script>