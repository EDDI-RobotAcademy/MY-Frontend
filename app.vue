<template>
  <v-app>
    <NavigationBar/>
    <v-main>
      <NuxtPage/>
    </v-main>
  </v-app>
</template>

<script>
import { onMounted } from 'vue'
import { useAuthenticationStore } from '@/authentication/stores/authenticationStore'
import NavigationBar from '/navigationBar/pages/NavigationMenuBar'

export default {
  components: {
    NavigationBar
  },
  setup() {
    const authStore = useAuthenticationStore()

    onMounted(() => {
      // 로컬스토리지에 userToken이 없을 경우 비회원용 guestToken 발급 요청
      if (!localStorage.getItem("userToken")) {
        authStore.requestGuestTokenToDjango()
          .catch(error => console.error("Error initializing guest token:", error))
      }
    })
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');

* {
  font-family: 'Noto Sans KR', sans-serif;
}
</style>