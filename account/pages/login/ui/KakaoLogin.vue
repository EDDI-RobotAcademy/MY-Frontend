<template>
    <button class="kakao-login-btn" @click="kakaoLoginClick"></button>
</template>

<script setup>
import { useKakaoAuthenticationStore } from '../../../../kakaoAuthentication/stores/kakaoAuthenticationStore.ts'

const KakaoAuthenticationStore = useKakaoAuthenticationStore()

const kakaoLoginClick = async () => {
    
    await KakaoAuthenticationStore.requestKakaoOauthRedirectionToDjango()
}
</script> 

<style scoped>
.kakao-login-btn {
    margin: 10px 0;
    background-image: url("@/assets/fixed/login/kakao_login_round.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    height: 80px;
    width: 80px;
}
</style>