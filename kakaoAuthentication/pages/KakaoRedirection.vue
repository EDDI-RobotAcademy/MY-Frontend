<template>
    <div></div>
  </template>
  
  <script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { useKakaoAuthenticationStore } from '../stores/kakaoAuthenticationStore'
  import { useAccountStore } from '../../account/stores/accountStore'
  import { useAuthenticationStore } from '../../authentication/stores/authenticationStore.ts'
  
  const route = useRoute()
  const router = useRouter()
  const kakaoAuthStore = useKakaoAuthenticationStore()
  const accountStore = useAccountStore()
  const authStore = useAuthenticationStore()
  
  const accessToken = ref(null)
  
  const setRedirectData = async () => {
    const code = route.query.code as string
    const response = await kakaoAuthStore.requestAccessTokenToDjangoRedirection({ code })
    
    if (response) {
      accessToken.value = response
      await checkUserExists(accessToken.value)
    }
  }
  
  const checkUserExists = async (token: string) => {
    const userInfo = await kakaoAuthStore.requestKakaoUserInfoToDjango({ accessToken: token })
    if (userInfo.kakao_account.email) {
      const response = await accountStore.requestEmailDuplicationCheckToDjango(userInfo.kakao_account.email)
      if (!response) {
        await registerNewAccount(userInfo.kakao_account.email, userInfo.kakao_account.profile.nickname)
        router.push('/')
      } else {
        await registerUserToken(userInfo.kakao_account.email, token)
        router.push('/')
      }
    }
  }
  
  const registerNewAccount = async (email: string, name: string) => {
    const accountInfo = {
      loginType: 'KAKAO',
      email,
      name,
    }
    await accountStore.requestCreateNewAccountToDjango(accountInfo)
    await registerUserToken(email, accessToken.value)
  }
  
  const registerUserToken = async (email: string, token: string) => {
    await authStore.requestAddRedisAccessTokenToDjango(email, token)
  }
  
  onMounted(async () => {
    await setRedirectData()
  })
  </script>