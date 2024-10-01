<template>
    <div></div>
</template>

<script>
import { mapActions } from 'vuex';
const authenticationModule = 'naverAuthenticationModule'
const accountModule = 'accountModule'

export default {
    methods: {
        ...mapActions(authenticationModule, [
            'requestAccessTokenToDjangoRedirection', 'requestNaverUserInfoToDjango'
        ]),
        ...mapActions(accountModule, ['requestEmailDuplicationCheckToDjango']),

        async setRedirectData() {
            const code = this.$route.query.code
            const response = await this.requestAccessTokenToDjangoRedirection({ code })
            console.log("액세스 토큰", response)
            if(response){
                this.checkUserExists()
            }
        },
        async checkUserExists() {
            const userInfo = await this.requestNaverUserInfoToDjango()
            if(userInfo.response.email) {
                const response = await this.requestEmailDuplicationCheckToDjango(userInfo.response.email)
                console.log("기존 유저 확인", response)
            }
        }
    },
    async created() {
        await this.setRedirectData();
    }
}
</script>