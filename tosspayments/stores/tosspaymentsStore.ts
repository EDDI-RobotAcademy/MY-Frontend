import { defineStore } from 'pinia'
import { createAxiosInstances } from '../../utility/axiosInstance'

interface PaymentConfirmData {
  paymentKey: string
  orderId: string
  amount: number
}

export const useTossPayMentsStore = defineStore('tosspaymentsStore', {
  state: () => ({
    paymentKey: '',
    orderId: '',
    amount: '',
  }),

  actions: {
    async requestCreatePayments(payload: { amount: string }) {
      const { djangoAxiosInst } = createAxiosInstances()
      try {
        const res = await djangoAxiosInst.post('/tosspayments/create-payment', payload)
        return res.data
      } catch (error) {
        console.error('requestCreatePayments() 중 에러 발생')
        throw error
      }
    },

    async requestPaymentConfirmToDjango() {
      const { djangoAxiosInst } = createAxiosInstances()
      try {
        const confirmData: PaymentConfirmData = {
          paymentKey: this.paymentKey,
          orderId: this.orderId,
          amount: parseInt(this.amount)
        }

        const response = await djangoAxiosInst.post('/tosspayments/payment-success', confirmData)
        
        return response.data
      } catch (error) {
        console.error('Payment confirmation failed:', error)
        throw error
      }
    }
  }
})