<template>
    <div></div>
</template>
<script>
import { mapActions } from 'vuex'

const kakaoAuthenticationModule = 'kakaoAuthenticationModule'
const accountModule = 'accountModule'

export default {
    methods: {
        ...mapActions(kakaoAuthenticationModule,
            ['requestAccessTokenToDjangoRedirection', 'requestUserInfoToDjango']),
        ...mapActions(accountModule, ['requestEmailDuplicationCheckToDjango', 'requestCreateNewAccountToDjango']),

        async setRedirectData() {
            const code = this.$route.query.code
            console.log('code:', code)

            const response = await this.requestAccessTokenToDjangoRedirection({ code })
            console.log("액세스 토큰", response)
            if(response){
                this.checkUserExists()
            }
        },
        async checkUserExists() {
            const userInfo = await this.requestUserInfoToDjango()
            if(userInfo.kakao_account.email) {
                const response = await this.requestEmailDuplicationCheckToDjango(userInfo.kakao_account.email)
                console.log("기존 유저 확인", response)
                if(!response){
                    this.registerNewAccount(userInfo.kakao_account.email, userInfo.properties.nickname)
                }
            }
        },
        async registerNewAccount(email, nickname) {
            const accountInfo = {
                loginType: 'KAKAO',
                email: email,
                nickname: nickname,
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