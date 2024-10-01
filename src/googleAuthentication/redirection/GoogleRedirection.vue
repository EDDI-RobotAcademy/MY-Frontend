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
    ...mapActions(accountModule, ['requestEmailDuplicationCheckToDjango', 'requestCreateNewAccountToDjango']),

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
        if(!response){
          this.registerNewAccount(userInfo.email, userInfo.name)
        }
      }
    },
    async registerNewAccount(email, name) {
      const accountInfo = {
        loginType: 'GOOGLE',
        email: email,
        nickname: name,
      }
      await this.requestCreateNewAccountToDjango(accountInfo)
      console.log('전송한 데이터:', accountInfo)
      console.log('register submitForm email:', email)
    }
  },
  async created() {
    await this.setRedirectData()
  }
}
</script>