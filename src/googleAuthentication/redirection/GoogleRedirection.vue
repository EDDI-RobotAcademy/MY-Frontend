<template>
  <div></div>
</template>
<script>
import { mapActions } from 'vuex'
const googleAuthenticationModule = 'googleAuthenticationModule'
const accountModule = 'accountModule'

export default {
  methods: {
    ...mapActions(googleAuthenticationModule, [
      'requestAccessTokenToDjangoRedirection',
      'requestUserInfoToDjango',
    ]),
    ...mapActions(accountModule, ['requestEmailDuplicationCheckToDjango']),

    async setRedirectData() {
      const code = this.$route.query.code
      console.log('code:', code)

      const response = await this.requestAccessTokenToDjangoRedirection({ code })
      console.log("액세스 토큰", response)

      const userInfo = await this.requestUserInfoToDjango()
      console.log('userInfo:', userInfo)
      console.log('email:', userInfo.email)
      console.log('name:', userInfo.name)

      if(userInfo.email) {
        const response = await this.requestEmailDuplicationCheckToDjango(userInfo.email)
        console.log("기존 유저 확인", response)
      }
    },
  },
  async created() {
    await this.setRedirectData()
  }
}
</script>