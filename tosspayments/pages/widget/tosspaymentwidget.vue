<template>
  <div class="wrapper w-100">
    <div class="max-w-540 w-100">
      <div id="payment-method" class="w-100"></div>
      <div id="agreement" class="w-100"></div>
      <div class="btn-wrapper w-100">
        <button id="payment-request-button" class="btn primary w-100" @click="requestPayment">
          결제하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk';
import { useRoute } from 'vue-router';

const route = useRoute();
const config = useRuntimeConfig();
const TOSS_CLIENT_KEY = config.public.TOSS_CLIENT_KEY;

// URL 파라미터에서 가격과 상품명을 가져옵니다
const amount = {
  currency: "KRW",
  value: parseInt(route.query.price || '0'),
};

const productName = route.query.name || '구독권';

const generateRandomString = () => window.btoa(Math.random()).slice(0, 20);

const initializePayment = async () => {
  const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
  const widgets = tossPayments.widgets({
    customerKey: ANONYMOUS
  });

  await widgets.setAmount(amount);

  await Promise.all([
    widgets.renderPaymentMethods({
      selector: "#payment-method",
      variantKey: "DEFAULT",
    }),
    widgets.renderAgreement({
      selector: "#agreement",
      variantKey: "AGREEMENT"
    }),
  ]);

  return widgets;
};

let paymentWidgets;

onMounted(async () => {
  paymentWidgets = await initializePayment();
});

const requestPayment = async () => {
  try {
    await paymentWidgets.requestPayment({
      orderId: generateRandomString(),
      orderName: productName,
      successUrl: `${window.location.origin}/tosspayments/success`,
      failUrl: `${window.location.origin}/tosspayments/fail`,
      customerEmail: "customer123@gmail.com",
      customerName: "김토스",
      customerMobilePhone: "01012341234",
    });
  } catch (err) {
    console.error('Payment request failed:', err);
  }
};
</script>

<style scoped>
.w-100 {
  width: 100%;
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
  border-radius: 8px;
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

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  overflow: auto;
  margin-top: 50px;
}

</style>