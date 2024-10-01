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
        ...mapActions(accountModule, ['requestEmailDuplicationCheckToDjango']),

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
            }
        },
    },
    async created() {
        await this.setRedirectData()
    }
}
</script>