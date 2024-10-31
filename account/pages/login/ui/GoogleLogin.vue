<template>
    <button class="google-login-btn" @click="googleLoginClick"></button>
</template>

<script setup>
import { useGoogleAuthenticationStore } from '../../../../googleAuthentication/stores/googleAuthenticationStore.ts'

const GoogleAuthenticationStore = useGoogleAuthenticationStore()

const googleLoginClick = async () => {
    
    await GoogleAuthenticationStore.requestGoogleOauthRedirectionToDjango()
}
</script> 

<style scoped>
.google-login-btn {
    margin: 10px 0;
    background-image: url("@/assets/fixed/login/google_login_round.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    height: 80px;
    width: 80px;
}
</style>