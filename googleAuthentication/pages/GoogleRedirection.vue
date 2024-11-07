<template>
    <div></div>
  </template>
  
  <script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { useGoogleAuthenticationStore } from '../stores/googleAuthenticationStore.js';
  import { useAccountStore } from '~/account/stores/accountStore.js';
  import { useAuthenticationStore } from '~/authentication/stores/authenticationStore.js';
  
  const route = useRoute()
  const router = useRouter()
  const googleAuthStore = useGoogleAuthenticationStore()
  const accountStore = useAccountStore()
  const authStore = useAuthenticationStore()
  
  const accessToken = ref(null)
  
  const setRedirectData = async () => {
    const code = route.query.code as string
    const response = await googleAuthStore.requestAccessTokenToDjangoRedirection({ code })
    
    if (response) {
      accessToken.value = response
      await checkUserExists(accessToken.value)
    }
  }
  
  const checkUserExists = async (token: string) => {
    const userInfo = await googleAuthStore.requestGoogleUserInfoToDjango({ accessToken: token })
    if (userInfo.email) {
      const response = await accountStore.requestEmailDuplicationCheckToDjango(userInfo.email)
      if (!response) {
        await registerNewAccount(userInfo.email, userInfo.name)
        router.push('/')
      } else {
        await registerUserToken(userInfo.email, token)
        router.push('/')
      }
    }
  }
  
  const registerNewAccount = async (email: string, name: string) => {
    const accountInfo = {
      loginType: 'GOOGLE',
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