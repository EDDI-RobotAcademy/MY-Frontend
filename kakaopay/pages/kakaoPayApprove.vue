<template>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { createAxiosInstances } from '~/utility/axiosInstance'

const route = useRoute()
const { djangoAxiosInst } = createAxiosInstances()

const approveKakaoPay = async () => {
    try {
        const pg_token = route.query.pg_token as string
        const storedTid = localStorage.getItem('tid')

        console.log('사용되는 tid:', storedTid)

        if (!storedTid || !pg_token) {
            console.error('필요한 파라미터가 없습니다.')
            return
        }

        const response = await djangoAxiosInst.post('/kakao_pay/approveKakaoPay', {
            tid: storedTid,
            pg_token
        })
        console.log("response 출력", response)
        localStorage.removeItem('kakaoPay_tid')
    } catch (error) {
        console.error('결제 승인 처리 중 오류 발생:', error)
    }
}

onMounted(() => {
    approveKakaoPay()
})
</script>