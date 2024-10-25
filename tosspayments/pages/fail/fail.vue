<template>
  <div class="wrapper w-100">
    <div class="flex-column align-center w-100 max-w-540">
      <img src="https://static.toss.im/lotties/error-spot-no-loop-space-apng.png" width="160" height="160" />
      <h2 class="title">결제를 실패했어요</h2>
      <div class="response-section w-100">
        <div class="flex justify-between">
          <span class="response-label">code</span>
          <span id="error-code" class="response-text">{{ errorCode }}</span>
        </div>
        <div class="flex justify-between">
          <span class="response-label">message</span>
          <span id="error-message" class="response-text">{{ errorMessage }}</span>
        </div>
      </div>
      <div class="w-100 button-group">
        <NuxtLink class="btn" to="/">다시 테스트하기</NuxtLink>
        <div class="flex" style="gap: 16px;">
          <a
            class="btn w-100"
            href="https://docs.tosspayments.com/reference/error-codes"
            target="_blank"
            rel="noreferrer noopener"
          >
            에러코드 문서보기
          </a>
          <a
            class="btn w-100"
            href="https://techchat.tosspayments.com"
            target="_blank"
            rel="noreferrer noopener"
          >
            실시간 문의하기
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const errorCode = ref('');
const errorMessage = ref('');

onMounted(() => {
  errorCode.value = route.query.code || '';
  errorMessage.value = route.query.message || '';
});
</script>

<style scoped>
.w-100 {
width: 100%;
}

.h-100 {
height: 100%;
}

a {
text-decoration: none;
text-align: center;
}

.wrapper {
display: flex;
flex-direction: column;
align-items: center;
padding: 24px;
overflow: auto;
}

.max-w-540 {
max-width: 540px;
}

.btn-wrapper {
padding: 0 24px;
}

.btn {
padding: 11px 22px;
border: none;
border-radius:  8px;

background-color: #f2f4f6;
color: #4e5968;
font-weight: 600;
font-size: 17px;
cursor: pointer;
}

.btn.primary {
background-color: #3282f6;
color: #f9fcff;
}

.text-center {
text-align: center;
}

.flex {
display: flex;
}

.flex-column {
display: flex;
flex-direction: column;
}

.justify-center {
justify-content: center;
}

.justify-between {
justify-content: space-between;
}

.align-center {
align-items: center;
}

.confirm-loading {
margin-top: 72px;
height: 400px;
justify-content: space-between;
}


.confirm-success {
display: none;
margin-top: 72px;
}

.button-group {
margin-top: 32px;
display: flex;
flex-direction: column;
justify-content: center;
gap: 16px;
}

.title {
margin-top: 32px;
margin-bottom: 0;
color: #191f28;
font-weight: bold;
font-size: 24px;
}

.description {
margin-top: 8px;
color: #4e5968;
font-size: 17px;
font-weight: 500;
}

.response-section {
margin-top: 60px;
display: flex;
flex-direction: column;
gap: 16px;
font-size: 20px;
}

.response-section .response-label {
font-weight: 600;
color: #333d48;
font-size: 17px;
}

.response-section .response-text {
font-weight: 500;
color: #4e5968;
font-size: 17px;
padding-left: 16px;
word-break: break-word;
text-align: right;
}

.color-grey {
color: #b0b8c1;
}
</style>