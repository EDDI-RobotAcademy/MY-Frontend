<template>
    <div class="wrapper w-100">
        <div class="flex-column align-center confirm-loading w-100 max-w-540">
            <div class="flex-column align-center">
                <img src="https://static.toss.im/lotties/loading-spot-apng.png" width="120" height="120" />
                <h2 class="title text-center">결제 요청까지 성공했어요.</h2>
                <h4 class="text-center description">결제 승인하고 완료해보세요.</h4>
            </div>
            <div class="w-100">
                <button id="confirmPaymentButton" class="btn primary w-100">
                    결제 승인하기
                </button>
            </div>
        </div>
        <div class="flex-column align-center confirm-success w-100 max-w-540">
            <img src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png" width="120" height="120" />
            <h2 class="title">결제를 완료했어요</h2>
            <div class="response-section w-100">
                <div class="flex justify-between">
                    <span class="response-label">결제 금액</span>
                    <span id="amount" class="response-text">{{ tossPaymentsStore.amount }}원</span>
                </div>
                <div class="flex justify-between">
                    <span class="response-label">주문번호</span>
                    <span id="orderId" class="response-text">{{ tossPaymentsStore.orderId }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="response-label">paymentKey</span>
                    <span id="paymentKey" class="response-text">{{ tossPaymentsStore.paymentKey }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'  // ref 추가
import { useRoute } from 'vue-router'
import { useTossPayMentsStore } from '../../stores/tosspaymentsStore'
import { useAccountStore } from '@/account/stores/accountStore'
const accountStore = useAccountStore()
const route = useRoute()
const tossPaymentsStore = useTossPayMentsStore()

const confirmLoadingSection = ref<HTMLElement | null>(null)
const confirmSuccessSection = ref<HTMLElement | null>(null)

onMounted(() => {
    tossPaymentsStore.paymentKey = route.query.paymentKey?.toString() || ''
    tossPaymentsStore.orderId = route.query.orderId?.toString() || ''
    tossPaymentsStore.amount = route.query.amount?.toString() || ''

    confirmLoadingSection.value = document.querySelector('.confirm-loading')
    confirmSuccessSection.value = document.querySelector('.confirm-success')

    handlePaymentSuccess()
})

const handlePaymentSuccess = async () => {
    try {
        const response = await tossPaymentsStore.requestPaymentConfirmToDjango()
        if (response.status === "DONE") {
            
            await accountStore.requestchangeMembershipToDjango()
            if (confirmLoadingSection.value && confirmSuccessSection.value) {
                confirmLoadingSection.value.style.display = 'none'
                confirmSuccessSection.value.style.display = 'flex'
            }
        }
    } catch (error) {
        console.error('결제 승인 실패:', error)
    }
}
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